import { ok } from 'node:assert';
import JSON5 from 'json5';
import { castArray } from 'lodash-es';
import { type ClassDeclarationStructure, StructureKind } from 'ts-morph';

import { getEnumName } from '../helpers/get-enum-name.js';
import { getGraphqlImport } from '../helpers/get-graphql-import.js';
import { getOutputTypeName } from '../helpers/get-output-type-name.js';
import { getPropertyType } from '../helpers/get-property-type.js';
import { ImportDeclarationMap } from '../helpers/import-declaration-map.js';
import { propertyStructure } from '../helpers/property-structure.js';
import type { EventArguments, OutputType } from '../types.js';

const nestjsGraphql = '@nestjs/graphql';

export function outputType(outputTypeArg: OutputType, args: EventArguments): void {
  const { config, eventEmitter, fieldSettings, getModelName, getSourceFile, models } =
    args;
  const importDeclarations = new ImportDeclarationMap();

  const fileType = 'output';
  const modelName = getModelName(outputTypeArg.name) ?? '';
  const model = models.get(modelName);
  const isAggregateOutput =
    model &&
    /(?:Count|Avg|Sum|Min|Max)AggregateOutputType$/.test(outputTypeArg.name) &&
    String(outputTypeArg.name).startsWith(model.name);
  const isCountOutput =
    model?.name && outputTypeArg.name === `${model.name}CountOutputType`;

  if (!config.emitBlocks.outputs && !isCountOutput) return;

  // Get rid of bogus suffixes
  outputTypeArg.name = getOutputTypeName(outputTypeArg.name);

  if (isAggregateOutput) {
    eventEmitter.emitSync('AggregateOutput', { ...args, outputType: outputTypeArg });
  }

  const sourceFile = getSourceFile({
    name: outputTypeArg.name,
    type: fileType,
  });

  const classStructure: ClassDeclarationStructure = {
    decorators: [
      {
        arguments: [],
        name: 'ObjectType',
      },
    ],
    isExported: true,
    kind: StructureKind.Class,
    name: outputTypeArg.name,
    properties: [],
  };

  importDeclarations.add('Field', nestjsGraphql);
  importDeclarations.add('ObjectType', nestjsGraphql);

  for (const field of outputTypeArg.fields) {
    const { isList, location, type } = field.outputType;
    const outputTypeName = getOutputTypeName(String(type));
    const settings = isCountOutput
      ? undefined
      : model && fieldSettings.get(model.name)?.get(field.name);
    const propertySettings = settings?.getPropertyType({
      name: outputTypeArg.name,
      output: true,
    });

    const isCustomsApplicable =
      outputTypeName === model?.fields.find(f => f.name === field.name)?.type;

    field.outputType.type = outputTypeName;

    const propertyType = castArray(
      propertySettings?.name ??
        getPropertyType({
          location,
          type: outputTypeName,
        }),
    );

    const property = propertyStructure({
      hasQuestionToken: isCountOutput ? true : undefined,
      isList,
      isNullable: field.isNullable,
      name: field.name,
      propertyType,
    });

    classStructure.properties?.push(property);

    if (propertySettings) {
      importDeclarations.create({ ...propertySettings });
    } else if (propertyType.some(p => p.includes('Prisma.Decimal'))) {
      importDeclarations.add('Prisma', config.prismaClientImport);
    }

    // Get graphql type
    let graphqlType: string;
    const shouldHideField =
      settings?.shouldHideField({
        name: outputTypeArg.name,
        output: true,
      }) ||
      config.decorate.some(
        d =>
          d.name === 'HideField' &&
          d.from === '@nestjs/graphql' &&
          d.isMatchField(field.name) &&
          d.isMatchType(outputTypeName),
      );

    const fieldType = settings?.getFieldType({
      name: outputTypeArg.name,
      output: true,
    });

    if (fieldType && isCustomsApplicable && !shouldHideField) {
      graphqlType = fieldType.name;
      importDeclarations.create({ ...fieldType });
    } else {
      const graphqlImport = getGraphqlImport({
        config,
        fileType,
        getSourceFile,
        isId: false,
        location,
        sourceFile,
        typeName: outputTypeName,
      });
      const referenceName =
        location === 'enumTypes' ? getEnumName(propertyType[0]) : propertyType[0];

      graphqlType = graphqlImport.name;

      if (
        graphqlImport.specifier &&
        !importDeclarations.has(graphqlImport.name) &&
        ((graphqlImport.name !== outputTypeArg.name && !shouldHideField) ||
          (shouldHideField && referenceName === graphqlImport.name))
      ) {
        importDeclarations.set(graphqlImport.name, {
          moduleSpecifier: graphqlImport.specifier,
          namedImports: [{ name: graphqlImport.name }],
        });
      }
    }

    ok(property.decorators, 'property.decorators is undefined');

    if (shouldHideField) {
      importDeclarations.add('HideField', nestjsGraphql);
      property.decorators.push({ arguments: [], name: 'HideField' });
    } else {
      // Generate `@Field()` decorator
      property.decorators.push({
        arguments: [
          isList ? `() => [${graphqlType}]` : `() => ${graphqlType}`,
          JSON5.stringify({
            ...settings?.fieldArguments(),
            nullable: Boolean(field.isNullable),
          }),
        ],
        name: 'Field',
      });

      if (isCustomsApplicable) {
        for (const options of settings ?? []) {
          if (
            (options.kind === 'Decorator' &&
              options.output &&
              options.match?.(field.name)) ??
            true
          ) {
            property.decorators.push({
              arguments: options.arguments as string[],
              name: options.name,
            });
            ok(options.from, "Missed 'from' part in configuration or field setting");
            importDeclarations.create(options);
          }
        }
      }
    }

    eventEmitter.emitSync('ClassProperty', property, {
      isList,
      location,
      propertyType,
    });
  }

  sourceFile.set({
    statements: [...importDeclarations.toStatements(), classStructure],
  });
}
