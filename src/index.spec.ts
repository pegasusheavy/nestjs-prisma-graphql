import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { isGeneratorDisabled } from './index.js';

describe('isGeneratorDisabled', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Clean environment for each test
    delete process.env['DISABLE_NESTJS_PRISMA_GRAPHQL'];
    delete process.env['CI_SKIP_PRISMA_GRAPHQL'];
    delete process.env['PRISMA_GENERATOR_SKIP'];
    delete process.env['SKIP_PRISMA_GENERATE'];
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const createMockOptions = (config: Record<string, string> = {}) => ({
    generator: { config },
  });

  describe('default behavior', () => {
    it('should return false when no disable flags are set', () => {
      const options = createMockOptions();
      expect(isGeneratorDisabled(options)).toBe(false);
    });
  });

  describe('environment variables', () => {
    it('should return true when DISABLE_NESTJS_PRISMA_GRAPHQL=true', () => {
      const options = createMockOptions();
      const env = { DISABLE_NESTJS_PRISMA_GRAPHQL: 'true' };
      expect(isGeneratorDisabled(options, env)).toBe(true);
    });

    it('should return true when DISABLE_NESTJS_PRISMA_GRAPHQL=1', () => {
      const options = createMockOptions();
      const env = { DISABLE_NESTJS_PRISMA_GRAPHQL: '1' };
      expect(isGeneratorDisabled(options, env)).toBe(true);
    });

    it('should return false when DISABLE_NESTJS_PRISMA_GRAPHQL=false', () => {
      const options = createMockOptions();
      const env = { DISABLE_NESTJS_PRISMA_GRAPHQL: 'false' };
      expect(isGeneratorDisabled(options, env)).toBe(false);
    });

    it('should return true when CI_SKIP_PRISMA_GRAPHQL=true', () => {
      const options = createMockOptions();
      const env = { CI_SKIP_PRISMA_GRAPHQL: 'true' };
      expect(isGeneratorDisabled(options, env)).toBe(true);
    });

    it('should return true when PRISMA_GENERATOR_SKIP=true', () => {
      const options = createMockOptions();
      const env = { PRISMA_GENERATOR_SKIP: 'true' };
      expect(isGeneratorDisabled(options, env)).toBe(true);
    });

    it('should return true when SKIP_PRISMA_GENERATE=true', () => {
      const options = createMockOptions();
      const env = { SKIP_PRISMA_GENERATE: 'true' };
      expect(isGeneratorDisabled(options, env)).toBe(true);
    });

    it('should check DISABLE_NESTJS_PRISMA_GRAPHQL first (specificity)', () => {
      const options = createMockOptions();
      const env = {
        DISABLE_NESTJS_PRISMA_GRAPHQL: 'true',
        PRISMA_GENERATOR_SKIP: 'false',
      };
      expect(isGeneratorDisabled(options, env)).toBe(true);
    });

    it('should use process.env when env parameter is not provided', () => {
      process.env['DISABLE_NESTJS_PRISMA_GRAPHQL'] = 'true';
      const options = createMockOptions();
      expect(isGeneratorDisabled(options)).toBe(true);
    });
  });

  describe('config options', () => {
    it('should return true when config.disabled=true', () => {
      const options = createMockOptions({ disabled: 'true' });
      expect(isGeneratorDisabled(options)).toBe(true);
    });

    it('should return true when config.disabled=1', () => {
      const options = createMockOptions({ disabled: '1' });
      expect(isGeneratorDisabled(options)).toBe(true);
    });

    it('should return true when config.disabled=yes', () => {
      const options = createMockOptions({ disabled: 'yes' });
      expect(isGeneratorDisabled(options)).toBe(true);
    });

    it('should return false when config.disabled=false', () => {
      const options = createMockOptions({ disabled: 'false' });
      expect(isGeneratorDisabled(options)).toBe(false);
    });

    it('should return false when config.disabled is not set', () => {
      const options = createMockOptions({});
      expect(isGeneratorDisabled(options)).toBe(false);
    });
  });

  describe('priority', () => {
    it('should check environment variables before config', () => {
      const options = createMockOptions({ disabled: 'false' });
      const env = { DISABLE_NESTJS_PRISMA_GRAPHQL: 'true' };
      // Env var takes precedence
      expect(isGeneratorDisabled(options, env)).toBe(true);
    });

    it('should use config when environment variables are not set', () => {
      const options = createMockOptions({ disabled: 'true' });
      const env = {}; // No env vars
      expect(isGeneratorDisabled(options, env)).toBe(true);
    });
  });
});
