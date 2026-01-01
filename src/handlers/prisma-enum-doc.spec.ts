import { describe, expect, it } from 'vitest';

import { extractEnumValueDocs } from './prisma-enum-doc.js';

describe('extractEnumValueDocs', () => {
  describe('description extraction', () => {
    it('should extract description from documentation', () => {
      const values = [
        { name: 'ADMIN', documentation: 'Administrator role' },
        { name: 'USER', documentation: 'Regular user role' },
      ];

      const result = extractEnumValueDocs(values);

      expect(result).toEqual({
        ADMIN: { description: 'Administrator role' },
        USER: { description: 'Regular user role' },
      });
    });

    it('should handle single value', () => {
      const values = [{ name: 'ACTIVE', documentation: 'Active status' }];

      const result = extractEnumValueDocs(values);

      expect(result).toEqual({
        ACTIVE: { description: 'Active status' },
      });
    });
  });

  describe('deprecation extraction', () => {
    it('should extract deprecation reason from @deprecated', () => {
      const values = [
        { name: 'OLD_VALUE', documentation: '@deprecated Use NEW_VALUE instead' },
      ];

      const result = extractEnumValueDocs(values);

      expect(result).toEqual({
        OLD_VALUE: { deprecationReason: 'Use NEW_VALUE instead' },
      });
    });

    it('should trim deprecation reason', () => {
      const values = [
        { name: 'DEPRECATED', documentation: '@deprecated   Will be removed   ' },
      ];

      const result = extractEnumValueDocs(values);

      expect(result.DEPRECATED).toEqual({
        deprecationReason: 'Will be removed',
      });
    });

    it('should handle @deprecated with no reason', () => {
      const values = [{ name: 'OLD', documentation: '@deprecated' }];

      const result = extractEnumValueDocs(values);

      expect(result.OLD).toEqual({ deprecationReason: '' });
    });
  });

  describe('mixed values', () => {
    it('should handle mix of documented and deprecated values', () => {
      const values = [
        { name: 'ACTIVE', documentation: 'Active status' },
        { name: 'INACTIVE', documentation: '@deprecated Use ARCHIVED instead' },
        { name: 'ARCHIVED', documentation: 'Archived status' },
      ];

      const result = extractEnumValueDocs(values);

      expect(result).toEqual({
        ACTIVE: { description: 'Active status' },
        INACTIVE: { deprecationReason: 'Use ARCHIVED instead' },
        ARCHIVED: { description: 'Archived status' },
      });
    });
  });

  describe('values without documentation', () => {
    it('should skip values without documentation', () => {
      const values = [
        { name: 'DOCUMENTED', documentation: 'Has docs' },
        { name: 'UNDOCUMENTED' },
      ];

      const result = extractEnumValueDocs(values);

      expect(result).toEqual({
        DOCUMENTED: { description: 'Has docs' },
      });
      expect(result.UNDOCUMENTED).toBeUndefined();
    });

    it('should skip values with non-string documentation', () => {
      const values = [
        { name: 'STRING_DOC', documentation: 'String documentation' },
        { name: 'NUMBER_DOC', documentation: 123 },
        { name: 'NULL_DOC', documentation: null },
        { name: 'UNDEFINED_DOC', documentation: undefined },
      ];

      const result = extractEnumValueDocs(values as any);

      expect(Object.keys(result)).toHaveLength(1);
      expect(result.STRING_DOC).toEqual({ description: 'String documentation' });
    });
  });

  describe('empty input', () => {
    it('should return empty object for empty array', () => {
      const result = extractEnumValueDocs([]);

      expect(result).toEqual({});
    });
  });

  describe('edge cases', () => {
    it('should handle empty documentation string', () => {
      const values = [{ name: 'EMPTY', documentation: '' }];

      const result = extractEnumValueDocs(values);

      // Empty string becomes description
      expect(result.EMPTY).toEqual({ description: '' });
    });

    it('should handle documentation with only @deprecated', () => {
      const values = [{ name: 'DEP', documentation: '@deprecated' }];

      const result = extractEnumValueDocs(values);

      expect(result.DEP).toEqual({ deprecationReason: '' });
    });

    it('should handle @deprecated case sensitivity', () => {
      const values = [
        { name: 'CASE1', documentation: '@deprecated reason' },
        { name: 'CASE2', documentation: '@DEPRECATED reason' },
      ];

      const result = extractEnumValueDocs(values);

      // Only lowercase @deprecated is recognized
      expect(result.CASE1).toEqual({ deprecationReason: 'reason' });
      expect(result.CASE2).toEqual({ description: '@DEPRECATED reason' });
    });

    it('should handle multiline documentation', () => {
      const values = [
        { name: 'MULTI', documentation: 'Line 1\nLine 2\nLine 3' },
      ];

      const result = extractEnumValueDocs(values);

      expect(result.MULTI).toEqual({ description: 'Line 1\nLine 2\nLine 3' });
    });
  });
});
