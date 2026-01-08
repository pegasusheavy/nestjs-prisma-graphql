import type { EventArguments } from '../types.js';

/**
 * Generate the decimal-helpers.ts file that provides Decimal transformation
 * utilities compatible with Prisma 7+.
 *
 * This replaces the dependency on prisma-graphql-type-decimal which is
 * incompatible with Prisma 7's new client structure.
 */
export function generateDecimalHelpers(args: EventArguments): void {
  const { config, output, project } = args;

  const rootDirectory = project.getDirectory(output) || project.createDirectory(output);

  const sourceFile = rootDirectory.createSourceFile(
    'decimal-helpers.ts',
    undefined,
    { overwrite: true },
  );

  // Generate decimal helper functions using decimal.js
  const helpersCode = `/**
 * Decimal Helpers for Prisma GraphQL
 *
 * This module provides utilities for transforming Decimal values
 * between GraphQL and Prisma, compatible with Prisma 7+.
 *
 * These functions replace the prisma-graphql-type-decimal package
 * which is incompatible with Prisma 7's new client structure.
 */

import Decimal from 'decimal.js';

/**
 * Reconstruct a Decimal from a serialized object.
 * Prisma serializes Decimals as objects with d, e, s properties.
 */
function createDecimalFromObject(object: { d: number[]; e: number; s: number }): Decimal {
  return Object.create(Decimal.prototype, {
    d: { value: object.d },
    e: { value: object.e },
    s: { value: object.s },
  });
}

/**
 * Transform input values to Decimal instances.
 * Used as a class-transformer Transform decorator argument.
 *
 * @param params - The transform parameters from class-transformer
 * @returns The transformed Decimal or array of Decimals
 */
export function transformToDecimal({ value }: { value: unknown }): Decimal | Decimal[] | null | undefined {
  if (value == null) return value as null | undefined;

  if (Array.isArray(value)) {
    return value.map((v) => {
      if (v instanceof Decimal) return v;
      if (typeof v === 'object' && v !== null && 'd' in v && 'e' in v && 's' in v) {
        return createDecimalFromObject(v as { d: number[]; e: number; s: number });
      }
      return new Decimal(v as string | number);
    });
  }

  if (value instanceof Decimal) return value;
  if (typeof value === 'object' && value !== null && 'd' in value && 'e' in value && 's' in value) {
    return createDecimalFromObject(value as { d: number[]; e: number; s: number });
  }
  return new Decimal(value as string | number);
}

/**
 * Re-export Decimal class for convenience
 */
export { Decimal };
`;

  sourceFile.addStatements(helpersCode);
}
