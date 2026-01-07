import { ok } from 'node:assert';
import JSON5 from 'json5';
import { castArray } from 'lodash-es';
import pupa from 'pupa';
import { type ClassDeclarationStructure, type StatementStructures, StructureKind } from 'ts-morph';

import { BeforeGenerateField } from '../event-names.js';
import { getGraphqlImport } from '../helpers/get-graphql-import.js';
import { getGraphqlInputType } from '../helpers/get-graphql-input-type.js';
import { getPropertyType } from '../helpers/get-property-type.js';
import { getWhereUniqueAtLeastKeys } from '../helpers/get-where-unique-at-least-keys.js';
import { ImportDeclarationMap } from '../helpers/import-declaration-map.js';
import { isWhereUniqueInputType } from '../helpers/is-where-unique-input-type.js';
import { propertyStructure } from '../helpers/property-structure.js';
import { relativePath } from '../helpers/relative-path.js';
import type { EventArguments, InputType } from '../types.js';

export function inputType(
  args: EventArguments & {
    inputType: InputType;
    fileType: string;
    classDecoratorName: string;
  },
): void {
  const {
    circularDependencies,
    classDecoratorName,
    classTransformerTypeModels,
    config,
    eventEmitter,
    fieldSettings,
    fileType,
    getModelName,
    getSourceFile,
    inputType,
    models,
    output,
    removeTypes,
    typeNames,
  } = args;

  typeNames.add(inputType.name);

  const importDeclarations = new ImportDeclarationMap();
  const sourceFile = getSourceFile({
    name: inputType.name,
    type: fileType,
  });
  const classStructure: ClassDeclarationStructure = {
    kind: StructureKind.Class,
    isExported: true,
    name: inputType.name,
    decorators: [
      {
        name: classDecoratorName,
        arguments: [],
      },
    ],
    properties: [],
  };
  const modelName = getModelName(inputType.name) ?? '';
  const model = models.get(modelName);
  const modelFieldSettings = model && fieldSettings.get(model.name);
  const moduleSpecifier = '@nestjs/graphql';

  // Track types that need lazy loading due to circular dependencies
  const lazyTypes = new Set<string>();

  importDeclarations
    .set('Field', {
      namedImports: [{ name: 'Field' }],
      moduleSpecifier,
    })
    .set(classDecoratorName, {
      namedImports: [{ name: classDecoratorName }],
      moduleSpecifier,
    });

  // Add type registry imports if ESM compatible mode is enabled
  if (config.esmCompatible) {
    const typeRegistryPath = relativePath(
      sourceFile.getFilePath(),
      `${output}/type-registry.ts`,
    );
    importDeclarations.add('registerType', typeRegistryPath);
    importDeclarations.add('getType', typeRegistryPath);
  }

  const useInputType = config.useInputType.find(x =>
    inputType.name.includes(x.typeName),
  );
  const isWhereUnique = isWhereUniqueInputType(inputType.name);

  for (const field of inputType.fields) {
    field.inputTypes = field.inputTypes.filter(t => !removeTypes.has(String(t.type)));

    eventEmitter.emitSync(BeforeGenerateField, field, args);

    const { inputTypes, isRequired, name } = field;

    if (inputTypes.length === 0) {
      continue;
    }

    const usePattern = useInputType?.ALL ?? useInputType?.[name];
    const graphqlInputType = getGraphqlInputType(inputTypes, usePattern);
    const { isList, location, type } = graphqlInputType;
    const typeName = String(type);
    const settings = modelFieldSettings?.get(name);
    const propertySettings = settings?.getPropertyType({
      name: inputType.name,
      input: true,
    });
    const modelField = model?.fields.find(f => f.name === name);
    const isCustomsApplicable = typeName === modelField?.type;
    const atLeastKeys = model && getWhereUniqueAtLeastKeys(model);
    const whereUniqueInputTypeValue =
      isWhereUniqueInputType(typeName) &&
      atLeastKeys &&
      `Prisma.AtLeast<${typeName}, ${atLeastKeys
        .map(n => `'${n}'`)
        .join(' | ')}>`;

    const propertyType = castArray(
      propertySettings?.name ??
        (whereUniqueInputTypeValue ||
          getPropertyType({
            location,
            type: typeName,
          })),
    );

    const hasExclamationToken = Boolean(
      isWhereUnique &&
        config.unsafeCompatibleWhereUniqueInput &&
        atLeastKeys?.includes(name),
    );
    const property = propertyStructure({
      name,
      isNullable: !isRequired,
      hasExclamationToken: hasExclamationToken || undefined,
      hasQuestionToken: hasExclamationToken ? false : undefined,
      propertyType,
      isList,
    });

    classStructure.properties!.push(property);

    if (propertySettings) {
      importDeclarations.create({ ...propertySettings });
    } else if (propertyType.some(p => p.includes('Prisma.Decimal'))) {
      importDeclarations.add('Prisma', config.prismaClientImport);
    } else if (propertyType.some(p => p.startsWith('Prisma.'))) {
      importDeclarations.add('Prisma', config.prismaClientImport);
    }

    // Get graphql type
    let graphqlType: string;
    let useGetType = false;
    const shouldHideField =
      settings?.shouldHideField({
        name: inputType.name,
        input: true,
      }) ||
      config.decorate.some(
        d =>
          d.name === 'HideField' &&
          d.from === moduleSpecifier &&
          d.isMatchField(name) &&
          d.isMatchType(inputType.name),
      );

    const fieldType = settings?.getFieldType({
      name: inputType.name,
      input: true,
    });

    if (fieldType && isCustomsApplicable && !shouldHideField) {
      graphqlType = fieldType.name;
      importDeclarations.create({ ...fieldType });
    } else {
      // Import property type class
      const graphqlImport = getGraphqlImport({
        config,
        sourceFile,
        location,
        typeName,
        getSourceFile,
      });

      graphqlType = graphqlImport.name;
      let referenceName = propertyType[0];
      if (location === 'enumTypes') {
        const parts = referenceName.split(' ');
        referenceName = parts.at(-1) ?? parts[0];
      }

      // In ESM mode, always use getType() for input object types
      const shouldUseLazyType =
        config.esmCompatible && location === 'inputObjectTypes';

      // Handle self-references
      if (graphqlImport.name === inputType.name && shouldUseLazyType) {
        lazyTypes.add(graphqlImport.name);
        useGetType = true;
      } else if (
        graphqlImport.specifier &&
        !importDeclarations.has(graphqlImport.name) &&
        graphqlImport.name !== inputType.name
      ) {
        if (shouldUseLazyType) {
          importDeclarations.addType(graphqlImport.name, graphqlImport.specifier);
          lazyTypes.add(graphqlImport.name);
        } else {
          importDeclarations.set(graphqlImport.name, {
            namedImports: [{ name: graphqlImport.name }],
            moduleSpecifier: graphqlImport.specifier,
          });
        }
      }

      // Check if this type should use lazy loading
      if (lazyTypes.has(graphqlImport.name)) {
        useGetType = true;
      }
    }

    ok(property.decorators, 'property.decorators is undefined');

    if (shouldHideField) {
      importDeclarations.add('HideField', moduleSpecifier);
      property.decorators.push({ name: 'HideField', arguments: [] });
    } else {
      let typeExpression: string;
      if (useGetType) {
        typeExpression = isList
          ? `() => [getType('${graphqlType}')]`
          : `() => getType('${graphqlType}')`;
      } else {
        typeExpression = isList ? `() => [${graphqlType}]` : `() => ${graphqlType}`;
      }

      property.decorators.push({
        name: 'Field',
        arguments: [
          typeExpression,
          JSON5.stringify({
            ...settings?.fieldArguments(),
            nullable: !isRequired,
          }),
        ],
      });

      if (graphqlType === 'GraphQLDecimal') {
        importDeclarations.add('transformToDecimal', 'prisma-graphql-type-decimal');
        importDeclarations.add('Transform', 'class-transformer');
        importDeclarations.add('Type', 'class-transformer');

        property.decorators.push(
          {
            name: 'Type',
            arguments: ['() => Object'],
          },
          {
            name: 'Transform',
            arguments: ['transformToDecimal'],
          },
        );
      } else if (
        location === 'inputObjectTypes' &&
        (modelField?.type === 'Decimal' ||
          [
            'connect',
            'connectOrCreate',
            'create',
            'createMany',
            'data',
            'delete',
            'deleteMany',
            'disconnect',
            'set',
            'update',
            'updateMany',
            'upsert',
            'where',
          ].includes(name) ||
          classTransformerTypeModels.has(getModelName(graphqlType) ?? '') ||
          (modelField?.kind === 'object' &&
            models.get(modelField.type) &&
            models
              .get(modelField.type)
              ?.fields.some(
                f =>
                  f.kind === 'object' && classTransformerTypeModels.has(f.type),
              )))
      ) {
        importDeclarations.add('Type', 'class-transformer');
        if (useGetType) {
          property.decorators.push({
            name: 'Type',
            arguments: [`getType('${graphqlType}')`],
          });
        } else {
          property.decorators.push({ name: 'Type', arguments: [`() => ${graphqlType}`] });
        }
      }

      if (isCustomsApplicable) {
        for (const options of settings ?? []) {
          if (
            (options.kind === 'Decorator' && options.input && options.match?.(name)) ??
            true
          ) {
            property.decorators.push({
              name: options.name,
              arguments: options.arguments as string[],
            });
            ok(options.from, "Missed 'from' part in configuration or field setting");
            importDeclarations.create(options);
          }
        }
      }

      for (const decorate of config.decorate) {
        if (decorate.isMatchField(name) && decorate.isMatchType(inputType.name)) {
          property.decorators.push({
            name: decorate.name,
            arguments: decorate.arguments?.map(x => pupa(x, { propertyType })),
          });
          importDeclarations.create(decorate);
        }
      }
    }

    eventEmitter.emitSync('ClassProperty', property, {
      location,
      isList,
      propertyType,
    });
  }

  // Build statements array
  const statements: (StatementStructures | string)[] = [
    ...importDeclarations.toStatements(),
    classStructure,
  ];

  // Add registerType call if ESM compatible mode is enabled
  if (config.esmCompatible) {
    statements.push(`\nregisterType('${inputType.name}', ${inputType.name});`);
  }

  sourceFile.set({
    statements,
  });
}
