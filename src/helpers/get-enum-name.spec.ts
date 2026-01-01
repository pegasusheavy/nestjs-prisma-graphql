import { describe, expect, it } from 'vitest';

import { getEnumName } from './get-enum-name.js';

describe('getEnumName', () => {
  it('should extract Role from `${Role}`', () => {
    expect(getEnumName('`${Role}`')).toBe('Role');
  });

  it('should extract Status from `${Status}`', () => {
    expect(getEnumName('`${Status}`')).toBe('Status');
  });

  it('should extract UserRole from `${UserRole}`', () => {
    expect(getEnumName('`${UserRole}`')).toBe('UserRole');
  });

  it('should extract PostStatus from `${PostStatus}`', () => {
    expect(getEnumName('`${PostStatus}`')).toBe('PostStatus');
  });

  it('should handle long enum names', () => {
    expect(getEnumName('`${VeryLongEnumNameWithManyWords}`')).toBe(
      'VeryLongEnumNameWithManyWords',
    );
  });

  it('should handle single character enum name', () => {
    expect(getEnumName('`${A}`')).toBe('A');
  });

  it('should handle underscore in enum name', () => {
    expect(getEnumName('`${USER_ROLE}`')).toBe('USER_ROLE');
  });
});
