import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/generate.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'node20',
  outDir: 'dist',
  treeshake: true,
  // Don't bundle dependencies - let Node.js resolve them at runtime
  // This avoids ESM/CommonJS compatibility issues
  noExternal: [],
  external: [
    // Prisma
    '@prisma/generator-helper',
    '@prisma/client',
    'prisma',
    // CommonJS dependencies that cause issues when bundled
    'await-event-emitter',
    'flat',
    'pluralize',
    'lodash-es',
    'ts-morph',
    'filenamify',
    'get-relative-path',
    'graceful-fs',
    'json5',
    'outmatch',
    'pupa',
  ],
  // NOTE: Do NOT add a shebang to ESM files. When Node.js imports an ESM file,
  // the shebang causes a SyntaxError. The pnpm/npm bin wrapper handles execution.
});
