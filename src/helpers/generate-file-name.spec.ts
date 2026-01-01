import { describe, it, expect } from 'vitest';
import { generateFileName } from './generate-file-name.js';

describe('generateFileName', () => {
  const getModelName = (name: string) => {
    if (name.startsWith('User')) return 'User';
    if (name.startsWith('Post')) return 'Post';
    return undefined;
  };

  it('should generate file name with default template', () => {
    const result = generateFileName({
      name: 'UserCreateInput',
      type: 'input',
      template: '{model}/{name}.{type}.ts',
      getModelName,
    });

    expect(result).toBe('user/user-create.input.ts');
  });

  it('should generate file name for args type', () => {
    const result = generateFileName({
      name: 'UserFindManyArgs',
      type: 'args',
      template: '{model}/{name}.{type}.ts',
      getModelName,
    });

    expect(result).toBe('user/user-find-many.args.ts');
  });

  it('should fallback to prisma folder for unknown model', () => {
    const result = generateFileName({
      name: 'SomeUnknownType',
      type: 'input',
      template: '{model}/{name}.{type}.ts',
      getModelName,
    });

    expect(result).toBe('prisma/some-unknown-type.input.ts');
  });

  it('should handle plural type in template', () => {
    const result = generateFileName({
      name: 'UserCreateInput',
      type: 'input',
      template: '{plural.type}/{name}.{type}.ts',
      getModelName,
    });

    expect(result).toBe('inputs/user-create.input.ts');
  });
});
