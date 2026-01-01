import { describe, expect, it } from 'vitest';

import { pascalCase } from './pascal-case.js';

describe('pascalCase', () => {
  it('should convert camelCase to PascalCase', () => {
    expect(pascalCase('camelCase')).toBe('CamelCase');
    expect(pascalCase('myVariable')).toBe('MyVariable');
  });

  it('should convert snake_case to PascalCase', () => {
    expect(pascalCase('snake_case')).toBe('SnakeCase');
    expect(pascalCase('my_variable_name')).toBe('MyVariableName');
  });

  it('should convert kebab-case to PascalCase', () => {
    expect(pascalCase('kebab-case')).toBe('KebabCase');
    expect(pascalCase('my-component-name')).toBe('MyComponentName');
  });

  it('should handle single words', () => {
    expect(pascalCase('word')).toBe('Word');
    expect(pascalCase('UPPER')).toBe('Upper');
  });

  it('should handle already PascalCase strings', () => {
    expect(pascalCase('PascalCase')).toBe('PascalCase');
    expect(pascalCase('MyComponent')).toBe('MyComponent');
  });

  it('should handle empty string', () => {
    expect(pascalCase('')).toBe('');
  });

  it('should handle strings with numbers', () => {
    expect(pascalCase('user2profile')).toBe('User2Profile');
    expect(pascalCase('get_user_by_id_123')).toBe('GetUserById123');
  });

  it('should handle strings with spaces', () => {
    expect(pascalCase('hello world')).toBe('HelloWorld');
    expect(pascalCase('  spaced  out  ')).toBe('SpacedOut');
  });

  it('should handle mixed case inputs', () => {
    expect(pascalCase('XMLHttpRequest')).toBe('XmlHttpRequest');
    expect(pascalCase('getHTTPResponse')).toBe('GetHttpResponse');
  });
});
