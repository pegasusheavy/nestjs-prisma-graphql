import type { GeneratorOptions } from '@prisma/generator-helper';

import generatorHelper from '@prisma/generator-helper';

const { generatorHandler } = generatorHelper;

import { generate } from './generate.js';

/**
 * Configuration for disabling the generator
 */
export interface GeneratorDisableConfig {
  /** Config options from the generator block in schema.prisma */
  config: Record<string, string | undefined>;
}

/**
 * Environment variables that can disable the generator:
 * - DISABLE_NESTJS_PRISMA_GRAPHQL=true - Disable this specific generator
 * - PRISMA_GENERATOR_SKIP=true - Skip all Prisma generators (common convention)
 * - SKIP_PRISMA_GENERATE=true - Alternative skip flag
 * - CI_SKIP_PRISMA_GRAPHQL=true - CI-specific skip flag
 *
 * Config options (in schema.prisma):
 * - disabled = true - Disable generation
 * - disabled = "true" - Disable generation (string)
 * - disabled = 1 - Disable generation (number as string)
 *
 * @param options - Generator options or minimal config object
 * @param env - Environment variables (defaults to process.env)
 * @returns true if the generator should be disabled
 */
export function isGeneratorDisabled(
  options: GeneratorOptions | { generator: GeneratorDisableConfig },
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  // Check environment variables (order matters for specificity)
  const envVarsToCheck = [
    'DISABLE_NESTJS_PRISMA_GRAPHQL', // Most specific
    'CI_SKIP_PRISMA_GRAPHQL', // CI-specific
    'PRISMA_GENERATOR_SKIP', // Common convention
    'SKIP_PRISMA_GENERATE', // Alternative
  ];

  for (const envVar of envVarsToCheck) {
    const value = env[envVar];
    if (value === 'true' || value === '1') {
      return true;
    }
  }

  // Check generator config option
  const configDisabled = options.generator.config.disabled;
  if (configDisabled === 'true' || configDisabled === '1' || configDisabled === 'yes') {
    return true;
  }

  return false;
}

generatorHandler({
  async onGenerate(options: GeneratorOptions) {
    if (isGeneratorDisabled(options)) {
      console.log(
        '⏭️  nestjs-prisma-graphql: Generation skipped (disabled via environment variable or config)',
      );
      return;
    }
    await generate(options);
  },
  onManifest() {
    return {
      defaultOutput: '.',
      prettyName: 'NestJS Prisma GraphQL (ESM)',
    };
  },
});
