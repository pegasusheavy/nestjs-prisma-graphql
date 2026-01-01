import { describe, expect, it } from 'vitest';

import { getGraphqlInputType } from './get-graphql-input-type.js';
import type { DMMF } from '../types.js';

describe('getGraphqlInputType', () => {
  describe('single input type', () => {
    it('should return the only input type', () => {
      const inputTypes: DMMF.InputTypeRef[] = [
        { type: 'String', location: 'scalar', isList: false },
      ];

      const result = getGraphqlInputType(inputTypes);

      expect(result?.type).toBe('String');
    });
  });

  describe('filtering null types', () => {
    it('should filter out null type', () => {
      const inputTypes: DMMF.InputTypeRef[] = [
        { type: 'null', location: 'scalar', isList: false },
        { type: 'String', location: 'scalar', isList: false },
      ];

      const result = getGraphqlInputType(inputTypes);

      expect(result?.type).toBe('String');
    });

    it('should filter out Null type', () => {
      const inputTypes: DMMF.InputTypeRef[] = [
        { type: 'Null', location: 'scalar', isList: false },
        { type: 'Int', location: 'scalar', isList: false },
      ];

      const result = getGraphqlInputType(inputTypes);

      expect(result?.type).toBe('Int');
    });
  });

  describe('preferring list types', () => {
    it('should prefer list type when all same location', () => {
      const inputTypes: DMMF.InputTypeRef[] = [
        { type: 'String', location: 'scalar', isList: false },
        { type: 'String', location: 'scalar', isList: true },
      ];

      const result = getGraphqlInputType(inputTypes);

      expect(result?.isList).toBe(true);
    });
  });

  describe('pattern matching', () => {
    it('should find type by simple pattern', () => {
      const inputTypes: DMMF.InputTypeRef[] = [
        { type: 'UserWhereInput', location: 'inputObjectTypes', isList: false },
        { type: 'UserCreateInput', location: 'inputObjectTypes', isList: false },
      ];

      const result = getGraphqlInputType(inputTypes, 'Where');

      expect(result?.type).toBe('UserWhereInput');
    });

    it('should find type by matcher pattern', () => {
      const inputTypes: DMMF.InputTypeRef[] = [
        { type: 'UserWhereInput', location: 'inputObjectTypes', isList: false },
        { type: 'PostWhereInput', location: 'inputObjectTypes', isList: false },
      ];

      const result = getGraphqlInputType(inputTypes, 'matcher:User*');

      expect(result?.type).toBe('UserWhereInput');
    });

    it('should find type by match: prefix pattern', () => {
      const inputTypes: DMMF.InputTypeRef[] = [
        { type: 'UserCreateInput', location: 'inputObjectTypes', isList: false },
        { type: 'PostCreateInput', location: 'inputObjectTypes', isList: false },
      ];

      const result = getGraphqlInputType(inputTypes, 'match:*Create*');

      expect(result?.type).toBe('UserCreateInput');
    });
  });

  describe('preferring inputObjectTypes', () => {
    it('should prefer inputObjectTypes location', () => {
      const inputTypes: DMMF.InputTypeRef[] = [
        { type: 'String', location: 'scalar', isList: false },
        { type: 'UserInput', location: 'inputObjectTypes', isList: false },
      ];

      const result = getGraphqlInputType(inputTypes);

      expect(result?.type).toBe('UserInput');
      expect(result?.location).toBe('inputObjectTypes');
    });
  });

  describe('enum and scalar with Json', () => {
    it('should prefer Json scalar when both enum and scalar present', () => {
      const inputTypes: DMMF.InputTypeRef[] = [
        { type: 'SomeEnum', location: 'enumTypes', isList: false },
        { type: 'Json', location: 'scalar', isList: false },
      ];

      const result = getGraphqlInputType(inputTypes);

      expect(result?.type).toBe('Json');
    });
  });

  describe('fieldRefTypes handling', () => {
    it('should prefer scalar or enum over fieldRefTypes', () => {
      const inputTypes: DMMF.InputTypeRef[] = [
        { type: 'StringFieldRef', location: 'fieldRefTypes', isList: false },
        { type: 'String', location: 'scalar', isList: false },
      ];

      const result = getGraphqlInputType(inputTypes);

      expect(result?.type).toBe('String');
    });

    it('should prefer list scalar over fieldRefTypes', () => {
      const inputTypes: DMMF.InputTypeRef[] = [
        { type: 'StringFieldRef', location: 'fieldRefTypes', isList: false },
        { type: 'String', location: 'scalar', isList: true },
      ];

      const result = getGraphqlInputType(inputTypes);

      expect(result?.isList).toBe(true);
    });

    it('should prefer enum over fieldRefTypes', () => {
      const inputTypes: DMMF.InputTypeRef[] = [
        { type: 'EnumFieldRef', location: 'fieldRefTypes', isList: false },
        { type: 'Role', location: 'enumTypes', isList: false },
      ];

      const result = getGraphqlInputType(inputTypes);

      expect(result?.type).toBe('Role');
    });
  });

  describe('error handling', () => {
    it('should throw when no matching type found', () => {
      const inputTypes: DMMF.InputTypeRef[] = [
        { type: 'StringFieldRef', location: 'fieldRefTypes', isList: false },
        { type: 'IntFieldRef', location: 'fieldRefTypes', isList: false },
      ];

      expect(() => getGraphqlInputType(inputTypes)).toThrow(TypeError);
    });

    it('should throw with empty array', () => {
      expect(() => getGraphqlInputType([])).toThrow(
        'Cannot get matching input type from zero length inputTypes',
      );
    });
  });

  describe('deduplication', () => {
    it('should deduplicate identical input types', () => {
      const inputTypes: DMMF.InputTypeRef[] = [
        { type: 'String', location: 'scalar', isList: false },
        { type: 'String', location: 'scalar', isList: false },
      ];

      const result = getGraphqlInputType(inputTypes);

      expect(result?.type).toBe('String');
    });
  });
});
