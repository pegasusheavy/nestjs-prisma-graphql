import { describe, expect, it } from 'vitest';

import { isWhereUniqueInputType } from './is-where-unique-input-type.js';

describe('isWhereUniqueInputType', () => {
  it('should return true for UserWhereUniqueInput', () => {
    expect(isWhereUniqueInputType('UserWhereUniqueInput')).toBe(true);
  });

  it('should return true for PostWhereUniqueInput', () => {
    expect(isWhereUniqueInputType('PostWhereUniqueInput')).toBe(true);
  });

  it('should return true for CommentWhereUniqueInput', () => {
    expect(isWhereUniqueInputType('CommentWhereUniqueInput')).toBe(true);
  });

  it('should return false for UserWhereInput', () => {
    expect(isWhereUniqueInputType('UserWhereInput')).toBe(false);
  });

  it('should return false for UserCreateInput', () => {
    expect(isWhereUniqueInputType('UserCreateInput')).toBe(false);
  });

  it('should return false for UserUpdateInput', () => {
    expect(isWhereUniqueInputType('UserUpdateInput')).toBe(false);
  });

  it('should return false for UserWhereUniqueInputCompound', () => {
    expect(isWhereUniqueInputType('UserWhereUniqueInputCompound')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isWhereUniqueInputType('')).toBe(false);
  });

  it('should return false for WhereUniqueInput alone', () => {
    expect(isWhereUniqueInputType('WhereUniqueInput')).toBe(true);
  });

  it('should be case sensitive', () => {
    expect(isWhereUniqueInputType('userwhereuniqueinput')).toBe(false);
    expect(isWhereUniqueInputType('UserWHEREUNIQUEINPUT')).toBe(false);
  });
});
