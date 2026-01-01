import { describe, expect, it } from 'vitest';

import { fileTypeByLocation } from './file-type-by-location.js';
import type { FieldLocation } from '../types.js';

describe('fileTypeByLocation', () => {
  it('should return "input" for inputObjectTypes', () => {
    expect(fileTypeByLocation('inputObjectTypes')).toBe('input');
  });

  it('should return "output" for outputObjectTypes', () => {
    expect(fileTypeByLocation('outputObjectTypes')).toBe('output');
  });

  it('should return "enum" for enumTypes', () => {
    expect(fileTypeByLocation('enumTypes')).toBe('enum');
  });

  it('should return "object" for scalar', () => {
    expect(fileTypeByLocation('scalar')).toBe('object');
  });

  it('should return "object" for fieldRefTypes', () => {
    expect(fileTypeByLocation('fieldRefTypes' as FieldLocation)).toBe('object');
  });

  it('should return "object" for unknown location', () => {
    expect(fileTypeByLocation('unknown' as FieldLocation)).toBe('object');
  });
});
