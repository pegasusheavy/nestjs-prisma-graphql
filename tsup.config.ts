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
  external: [
    '@prisma/generator-helper',
    '@prisma/client',
    'prisma',
  ],
});
