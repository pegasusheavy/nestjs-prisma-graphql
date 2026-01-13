import { defineConfig } from 'tsup';
import { readFileSync, writeFileSync, chmodSync } from 'fs';
import { join } from 'path';

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
  // Add shebang to index.js after build for direct CLI execution
  // This prevents pnpm from generating wrapper scripts with hardcoded absolute paths
  async onSuccess() {
    const indexPath = join('dist', 'index.js');
    const content = readFileSync(indexPath, 'utf-8');
    writeFileSync(indexPath, `#!/usr/bin/env node\n${content}`);
    chmodSync(indexPath, 0o755);
    console.log('✅ Added shebang to dist/index.js');
  },
});
