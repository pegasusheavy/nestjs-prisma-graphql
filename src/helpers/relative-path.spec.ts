import { describe, expect, it } from 'vitest';

import { relativePath } from './relative-path.js';

describe('relativePath', () => {
  describe('same directory', () => {
    it('should return ./ prefix for files in same directory', () => {
      expect(relativePath('/src/user.ts', '/src/post.ts')).toBe('./post');
    });

    it('should handle paths without leading slash', () => {
      expect(relativePath('src/user.ts', 'src/post.ts')).toBe('./post');
    });
  });

  describe('child directory', () => {
    it('should return relative path to child directory', () => {
      expect(relativePath('/src/index.ts', '/src/models/user.ts')).toBe(
        './models/user',
      );
    });

    it('should handle deep nesting', () => {
      expect(relativePath('/src/index.ts', '/src/a/b/c/deep.ts')).toBe(
        './a/b/c/deep',
      );
    });
  });

  describe('parent directory', () => {
    it('should return ../ for parent directory', () => {
      expect(relativePath('/src/models/user.ts', '/src/index.ts')).toBe(
        '../index',
      );
    });

    it('should handle multiple parent levels', () => {
      expect(relativePath('/src/a/b/c/deep.ts', '/src/index.ts')).toBe(
        '../../../index',
      );
    });
  });

  describe('sibling directory', () => {
    it('should return relative path to sibling directory', () => {
      expect(relativePath('/src/models/user.ts', '/src/inputs/create.ts')).toBe(
        '../inputs/create',
      );
    });
  });

  describe('.ts extension handling', () => {
    it('should remove .ts extension from result', () => {
      expect(relativePath('/src/a.ts', '/src/b.ts')).toBe('./b');
    });

    it('should not remove non-.ts extensions', () => {
      expect(relativePath('/src/a.ts', '/src/b.js')).toBe('./b.js');
    });
  });

  describe('edge cases', () => {
    it('should handle same file path', () => {
      const result = relativePath('/src/user.ts', '/src/user.ts');
      expect(result).toBe('./user');
    });

    it('should handle root level files', () => {
      expect(relativePath('/a.ts', '/b.ts')).toBe('./b');
    });
  });
});
