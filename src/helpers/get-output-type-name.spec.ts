import { describe, expect, it } from 'vitest';

import { getOutputTypeName } from './get-output-type-name.js';

describe('getOutputTypeName', () => {
  describe('OutputType suffix removal', () => {
    it('should remove OutputType suffix from UserOutputType', () => {
      expect(getOutputTypeName('UserOutputType')).toBe('User');
    });

    it('should remove OutputType suffix from PostOutputType', () => {
      expect(getOutputTypeName('PostOutputType')).toBe('Post');
    });

    it('should remove OutputType suffix from CommentCountOutputType', () => {
      expect(getOutputTypeName('CommentCountOutputType')).toBe('CommentCount');
    });
  });

  describe('Output suffix removal', () => {
    it('should remove Output suffix from UserOutput', () => {
      expect(getOutputTypeName('UserOutput')).toBe('User');
    });

    it('should remove Output suffix from PostOutput', () => {
      expect(getOutputTypeName('PostOutput')).toBe('Post');
    });

    it('should remove Output suffix from AggregateUserOutput', () => {
      expect(getOutputTypeName('AggregateUserOutput')).toBe('AggregateUser');
    });
  });

  describe('No suffix to remove', () => {
    it('should return same name when no suffix matches', () => {
      expect(getOutputTypeName('User')).toBe('User');
    });

    it('should return same name for CreateInput', () => {
      expect(getOutputTypeName('UserCreateInput')).toBe('UserCreateInput');
    });

    it('should return same name for WhereInput', () => {
      expect(getOutputTypeName('UserWhereInput')).toBe('UserWhereInput');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string', () => {
      expect(getOutputTypeName('')).toBe('');
    });

    it('should handle just OutputType', () => {
      expect(getOutputTypeName('OutputType')).toBe('');
    });

    it('should handle just Output', () => {
      expect(getOutputTypeName('Output')).toBe('');
    });

    it('should not remove OutputType from middle of name', () => {
      expect(getOutputTypeName('OutputTypeUser')).toBe('OutputTypeUser');
    });

    it('should be case sensitive', () => {
      expect(getOutputTypeName('Useroutputtype')).toBe('Useroutputtype');
      expect(getOutputTypeName('Useroutput')).toBe('Useroutput');
    });
  });
});
