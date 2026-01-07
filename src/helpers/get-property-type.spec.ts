import { describe, expect, it } from 'vitest';

import { getPropertyType } from './get-property-type.js';
import type { FieldLocation } from '../types.js';

describe('getPropertyType', () => {
  describe('scalar types', () => {
    it('should return number for Float', () => {
      expect(getPropertyType({ type: 'Float', location: 'scalar' })).toEqual([
        'number',
      ]);
    });

    it('should return number for Int', () => {
      expect(getPropertyType({ type: 'Int', location: 'scalar' })).toEqual([
        'number',
      ]);
    });

    it('should return string for String', () => {
      expect(getPropertyType({ type: 'String', location: 'scalar' })).toEqual([
        'string',
      ]);
    });

    it('should return boolean for Boolean', () => {
      expect(getPropertyType({ type: 'Boolean', location: 'scalar' })).toEqual([
        'boolean',
      ]);
    });

    it('should return Date and string for DateTime', () => {
      expect(getPropertyType({ type: 'DateTime', location: 'scalar' })).toEqual([
        'Date',
        'string',
      ]);
    });

    it('should return Prisma.Decimal for Decimal', () => {
      expect(getPropertyType({ type: 'Decimal', location: 'scalar' })).toEqual([
        'Prisma.Decimal',
      ]);
    });

    it('should return any for Json', () => {
      expect(getPropertyType({ type: 'Json', location: 'scalar' })).toEqual([
        'any',
      ]);
    });

    it('should return null for Null', () => {
      expect(getPropertyType({ type: 'Null', location: 'scalar' })).toEqual([
        'null',
      ]);
    });

    it('should return Uint8Array for Bytes', () => {
      expect(getPropertyType({ type: 'Bytes', location: 'scalar' })).toEqual([
        'Uint8Array',
      ]);
    });

    it('should return bigint and number for BigInt', () => {
      expect(getPropertyType({ type: 'BigInt', location: 'scalar' })).toEqual([
        'bigint',
        'number',
      ]);
    });
  });

  describe('inputObjectTypes location', () => {
    it('should return the type name directly', () => {
      expect(
        getPropertyType({ type: 'UserCreateInput', location: 'inputObjectTypes' }),
      ).toEqual(['UserCreateInput']);
    });

    it('should return custom type name', () => {
      expect(
        getPropertyType({ type: 'PostWhereInput', location: 'inputObjectTypes' }),
      ).toEqual(['PostWhereInput']);
    });
  });

  describe('outputObjectTypes location', () => {
    it('should return the type name directly', () => {
      expect(
        getPropertyType({ type: 'User', location: 'outputObjectTypes' }),
      ).toEqual(['User']);
    });

    it('should return custom output type name', () => {
      expect(
        getPropertyType({
          type: 'AggregateUser',
          location: 'outputObjectTypes',
        }),
      ).toEqual(['AggregateUser']);
    });
  });

  describe('enumTypes location', () => {
    it('should return template literal type for enum', () => {
      expect(getPropertyType({ type: 'Role', location: 'enumTypes' })).toEqual([
        '`${Role}`',
      ]);
    });

    it('should return template literal type for custom enum', () => {
      expect(
        getPropertyType({ type: 'UserStatus', location: 'enumTypes' }),
      ).toEqual(['`${UserStatus}`']);
    });
  });

  describe('scalar location with custom types', () => {
    it('should return the type as-is for unknown scalar types', () => {
      expect(
        getPropertyType({ type: 'CustomScalar', location: 'scalar' }),
      ).toEqual(['CustomScalar']);
    });
  });

  describe('unknown location', () => {
    it('should return unknown for unhandled locations', () => {
      expect(
        getPropertyType({
          type: 'Something',
          location: 'unknown' as FieldLocation,
        }),
      ).toEqual(['unknown']);
    });
  });

  describe('fieldRefTypes location', () => {
    it('should return unknown for fieldRefTypes', () => {
      expect(
        getPropertyType({
          type: 'StringFieldRefInput',
          location: 'fieldRefTypes' as FieldLocation,
        }),
      ).toEqual(['unknown']);
    });
  });
});
