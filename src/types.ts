import type { DMMF } from '@prisma/generator-helper';
import type { Project, SourceFile } from 'ts-morph';
import type { WritableDeep } from 'type-fest';

import type { createConfig } from './helpers/create-config.js';
import type { ObjectSettings } from './helpers/object-settings.js';

/**
 * Event emitter interface for type safety across ESM modules
 */
export interface EventEmitter {
  on(type: string | symbol, fn: Function): this;
  once(type: string | symbol, fn: Function): this;
  off(type: string | symbol, nullOrFn?: Function): boolean;
  emit(type: string | symbol, ...args: unknown[]): Promise<boolean>;
  emitSync(type: string | symbol, ...args: unknown[]): boolean;
  removeAllListeners(): void;
  listeners(type: string | symbol): Function[];
}

export type InputType = WritableDeep<DMMF.InputType>;
export type FieldLocation = DMMF.FieldLocation;
export type OutputType = WritableDeep<DMMF.OutputType>;
export type SchemaField = WritableDeep<DMMF.SchemaField>;
// Note: In Prisma 7, the enumTypes in schema uses DatamodelSchemaEnum which has 'values: string[]'
// not SchemaEnum which has 'data: {key, value}[]'
export type SchemaEnum = DMMF.DatamodelSchemaEnum;
export type Model = WritableDeep<DMMF.Model>;
export type SchemaArg = WritableDeep<DMMF.SchemaArg>;
export type Schema = WritableDeep<DMMF.Schema>;
export type Document = WritableDeep<DMMF.Document>;

export type FieldOutputType = SchemaField['outputType'];

export type TypeRecord = Partial<{
  /**
   * TypeScript field/property type
   */
  fieldType: string;
  fieldModule: string;
  graphqlType: string;
  graphqlModule: string;
}>;

export type GeneratorConfiguration = ReturnType<typeof createConfig>;

export type EventArguments = {
  schema: Schema;
  models: Map<string, Model>;
  modelNames: string[];
  modelFields: Map<string, Map<string, Field>>;
  fieldSettings: Map<string, Map<string, ObjectSettings>>;
  config: GeneratorConfiguration;
  project: Project;
  output: string;
  getSourceFile(args: { type: string; name: string }): SourceFile;
  eventEmitter: EventEmitter;
  typeNames: Set<string>;
  removeTypes: Set<string>;
  enums: Record<string, DMMF.DatamodelEnum | undefined>;
  getModelName(name: string): string | undefined;
  /**
   * Input types for this models should be decorated @Type(() => Self)
   */
  classTransformerTypeModels: Set<string>;
  /**
   * Set of model pairs that have circular dependencies (for ESM compatibility)
   * Format: "ModelA:ModelB" where ModelA < ModelB alphabetically
   */
  circularDependencies: Set<string>;
};

export type ImportNameSpec = { name: string; specifier?: string };

export type Field = DMMF.Field;

export type { ObjectSetting, ObjectSettings } from './helpers/object-settings.js';
export type { DMMF } from '@prisma/generator-helper';
