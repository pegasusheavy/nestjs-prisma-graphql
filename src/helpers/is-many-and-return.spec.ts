import { describe, expect, it } from 'vitest';

import { isManyAndReturnOutputType } from './is-many-and-return.js';

describe('isManyAndReturnOutputType', () => {
  describe('createMany patterns', () => {
    it('should return true for CreateManyUserAndReturnOutputType', () => {
      expect(isManyAndReturnOutputType('CreateManyUserAndReturnOutputType')).toBe(
        true,
      );
    });

    it('should return true for CreateManyPostAndReturnOutputType', () => {
      expect(isManyAndReturnOutputType('CreateManyPostAndReturnOutputType')).toBe(
        true,
      );
    });

    it('should return true for CreateManyUserAndReturn', () => {
      expect(isManyAndReturnOutputType('CreateManyUserAndReturn')).toBe(true);
    });
  });

  describe('updateMany patterns', () => {
    it('should return true for UpdateManyUserAndReturnOutputType', () => {
      expect(isManyAndReturnOutputType('UpdateManyUserAndReturnOutputType')).toBe(
        true,
      );
    });

    it('should return true for UpdateManyPostAndReturnOutputType', () => {
      expect(isManyAndReturnOutputType('UpdateManyPostAndReturnOutputType')).toBe(
        true,
      );
    });

    it('should return true for UpdateManyUserAndReturn', () => {
      expect(isManyAndReturnOutputType('UpdateManyUserAndReturn')).toBe(true);
    });
  });

  describe('case insensitivity', () => {
    it('should handle lowercase createMany', () => {
      expect(isManyAndReturnOutputType('createmanyuserandreturnoutputtype')).toBe(
        true,
      );
    });

    it('should handle mixed case', () => {
      expect(isManyAndReturnOutputType('CREATEMANYUSERANDRETURNOUTPUTTYPE')).toBe(
        true,
      );
    });
  });

  describe('non-matching patterns', () => {
    it('should return false for User', () => {
      expect(isManyAndReturnOutputType('User')).toBe(false);
    });

    it('should return false for UserCreateInput', () => {
      expect(isManyAndReturnOutputType('UserCreateInput')).toBe(false);
    });

    it('should return false for CreateOneUserArgs', () => {
      expect(isManyAndReturnOutputType('CreateOneUserArgs')).toBe(false);
    });

    it('should return false for UpdateOneUserArgs', () => {
      expect(isManyAndReturnOutputType('UpdateOneUserArgs')).toBe(false);
    });

    it('should return false for CreateManyUser (no AndReturn)', () => {
      expect(isManyAndReturnOutputType('CreateManyUser')).toBe(false);
    });

    it('should return false for UserOutputType', () => {
      expect(isManyAndReturnOutputType('UserOutputType')).toBe(false);
    });

    it('should return false for DeleteManyUserAndReturn', () => {
      expect(isManyAndReturnOutputType('DeleteManyUserAndReturn')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should return false for empty string', () => {
      expect(isManyAndReturnOutputType('')).toBe(false);
    });

    it('should return false for just CreateMany', () => {
      expect(isManyAndReturnOutputType('CreateMany')).toBe(false);
    });

    it('should return false for just AndReturnOutputType', () => {
      expect(isManyAndReturnOutputType('AndReturnOutputType')).toBe(false);
    });
  });
});
