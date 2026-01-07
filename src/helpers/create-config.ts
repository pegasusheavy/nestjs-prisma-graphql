import { ok } from 'node:assert';
import { existsSync } from 'node:fs';

import filenamify from 'filenamify';
import { unflatten } from 'flat';
import JSON5 from 'json5';
import { memoize, merge, trim } from 'lodash-es';
import outmatch from 'outmatch';

type Dictionary<T = unknown> = Record<string, T>;

import { ReExport } from '../handlers/re-export.js';
import type { ImportNameSpec, ObjectSetting } from '../types.js';
import { createEmitBlocks, type EmitBlocksOption } from './create-emit-blocks.js';

type ConfigFieldSetting = Partial<Omit<ObjectSetting, 'name'>>;
type DecorateElement = {
  isMatchField: (s: string) => boolean;
  isMatchType: (s: string) => boolean;
  from: string;
  name: string;
  arguments?: string[];
  namedImport: boolean;
  defaultImport?: string | true;
  namespaceImport?: string;
};
type CustomImport = {
  from: string;
  name: string;
  namedImport: boolean;
  defaultImport?: string | true;
  namespaceImport?: string;
};

export function createConfig(data: Record<string, unknown>) {
  const config = merge({}, unflatten(data, { delimiter: '_' })) as Record<
    string,
    unknown
  >;
  const $warnings: string[] = [];

  const configOutputFilePattern = String(
    config.outputFilePattern || `{model}/{name}.{type}.ts`,
  );

  // Process each path segment separately since filenamify doesn't allow '/' as replacement
  let outputFilePattern = configOutputFilePattern
    .split('/')
    .map(segment => filenamify(segment, { replacement: '-' }))
    .join('/')
    .replaceAll('..', '/')
    .replaceAll(/\/+/g, '/');
  outputFilePattern = trim(outputFilePattern, '/');

  if (outputFilePattern !== configOutputFilePattern) {
    $warnings.push(
      `Due to invalid filepath 'outputFilePattern' changed to '${outputFilePattern}'`,
    );
  }

  if (config.reExportAll) {
    $warnings.push(`Option 'reExportAll' is deprecated, use 'reExport' instead`);
    if (toBoolean(config.reExportAll)) {
      config.reExport = 'All';
    }
  }

  const fields: Record<string, ConfigFieldSetting | undefined> = Object.fromEntries(
    Object.entries<Dictionary<string | undefined>>(
      (config.fields ?? {}) as Record<string, Dictionary<string | undefined>>,
    )
      .filter(({ 1: value }) => typeof value === 'object')
      .map(([name, value]) => {
        const fieldSetting: ConfigFieldSetting = {
          arguments: [],
          output: toBoolean(value.output),
          input: toBoolean(value.input),
          model: toBoolean(value.model),
          from: value.from,
          defaultImport: toBoolean(value.defaultImport) ? true : value.defaultImport,
          namespaceImport: value.namespaceImport,
        };
        return [name, fieldSetting];
      }),
  );

  const decorate: DecorateElement[] = [];
  const configDecorate: (Record<string, string> | undefined)[] = Object.values(
    (config.decorate as Record<string, Record<string, string> | undefined>) || {},
  );

  for (const element of configDecorate) {
    if (!element) continue;
    ok(
      element.from && element.name,
      `Missed 'from' or 'name' part in configuration for decorate`,
    );
    decorate.push({
      isMatchField: outmatch(element.field, { separator: false }),
      isMatchType: outmatch(element.type, { separator: false }),
      from: element.from,
      name: element.name,
      namedImport: toBoolean(element.namedImport),
      defaultImport: toBoolean(element.defaultImport) ? true : element.defaultImport,
      namespaceImport: element.namespaceImport,
      arguments: element.arguments ? JSON5.parse(element.arguments) : undefined,
    });
  }

  const customImport: CustomImport[] = [];
  const configCustomImport: (Record<string, string> | undefined)[] = Object.values(
    (config.customImport as Record<string, Record<string, string> | undefined>) || {},
  );
  for (const element of configCustomImport) {
    if (!element) continue;
    ok(
      element.from && element.name,
      `Missed 'from' or 'name' part in configuration for customImport`,
    );
    customImport.push({
      from: element.from,
      name: element.name,
      namedImport: toBoolean(element.namedImport),
      defaultImport: toBoolean(element.defaultImport) ? true : element.defaultImport,
      namespaceImport: element.namespaceImport,
    });
  }
  return {
    outputFilePattern,
    tsConfigFilePath: createTsConfigFilePathValue(config.tsConfigFilePath),
    prismaClientImport: createPrismaImport(config.prismaClientImport),
    combineScalarFilters: toBoolean(config.combineScalarFilters),
    noAtomicOperations: toBoolean(config.noAtomicOperations),
    reExport: (ReExport[String(config.reExport) as keyof typeof ReExport] || ReExport.None) as ReExport,
    emitSingle: toBoolean(config.emitSingle),
    emitCompiled: toBoolean(config.emitCompiled),
    emitBlocks: createEmitBlocks(config.emitBlocks as EmitBlocksOption[]),
    omitModelsCount: toBoolean(config.omitModelsCount),
    $warnings,
    fields,
    purgeOutput: toBoolean(config.purgeOutput),
    useInputType: createUseInputType(config.useInputType as Record<string, ConfigInputItem>),
    noTypeId: toBoolean(config.noTypeId),
    requireSingleFieldsInWhereUniqueInput: toBoolean(
      config.requireSingleFieldsInWhereUniqueInput,
    ),
    unsafeCompatibleWhereUniqueInput: toBoolean(
      config.unsafeCompatibleWhereUniqueInput,
    ),
    graphqlScalars: (config.graphqlScalars || {}) as Record<
      string,
      ImportNameSpec | undefined
    >,
    decorate,
    customImport,
    esmCompatible: toBoolean(config.esmCompatible),
  };
}

type ConfigInputItem = {
  typeName: string;
  ALL?: string;
  [index: string]: string | undefined;
};

const tsConfigFileExists = memoize((filePath: string) => {
  return existsSync(filePath);
});

function createTsConfigFilePathValue(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (tsConfigFileExists('tsconfig.json')) return 'tsconfig.json';
}

function createPrismaImport(value: unknown): string {
  if (typeof value === 'string') return value;
  return '@prisma/client';
}

function createUseInputType(data?: Record<string, ConfigInputItem>) {
  if (!data) {
    return [];
  }
  const result: ConfigInputItem[] = [];
  for (const [typeName, useInputs] of Object.entries(data)) {
    const entry: ConfigInputItem = {
      typeName,
      ALL: undefined,
    };
    if (useInputs.ALL) {
      entry.ALL = useInputs.ALL;
      delete useInputs.ALL;
    }

    for (const [propertyName, pattern] of Object.entries(useInputs)) {
      entry[propertyName] = pattern;
    }

    result.push(entry);
  }
  return result;
}

function toBoolean(value: unknown) {
  return ['true', '1', 'on'].includes(String(value));
}
