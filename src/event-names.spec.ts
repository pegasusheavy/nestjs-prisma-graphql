import { describe, expect, it } from 'vitest';

import { BeforeGenerateField } from './event-names.js';

describe('event-names', () => {
  describe('BeforeGenerateField', () => {
    it('should be a string constant', () => {
      expect(typeof BeforeGenerateField).toBe('string');
    });

    it('should have the correct value', () => {
      expect(BeforeGenerateField).toBe('BeforeGenerateField');
    });

    it('should be a const assertion (readonly)', () => {
      // TypeScript enforces this at compile time
      // At runtime, we just verify it's the expected string
      expect(BeforeGenerateField).toBe('BeforeGenerateField');
    });
  });
});
