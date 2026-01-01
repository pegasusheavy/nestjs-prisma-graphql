import { describe, expect, it } from 'vitest';

import { ObjectSettings, createObjectSettings } from './object-settings.js';
import { createConfig } from './create-config.js';

describe('ObjectSettings', () => {
  describe('shouldHideField', () => {
    it('should return false when no HideField setting exists', () => {
      const settings = new ObjectSettings();

      expect(settings.shouldHideField({ name: 'password' })).toBe(false);
    });

    it('should return true when HideField with input is set and checking input', () => {
      const settings = new ObjectSettings();
      settings.push({
        name: 'HideField',
        kind: 'Decorator',
        input: true,
        output: false,
        model: false,
        from: '@nestjs/graphql',
      });

      expect(settings.shouldHideField({ name: 'password', input: true })).toBe(true);
      expect(settings.shouldHideField({ name: 'password', output: true })).toBe(false);
    });

    it('should return true when HideField with output is set and checking output', () => {
      const settings = new ObjectSettings();
      settings.push({
        name: 'HideField',
        kind: 'Decorator',
        input: false,
        output: true,
        model: false,
        from: '@nestjs/graphql',
      });

      expect(settings.shouldHideField({ name: 'password', output: true })).toBe(true);
      expect(settings.shouldHideField({ name: 'password', input: true })).toBe(false);
    });

    it('should use match function when provided', () => {
      const settings = new ObjectSettings();
      settings.push({
        name: 'HideField',
        kind: 'Decorator',
        input: false,
        output: false,
        model: false,
        from: '@nestjs/graphql',
        match: (name: string) => name.startsWith('_'),
      });

      expect(settings.shouldHideField({ name: '_internal' })).toBe(true);
      expect(settings.shouldHideField({ name: 'public' })).toBe(false);
    });
  });

  describe('getFieldType', () => {
    it('should return undefined when no FieldType setting exists', () => {
      const settings = new ObjectSettings();

      expect(settings.getFieldType({ name: 'field' })).toBeUndefined();
    });

    it('should return FieldType setting when it exists', () => {
      const settings = new ObjectSettings();
      settings.push({
        name: 'GraphQLEmailAddress',
        kind: 'FieldType',
        input: true,
        output: true,
        model: false,
        from: 'graphql-scalars',
      });

      const result = settings.getFieldType({ name: 'email' });

      expect(result?.name).toBe('GraphQLEmailAddress');
    });

    it('should respect input/output flags', () => {
      const settings = new ObjectSettings();
      settings.push({
        name: 'CustomType',
        kind: 'FieldType',
        input: true,
        output: false,
        model: false,
        from: 'custom',
      });

      expect(settings.getFieldType({ name: 'field', input: true })).toBeDefined();
      expect(settings.getFieldType({ name: 'field', output: true })).toBeUndefined();
    });

    it('should use match function when provided', () => {
      const settings = new ObjectSettings();
      settings.push({
        name: 'EmailType',
        kind: 'FieldType',
        input: true,
        output: true,
        model: false,
        from: 'custom',
        match: (name: string) => name.toLowerCase().includes('email'),
      });

      expect(settings.getFieldType({ name: 'userEmail' })).toBeDefined();
      expect(settings.getFieldType({ name: 'userName' })).toBeUndefined();
    });
  });

  describe('getPropertyType', () => {
    it('should return undefined when no PropertyType setting exists', () => {
      const settings = new ObjectSettings();

      expect(settings.getPropertyType({ name: 'field' })).toBeUndefined();
    });

    it('should return PropertyType setting when it exists', () => {
      const settings = new ObjectSettings();
      settings.push({
        name: 'CustomClass',
        kind: 'PropertyType',
        input: true,
        output: true,
        model: false,
        from: './custom-class',
      });

      const result = settings.getPropertyType({ name: 'field' });

      expect(result?.name).toBe('CustomClass');
    });
  });

  describe('getObjectTypeArguments', () => {
    it('should return options as stringified JSON5', () => {
      const settings = new ObjectSettings();
      const result = settings.getObjectTypeArguments({ description: 'Test' });

      // JSON5.stringify uses single quotes
      expect(result[0]).toContain('description');
    });

    it('should merge ObjectType arguments when present', () => {
      const settings = new ObjectSettings();
      settings.push({
        name: 'ObjectType',
        kind: 'ObjectType',
        input: false,
        output: false,
        model: false,
        from: '@nestjs/graphql',
        arguments: { isAbstract: true },
      });

      const result = settings.getObjectTypeArguments({ description: 'Test' });

      expect(result.some(arg => arg.includes('isAbstract'))).toBe(true);
    });

    it('should prepend custom name when provided in arguments', () => {
      const settings = new ObjectSettings();
      settings.push({
        name: 'ObjectType',
        kind: 'ObjectType',
        input: false,
        output: false,
        model: false,
        from: '@nestjs/graphql',
        arguments: { name: 'CustomName' },
      });

      const result = settings.getObjectTypeArguments({});

      // JSON5.stringify uses single quotes
      expect(result[0]).toBe("'CustomName'");
    });
  });

  describe('fieldArguments', () => {
    it('should return undefined when no Field setting exists', () => {
      const settings = new ObjectSettings();

      expect(settings.fieldArguments()).toBeUndefined();
    });

    it('should return arguments from Field setting', () => {
      const settings = new ObjectSettings();
      settings.push({
        name: '',
        kind: 'Field',
        input: false,
        output: false,
        model: false,
        from: '',
        arguments: { deprecationReason: 'Use newField instead' },
      });

      const result = settings.fieldArguments();

      expect(result?.deprecationReason).toBe('Use newField instead');
    });
  });
});

describe('createObjectSettings', () => {
  const config = createConfig({});

  describe('HideField parsing', () => {
    it('should parse @HideField() decorator', () => {
      const { settings } = createObjectSettings({
        text: '@HideField()',
        config,
      });

      const hideField = settings.find(s => s.name === 'HideField');
      expect(hideField).toBeDefined();
      expect(hideField?.output).toBe(true);
    });

    it('should parse @HideField({ input: true })', () => {
      const { settings } = createObjectSettings({
        text: '@HideField({ input: true })',
        config,
      });

      const hideField = settings.find(s => s.name === 'HideField');
      expect(hideField?.input).toBe(true);
    });

    it('should parse @HideField({ output: true, input: true })', () => {
      const { settings } = createObjectSettings({
        text: '@HideField({ output: true, input: true })',
        config,
      });

      const hideField = settings.find(s => s.name === 'HideField');
      expect(hideField?.output).toBe(true);
      expect(hideField?.input).toBe(true);
    });

    it('should parse @TypeGraphQL.omit as HideField', () => {
      const { settings } = createObjectSettings({
        text: '@TypeGraphQL.omit(output: true)',
        config,
      });

      const hideField = settings.find(s => s.name === 'HideField');
      expect(hideField).toBeDefined();
      expect(hideField?.output).toBe(true);
    });
  });

  describe('FieldType parsing', () => {
    it('should parse @FieldType() decorator', () => {
      const { settings } = createObjectSettings({
        text: '@FieldType("GraphQLEmailAddress")',
        config,
      });

      const fieldType = settings.find(s => s.kind === 'FieldType');
      expect(fieldType).toBeDefined();
      expect(fieldType?.name).toBe('GraphQLEmailAddress');
    });

    it('should parse @FieldType with options object', () => {
      const { settings } = createObjectSettings({
        text: '@FieldType({ name: "CustomType", input: true, output: false })',
        config,
      });

      const fieldType = settings.find(s => s.kind === 'FieldType');
      expect(fieldType?.name).toBe('CustomType');
      expect(fieldType?.input).toBe(true);
      expect(fieldType?.output).toBe(false);
    });
  });

  describe('PropertyType parsing', () => {
    it('should parse @PropertyType() decorator', () => {
      const { settings } = createObjectSettings({
        text: '@PropertyType("CustomClass")',
        config,
      });

      const propertyType = settings.find(s => s.kind === 'PropertyType');
      expect(propertyType).toBeDefined();
      expect(propertyType?.name).toBe('CustomClass');
    });
  });

  describe('@deprecated parsing', () => {
    it('should parse @deprecated with reason', () => {
      const { settings } = createObjectSettings({
        text: '@deprecated Use newField instead',
        config,
      });

      const field = settings.find(s => s.kind === 'Field');
      const args = field?.arguments as Record<string, unknown>;
      expect(args?.deprecationReason).toBe('Use newField instead');
    });
  });

  describe('@complexity parsing', () => {
    it('should parse @complexity with number', () => {
      const { settings } = createObjectSettings({
        text: '@complexity 5',
        config,
      });

      const field = settings.find(s => s.kind === 'Field');
      const args = field?.arguments as Record<string, unknown>;
      expect(args?.complexity).toBe(5);
    });

    it('should default to 1 for invalid complexity values', () => {
      const { settings } = createObjectSettings({
        text: '@complexity invalid',
        config,
      });

      const field = settings.find(s => s.kind === 'Field');
      const args = field?.arguments as Record<string, unknown>;
      expect(args?.complexity).toBe(1);
    });
  });

  describe('documentation extraction', () => {
    it('should extract non-decorator lines as documentation', () => {
      const { documentation } = createObjectSettings({
        text: 'This is a description\nof the field',
        config,
      });

      expect(documentation).toBe('This is a description\nof the field');
    });

    it('should exclude decorator lines from documentation', () => {
      const { documentation } = createObjectSettings({
        text: 'Field description\n@HideField()\nMore description',
        config,
      });

      expect(documentation).toBe('Field description\nMore description');
    });
  });

  describe('ObjectType parsing', () => {
    it('should parse @ObjectType() decorator', () => {
      const { settings } = createObjectSettings({
        text: '@ObjectType("CustomName")',
        config,
      });

      const objectType = settings.find(s => s.kind === 'ObjectType');
      expect(objectType).toBeDefined();
      const args = objectType?.arguments as Record<string, unknown>;
      expect(args?.name).toBe('CustomName');
    });

    it('should parse @ObjectType with isAbstract option', () => {
      const { settings } = createObjectSettings({
        text: '@ObjectType({ isAbstract: true })',
        config,
      });

      const objectType = settings.find(s => s.kind === 'ObjectType');
      const args = objectType?.arguments as Record<string, unknown>;
      expect(args?.isAbstract).toBe(true);
    });
  });

  describe('Validator decorator parsing', () => {
    const configWithValidator = createConfig({
      'fields_Validator_from': 'class-validator',
      'fields_Validator_input': 'true',
    });

    it('should parse @Validator.IsEmail() decorator', () => {
      const { settings } = createObjectSettings({
        text: '@Validator.IsEmail()',
        config: configWithValidator,
      });

      const validator = settings.find(s => s.namespaceImport === 'Validator');
      expect(validator).toBeDefined();
      expect(validator?.name).toBe('Validator.IsEmail');
    });

    it('should parse @Validator.IsNotEmpty() decorator', () => {
      const { settings } = createObjectSettings({
        text: '@Validator.IsNotEmpty()',
        config: configWithValidator,
      });

      const validator = settings.find(s => s.name === 'Validator.IsNotEmpty');
      expect(validator).toBeDefined();
    });

    it('should parse @Validator.MinLength() with argument', () => {
      const { settings } = createObjectSettings({
        text: '@Validator.MinLength(5)',
        config: configWithValidator,
      });

      const validator = settings.find(s => s.name === 'Validator.MinLength');
      expect(validator).toBeDefined();
      expect(validator?.arguments).toContain('5');
    });

    it('should parse @Validator.MaxLength() with argument', () => {
      const { settings } = createObjectSettings({
        text: '@Validator.MaxLength(100)',
        config: configWithValidator,
      });

      const validator = settings.find(s => s.name === 'Validator.MaxLength');
      expect(validator).toBeDefined();
      expect(validator?.arguments).toContain('100');
    });

    it('should parse @Validator.Min() with argument', () => {
      const { settings } = createObjectSettings({
        text: '@Validator.Min(0)',
        config: configWithValidator,
      });

      const validator = settings.find(s => s.name === 'Validator.Min');
      expect(validator).toBeDefined();
      expect(validator?.arguments).toContain('0');
    });

    it('should parse @Validator.Max() with argument', () => {
      const { settings } = createObjectSettings({
        text: '@Validator.Max(150)',
        config: configWithValidator,
      });

      const validator = settings.find(s => s.name === 'Validator.Max');
      expect(validator).toBeDefined();
      expect(validator?.arguments).toContain('150');
    });

    it('should parse @Validator.IsOptional() decorator', () => {
      const { settings } = createObjectSettings({
        text: '@Validator.IsOptional()',
        config: configWithValidator,
      });

      const validator = settings.find(s => s.name === 'Validator.IsOptional');
      expect(validator).toBeDefined();
    });

    it('should parse @Validator.IsString() decorator', () => {
      const { settings } = createObjectSettings({
        text: '@Validator.IsString()',
        config: configWithValidator,
      });

      const validator = settings.find(s => s.name === 'Validator.IsString');
      expect(validator).toBeDefined();
    });

    it('should parse @Validator.IsInt() decorator', () => {
      const { settings } = createObjectSettings({
        text: '@Validator.IsInt()',
        config: configWithValidator,
      });

      const validator = settings.find(s => s.name === 'Validator.IsInt');
      expect(validator).toBeDefined();
    });

    it('should parse @Validator.IsUrl() decorator', () => {
      const { settings } = createObjectSettings({
        text: '@Validator.IsUrl()',
        config: configWithValidator,
      });

      const validator = settings.find(s => s.name === 'Validator.IsUrl');
      expect(validator).toBeDefined();
    });

    it('should parse @Validator.IsUUID() decorator', () => {
      const { settings } = createObjectSettings({
        text: '@Validator.IsUUID()',
        config: configWithValidator,
      });

      const validator = settings.find(s => s.name === 'Validator.IsUUID');
      expect(validator).toBeDefined();
    });

    it('should parse @Validator.Matches() with regex pattern', () => {
      const { settings } = createObjectSettings({
        text: '@Validator.Matches(/^[a-z]+$/)',
        config: configWithValidator,
      });

      const validator = settings.find(s => s.name === 'Validator.Matches');
      expect(validator).toBeDefined();
      expect(validator?.arguments).toContain('/^[a-z]+$/');
    });

    it('should parse multiple validators on same field', () => {
      const { settings } = createObjectSettings({
        text: '@Validator.IsEmail()\n@Validator.IsNotEmpty()\n@Validator.MaxLength(255)',
        config: configWithValidator,
      });

      const validators = settings.filter(s => s.namespaceImport === 'Validator');
      expect(validators).toHaveLength(3);
      expect(validators.map(v => v.name)).toContain('Validator.IsEmail');
      expect(validators.map(v => v.name)).toContain('Validator.IsNotEmpty');
      expect(validators.map(v => v.name)).toContain('Validator.MaxLength');
    });

    it('should parse @Validator.ArrayNotEmpty() decorator', () => {
      const { settings } = createObjectSettings({
        text: '@Validator.ArrayNotEmpty()',
        config: configWithValidator,
      });

      const validator = settings.find(s => s.name === 'Validator.ArrayNotEmpty');
      expect(validator).toBeDefined();
    });

    it('should parse @Validator.ArrayMinSize() with argument', () => {
      const { settings } = createObjectSettings({
        text: '@Validator.ArrayMinSize(1)',
        config: configWithValidator,
      });

      const validator = settings.find(s => s.name === 'Validator.ArrayMinSize');
      expect(validator).toBeDefined();
      expect(validator?.arguments).toContain('1');
    });

    it('should inherit from config for validator settings', () => {
      const { settings } = createObjectSettings({
        text: '@Validator.IsEmail()',
        config: configWithValidator,
      });

      const validator = settings.find(s => s.namespaceImport === 'Validator');
      expect(validator?.from).toBe('class-validator');
      expect(validator?.input).toBe(true);
    });
  });

  describe('Directive parsing', () => {
    it('should parse @Directive() decorator', () => {
      const { settings } = createObjectSettings({
        text: '@Directive("@auth")',
        config,
      });

      const directive = settings.find(s => s.name === 'Directive');
      expect(directive).toBeDefined();
      expect(directive?.from).toBe('@nestjs/graphql');
    });
  });
});
