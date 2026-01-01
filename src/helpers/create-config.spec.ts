import { describe, it, expect } from 'vitest';
import { createConfig } from './create-config.js';

describe('createConfig', () => {
  it('should create default config', () => {
    const config = createConfig({});

    expect(config.outputFilePattern).toBe('{model}/{name}.{type}.ts');
    expect(config.combineScalarFilters).toBe(false);
    expect(config.noAtomicOperations).toBe(false);
    expect(config.esmCompatible).toBe(false);
    expect(config.emitSingle).toBe(false);
    expect(config.purgeOutput).toBe(false);
  });

  it('should enable esmCompatible when set to true', () => {
    const config = createConfig({ esmCompatible: 'true' });

    expect(config.esmCompatible).toBe(true);
  });

  it('should parse flattened config options', () => {
    const config = createConfig({
      'fields_Validator_from': 'class-validator',
      'fields_Validator_input': 'true',
    });

    expect(config.fields.Validator).toBeDefined();
    expect(config.fields.Validator?.from).toBe('class-validator');
    expect(config.fields.Validator?.input).toBe(true);
  });

  it('should parse Validator config with output flag', () => {
    const config = createConfig({
      'fields_Validator_from': 'class-validator',
      'fields_Validator_input': 'true',
      'fields_Validator_output': 'false',
    });

    expect(config.fields.Validator?.input).toBe(true);
    expect(config.fields.Validator?.output).toBe(false);
  });

  it('should parse Validator config with model flag', () => {
    const config = createConfig({
      'fields_Validator_from': 'class-validator',
      'fields_Validator_model': 'true',
    });

    expect(config.fields.Validator?.model).toBe(true);
  });

  it('should parse multiple field namespaces', () => {
    const config = createConfig({
      'fields_Validator_from': 'class-validator',
      'fields_Validator_input': 'true',
      'fields_Scalars_from': 'graphql-scalars',
      'fields_Scalars_output': 'true',
    });

    expect(config.fields.Validator?.from).toBe('class-validator');
    expect(config.fields.Scalars?.from).toBe('graphql-scalars');
  });

  it('should parse decorate options', () => {
    const config = createConfig({
      'decorate_1_type': 'CreateUserArgs',
      'decorate_1_field': 'data',
      'decorate_1_name': 'ValidateNested',
      'decorate_1_from': 'class-validator',
    });

    expect(config.decorate).toHaveLength(1);
    expect(config.decorate[0].name).toBe('ValidateNested');
    expect(config.decorate[0].from).toBe('class-validator');
  });

  it('should default prismaClientImport to @prisma/client', () => {
    const config = createConfig({});

    expect(config.prismaClientImport).toBe('@prisma/client');
  });

  it('should allow custom prismaClientImport', () => {
    const config = createConfig({ prismaClientImport: '../prisma/client' });

    expect(config.prismaClientImport).toBe('../prisma/client');
  });
});
