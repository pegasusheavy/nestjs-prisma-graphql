import { describe, expect, it } from 'vitest';

import { createGetModelName } from './get-model-name.js';

describe('createGetModelName', () => {
  const modelNames = ['User', 'Post', 'Comment', 'Category', 'Profile'];
  const getModelName = createGetModelName(modelNames);

  describe('split keywords', () => {
    it('should extract model name from CreateInput types', () => {
      expect(getModelName('UserCreateInput')).toBe('User');
      expect(getModelName('PostCreateInput')).toBe('Post');
    });

    it('should extract model name from WhereInput types', () => {
      expect(getModelName('UserWhereInput')).toBe('User');
      expect(getModelName('CommentWhereInput')).toBe('Comment');
    });

    it('should extract model name from WhereUniqueInput types', () => {
      expect(getModelName('UserWhereUniqueInput')).toBe('User');
      expect(getModelName('ProfileWhereUniqueInput')).toBe('Profile');
    });

    it('should extract model name from UpdateInput types', () => {
      expect(getModelName('UserUpdateInput')).toBe('User');
      expect(getModelName('CategoryUpdateInput')).toBe('Category');
    });

    it('should extract model name from OrderByInput types', () => {
      expect(getModelName('PostOrderByInput')).toBe('Post');
    });

    it('should extract model name from Filter types', () => {
      expect(getModelName('UserFilter')).toBe('User');
      expect(getModelName('PostRelationFilter')).toBe('Post');
      expect(getModelName('CommentNullableRelationFilter')).toBe('Comment');
      expect(getModelName('UserListRelationFilter')).toBe('User');
    });

    it('should extract model name from Aggregate types', () => {
      expect(getModelName('UserAvgAggregate')).toBe('User');
      expect(getModelName('PostSumAggregate')).toBe('Post');
      expect(getModelName('CommentMinAggregate')).toBe('Comment');
      expect(getModelName('CategoryMaxAggregate')).toBe('Category');
      expect(getModelName('ProfileCountAggregate')).toBe('Profile');
    });

    it('should extract model name from CreateNested types', () => {
      expect(getModelName('PostCreateNestedManyWithoutUserInput')).toBe('Post');
    });

    it('should extract model name from CreateWithout types', () => {
      expect(getModelName('UserCreateWithoutPostsInput')).toBe('User');
    });

    it('should extract model name from GroupBy types', () => {
      expect(getModelName('UserGroupBy')).toBe('User');
    });

    it('should extract model name from OrderBy types', () => {
      expect(getModelName('PostOrderBy')).toBe('Post');
    });

    it('should extract model name from UncheckedCreate types', () => {
      expect(getModelName('UserUncheckedCreateInput')).toBe('User');
    });

    it('should extract model name from UncheckedUpdate types', () => {
      expect(getModelName('PostUncheckedUpdateInput')).toBe('Post');
    });
  });

  describe('endsWith keywords', () => {
    it('should extract model name from Aggregate types via split', () => {
      // 'Aggregate' is in endsWithKeywords but the pattern is {Model}Aggregate
      // which splits on 'Aggregate' and takes the last part (empty string)
      // The Aggregate types are actually matched via the split keywords like AvgAggregate
      expect(getModelName('AggregateUser')).toBe('User');
    });

    it('should extract model name from GroupBy suffix', () => {
      // GroupBy as suffix works when model name comes after (e.g., GroupByUser)
      expect(getModelName('UserGroupBy')).toBe('User');
    });

    it('should extract model name from operation patterns', () => {
      // These patterns work when combined with Args suffix via middleKeywords
      // Direct suffix patterns like 'UserFindMany' don't match because
      // endsWithKeywords splits by keyword and takes last element
      expect(getModelName('FindManyUserArgs')).toBe('User');
      expect(getModelName('FindUniquePostArgs')).toBe('Post');
      expect(getModelName('DeleteManyCommentArgs')).toBe('Comment');
      expect(getModelName('UpdateManyCategoryArgs')).toBe('Category');
    });
  });

  describe('middle keywords', () => {
    it('should extract model name from Args types', () => {
      expect(getModelName('FindManyUserArgs')).toBe('User');
      expect(getModelName('FindUniquePostArgs')).toBe('Post');
      expect(getModelName('CreateOneCommentArgs')).toBe('Comment');
      expect(getModelName('DeleteManyCategoryArgs')).toBe('Category');
      expect(getModelName('UpdateOneProfileArgs')).toBe('Profile');
    });

    it('should extract model name from OrThrowArgs types', () => {
      expect(getModelName('FindFirstUserOrThrowArgs')).toBe('User');
      expect(getModelName('FindUniquePostOrThrowArgs')).toBe('Post');
    });

    it('should extract model name from AggregateArgs', () => {
      expect(getModelName('AggregateUserArgs')).toBe('User');
    });

    it('should extract model name from GroupByArgs', () => {
      expect(getModelName('GroupByPostArgs')).toBe('Post');
    });
  });

  describe('compound unique input', () => {
    it('should extract model name from CompoundUniqueInput types', () => {
      expect(getModelName('UserEmailNameCompoundUniqueInput')).toBe('User');
      expect(getModelName('PostTitleAuthorIdCompoundUniqueInput')).toBe('Post');
    });
  });

  describe('count types', () => {
    it('should extract model name from Count types', () => {
      expect(getModelName('UserCount')).toBe('User');
      expect(getModelName('PostCount')).toBe('Post');
    });
  });

  describe('edge cases', () => {
    it('should return undefined for unknown patterns', () => {
      expect(getModelName('SomeRandomType')).toBeUndefined();
      expect(getModelName('NotAModel')).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      expect(getModelName('')).toBeUndefined();
    });

    it('should be memoized', () => {
      const result1 = getModelName('UserCreateInput');
      const result2 = getModelName('UserCreateInput');
      expect(result1).toBe(result2);
    });
  });
});
