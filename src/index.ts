/* eslint-disable no-console */
import type { GeneratorOptions } from '@prisma/generator-helper';

import { existsSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { arch, platform } from 'node:os';

const requireCjs = createRequire(import.meta.url);

// Patch fs with graceful-fs to handle EMFILE errors during mass file generation.
// This generator can produce 17k+ files; without this patch, constrained environments
// (Docker, CI) hit file descriptor limits and fail silently.
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
requireCjs('graceful-fs').gracefulify(requireCjs('fs'));

// Catch process-level errors that would otherwise cause silent failures.
// The Prisma generator-helper communicates via JSON-RPC over stderr; if the
// process crashes before sending a response, Prisma may report success.
process.on('unhandledRejection', reason => {
  console.log('nestjs-prisma-graphql: unhandled rejection:', reason);
  if (reason instanceof Error && typeof reason.stack === 'string') {
    console.log(reason.stack);
  }
});

process.on('uncaughtException', error => {
  console.log('nestjs-prisma-graphql: uncaught exception:', error.message);
  if (typeof error.stack === 'string') {
    console.log(error.stack);
  }
});

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
  const envVarsToCheck = [
    'DISABLE_NESTJS_PRISMA_GRAPHQL',
    'CI_SKIP_PRISMA_GRAPHQL',
    'PRISMA_GENERATOR_SKIP',
    'SKIP_PRISMA_GENERATE',
  ];

  for (const envVar of envVarsToCheck) {
    const value = env[envVar];
    if (value === 'true' || value === '1') {
      return true;
    }
  }

  const configDisabled = options.generator.config.disabled;
  if (configDisabled === 'true' || configDisabled === '1' || configDisabled === 'yes') {
    return true;
  }

  return false;
}

function countFilesRecursive(dir: string): number {
  let count = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      count += countFilesRecursive(`${dir}/${entry.name}`);
    } else {
      count++;
    }
  }
  return count;
}

generatorHandler({
  async onGenerate(options: GeneratorOptions) {
    if (isGeneratorDisabled(options)) {
      console.log(
        'nestjs-prisma-graphql: generation skipped (disabled via environment variable or config)',
      );
      return;
    }

    const outputPath = options.generator.output?.value ?? '<unknown>';
    const startTime = Date.now();

    console.log(
      [
        'nestjs-prisma-graphql: starting generation',
        `(arch=${arch()}, platform=${platform()}, node=${process.version}, output=${outputPath})`,
      ].join(' '),
    );

    try {
      await generate(options);
    } catch (error: unknown) {
      const elapsed = Date.now() - startTime;
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;

      console.log(
        `nestjs-prisma-graphql: generation FAILED after ${String(elapsed)}ms: ${message}`,
      );
      if (typeof stack === 'string') {
        console.log(stack);
      }

      throw error;
    }

    const elapsed = Date.now() - startTime;

    if (
      typeof outputPath === 'string' &&
      outputPath !== '<unknown>' &&
      existsSync(outputPath)
    ) {
      const fileCount = countFilesRecursive(outputPath);
      console.log(
        `nestjs-prisma-graphql: generated ${String(fileCount)} files in ${String(
          elapsed,
        )}ms`,
      );

      if (fileCount === 0) {
        const msg =
          'nestjs-prisma-graphql: generation produced 0 files — this likely indicates a silent failure';
        console.log(msg);
        throw new Error(msg);
      }
    } else {
      const msg = `nestjs-prisma-graphql: output directory not found after generation: ${
        outputPath
      }`;
      console.log(msg);
      throw new Error(msg);
    }
  },
  onManifest() {
    return {
      defaultOutput: '.',
      prettyName: 'NestJS Prisma GraphQL (ESM)',
    };
  },
});
