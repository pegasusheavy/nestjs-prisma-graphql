import { describe, expect, it } from 'vitest';

import { createEmitBlocks } from './create-emit-blocks.js';

describe('createEmitBlocks', () => {
  describe('default behavior', () => {
    it('should return all blocks enabled when no data provided', () => {
      const result = createEmitBlocks();

      expect(result.prismaEnums).toBe(true);
      expect(result.schemaEnums).toBe(true);
      expect(result.models).toBe(true);
      expect(result.inputs).toBe(true);
      expect(result.args).toBe(true);
      expect(result.outputs).toBe(true);
    });

    it('should return all blocks enabled when undefined provided', () => {
      const result = createEmitBlocks(undefined);

      expect(result.prismaEnums).toBe(true);
      expect(result.schemaEnums).toBe(true);
      expect(result.models).toBe(true);
      expect(result.inputs).toBe(true);
      expect(result.args).toBe(true);
      expect(result.outputs).toBe(true);
    });
  });

  describe('enums block', () => {
    it('should enable schemaEnums and prismaEnums when enums specified', () => {
      const result = createEmitBlocks(['enums']);

      expect(result.schemaEnums).toBe(true);
      expect(result.prismaEnums).toBe(true);
      expect(result.models).toBeUndefined();
      expect(result.inputs).toBeUndefined();
      expect(result.args).toBeUndefined();
      expect(result.outputs).toBeUndefined();
    });
  });

  describe('models block', () => {
    it('should enable models and schemaEnums when models specified', () => {
      const result = createEmitBlocks(['models']);

      expect(result.models).toBe(true);
      expect(result.schemaEnums).toBe(true);
      expect(result.prismaEnums).toBeUndefined();
      expect(result.inputs).toBeUndefined();
      expect(result.args).toBeUndefined();
      expect(result.outputs).toBeUndefined();
    });
  });

  describe('inputs block', () => {
    it('should enable inputs and prismaEnums when inputs specified', () => {
      const result = createEmitBlocks(['inputs']);

      expect(result.inputs).toBe(true);
      expect(result.prismaEnums).toBe(true);
      expect(result.schemaEnums).toBeUndefined();
      expect(result.models).toBeUndefined();
      expect(result.args).toBeUndefined();
      expect(result.outputs).toBeUndefined();
    });
  });

  describe('outputs block', () => {
    it('should enable only outputs when outputs specified', () => {
      const result = createEmitBlocks(['outputs']);

      expect(result.outputs).toBe(true);
      expect(result.prismaEnums).toBeUndefined();
      expect(result.schemaEnums).toBeUndefined();
      expect(result.models).toBeUndefined();
      expect(result.inputs).toBeUndefined();
      expect(result.args).toBeUndefined();
    });
  });

  describe('args block', () => {
    it('should enable args, inputs, and prismaEnums when args specified', () => {
      const result = createEmitBlocks(['args']);

      expect(result.args).toBe(true);
      expect(result.inputs).toBe(true);
      expect(result.prismaEnums).toBe(true);
      expect(result.schemaEnums).toBeUndefined();
      expect(result.models).toBeUndefined();
      expect(result.outputs).toBeUndefined();
    });
  });

  describe('multiple blocks', () => {
    it('should combine multiple block specifications', () => {
      const result = createEmitBlocks(['enums', 'models']);

      expect(result.schemaEnums).toBe(true);
      expect(result.prismaEnums).toBe(true);
      expect(result.models).toBe(true);
      expect(result.inputs).toBeUndefined();
      expect(result.args).toBeUndefined();
      expect(result.outputs).toBeUndefined();
    });

    it('should handle all blocks specified', () => {
      const result = createEmitBlocks([
        'enums',
        'models',
        'inputs',
        'outputs',
        'args',
      ]);

      expect(result.schemaEnums).toBe(true);
      expect(result.prismaEnums).toBe(true);
      expect(result.models).toBe(true);
      expect(result.inputs).toBe(true);
      expect(result.args).toBe(true);
      expect(result.outputs).toBe(true);
    });
  });

  describe('invalid blocks', () => {
    it('should ignore invalid block names', () => {
      const result = createEmitBlocks(['invalid', 'unknown']);

      expect(result.prismaEnums).toBeUndefined();
      expect(result.schemaEnums).toBeUndefined();
      expect(result.models).toBeUndefined();
      expect(result.inputs).toBeUndefined();
      expect(result.args).toBeUndefined();
      expect(result.outputs).toBeUndefined();
    });

    it('should handle mix of valid and invalid blocks', () => {
      const result = createEmitBlocks(['invalid', 'models', 'unknown']);

      expect(result.models).toBe(true);
      expect(result.schemaEnums).toBe(true);
      expect(result.prismaEnums).toBeUndefined();
    });
  });

  describe('empty array', () => {
    it('should return empty object for empty array', () => {
      const result = createEmitBlocks([]);

      expect(result.prismaEnums).toBeUndefined();
      expect(result.schemaEnums).toBeUndefined();
      expect(result.models).toBeUndefined();
      expect(result.inputs).toBeUndefined();
      expect(result.args).toBeUndefined();
      expect(result.outputs).toBeUndefined();
    });
  });
});
