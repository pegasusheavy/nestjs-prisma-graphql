/**
 * Benchmark suite for nestjs-prisma-graphql generator
 *
 * Run with: pnpm tsx src/benchmark/index.ts
 */

import { performance } from 'node:perf_hooks';

import { createConfig } from '../helpers/create-config.js';
import { createGetModelName } from '../helpers/get-model-name.js';
import {
  buildDependencyGraph,
  detectCircularDependencies,
} from '../helpers/detect-circular-deps.js';

interface BenchmarkResult {
  name: string;
  iterations: number;
  totalMs: number;
  avgMs: number;
  minMs: number;
  maxMs: number;
  opsPerSec: number;
}

function benchmark(
  name: string,
  fn: () => void,
  iterations = 1000,
): BenchmarkResult {
  const times: number[] = [];

  // Warmup
  for (let i = 0; i < Math.min(100, iterations / 10); i++) {
    fn();
  }

  // Actual benchmark
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    const end = performance.now();
    times.push(end - start);
  }

  const totalMs = times.reduce((a, b) => a + b, 0);
  const avgMs = totalMs / iterations;
  const minMs = Math.min(...times);
  const maxMs = Math.max(...times);
  const opsPerSec = 1000 / avgMs;

  return { name, iterations, totalMs, avgMs, minMs, maxMs, opsPerSec };
}

function formatResult(result: BenchmarkResult): string {
  return [
    `📊 ${result.name}`,
    `   Iterations: ${result.iterations.toLocaleString()}`,
    `   Total: ${result.totalMs.toFixed(2)}ms`,
    `   Avg: ${result.avgMs.toFixed(4)}ms`,
    `   Min: ${result.minMs.toFixed(4)}ms`,
    `   Max: ${result.maxMs.toFixed(4)}ms`,
    `   Ops/sec: ${result.opsPerSec.toFixed(0).toLocaleString()}`,
  ].join('\n');
}

// Minimal field interface for benchmarking
interface MockField {
  name: string;
  kind: string;
  type: string;
  isRequired: boolean;
  isList: boolean;
  isUnique: boolean;
  isId: boolean;
  hasDefaultValue: boolean;
  isGenerated: boolean;
  isUpdatedAt: boolean;
  relationName?: string;
}

interface MockModel {
  name: string;
  dbName: string | null;
  fields: MockField[];
  primaryKey: null;
  uniqueFields: string[][];
  uniqueIndexes: { name: string | null; fields: string[] }[];
  isGenerated: boolean;
}

// Generate mock models for benchmarking
function generateMockModels(count: number): MockModel[] {
  const models: MockModel[] = [];

  for (let i = 0; i < count; i++) {
    const modelName = `Model${i}`;
    const fields: MockField[] = [];

    // Add id field
    fields.push({
      name: 'id',
      kind: 'scalar',
      type: 'String',
      isRequired: true,
      isList: false,
      isUnique: true,
      isId: true,
      hasDefaultValue: true,
      isGenerated: false,
      isUpdatedAt: false,
    });

    // Add some scalar fields
    for (let j = 0; j < 5; j++) {
      fields.push({
        name: `field${j}`,
        kind: 'scalar',
        type: ['String', 'Int', 'DateTime', 'Boolean', 'Float'][j % 5],
        isRequired: j % 2 === 0,
        isList: false,
        isUnique: false,
        isId: false,
        hasDefaultValue: false,
        isGenerated: false,
        isUpdatedAt: false,
      });
    }

    // Add relation fields (to create circular dependencies)
    if (i > 0) {
      fields.push({
        name: 'parent',
        kind: 'object',
        type: `Model${i - 1}`,
        isRequired: false,
        isList: false,
        isUnique: false,
        isId: false,
        hasDefaultValue: false,
        isGenerated: false,
        isUpdatedAt: false,
        relationName: `Model${i}ToModel${i - 1}`,
      });
    }
    if (i < count - 1) {
      fields.push({
        name: 'children',
        kind: 'object',
        type: `Model${i + 1}`,
        isRequired: false,
        isList: true,
        isUnique: false,
        isId: false,
        hasDefaultValue: false,
        isGenerated: false,
        isUpdatedAt: false,
        relationName: `Model${i + 1}ToModel${i}`,
      });
    }

    // Add circular reference every 10 models
    if (i >= 10 && i % 10 === 0) {
      fields.push({
        name: 'circular',
        kind: 'object',
        type: `Model${i - 10}`,
        isRequired: false,
        isList: false,
        isUnique: false,
        isId: false,
        hasDefaultValue: false,
        isGenerated: false,
        isUpdatedAt: false,
        relationName: `CircularRef${i}`,
      });
    }

    models.push({
      name: modelName,
      dbName: modelName.toLowerCase(),
      fields,
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
      isGenerated: false,
    });
  }

  return models;
}

// Generate mock config data
function generateMockConfigData(): Record<string, unknown> {
  return {
    output: '../src/@generated',
    esmCompatible: 'true',
    fields_Validator_from: 'class-validator',
    fields_Validator_input: 'true',
    combineScalarFilters: 'true',
    noAtomicOperations: 'false',
    reExport: 'All',
    emitSingle: 'false',
    purgeOutput: 'true',
    decorate_1_type: '*CreateInput',
    decorate_1_field: '*',
    decorate_1_name: 'ValidateNested',
    decorate_1_from: 'class-validator',
    decorate_1_arguments: '[]',
  };
}

// Run benchmarks
console.log('🚀 NestJS Prisma GraphQL Generator Benchmarks\n');
console.log('═'.repeat(60));

// Benchmark 1: Config creation
console.log('\n📦 Config Creation\n');

const configData = generateMockConfigData();
const configResult = benchmark('createConfig', () => {
  createConfig(configData);
}, 5000);
console.log(formatResult(configResult));

// Benchmark 2: Model name extraction
console.log('\n\n📦 Model Name Extraction\n');

const modelNames = Array.from({ length: 100 }, (_, i) => `Model${i}`);
const getModelName = createGetModelName(modelNames);
const testNames = [
  'Model50CreateInput',
  'Model25WhereUniqueInput',
  'Model75UpdateManyMutationInput',
  'Model10AvgAggregate',
  'FindManyModel30Args',
  'Model60CountOutputType',
];

const modelNameResult = benchmark(
  'getModelName (memoized)',
  () => {
    for (const name of testNames) {
      getModelName(name);
    }
  },
  10000,
);
console.log(formatResult(modelNameResult));

// Non-memoized version for comparison
const modelNameNonMemoResult = benchmark(
  'getModelName (fresh calls)',
  () => {
    const fresh = createGetModelName(modelNames);
    for (const name of testNames) {
      fresh(name);
    }
  },
  5000,
);
console.log('\n' + formatResult(modelNameNonMemoResult));

// Benchmark 3: Circular dependency detection
console.log('\n\n📦 Circular Dependency Detection\n');

// Type assertion for benchmark compatibility
type BenchmarkModel = { name: string; fields: { name: string; kind: string; type: string }[] };

const smallModels = generateMockModels(10) as unknown as BenchmarkModel[];
const mediumModels = generateMockModels(50) as unknown as BenchmarkModel[];
const largeModels = generateMockModels(100) as unknown as BenchmarkModel[];

const circDepSmallResult = benchmark(
  'detectCircularDeps (10 models)',
  () => {
    const graph = buildDependencyGraph(smallModels as never);
    detectCircularDependencies(graph);
  },
  5000,
);
console.log(formatResult(circDepSmallResult));

const circDepMediumResult = benchmark(
  'detectCircularDeps (50 models)',
  () => {
    const graph = buildDependencyGraph(mediumModels as never);
    detectCircularDependencies(graph);
  },
  2000,
);
console.log('\n' + formatResult(circDepMediumResult));

const circDepLargeResult = benchmark(
  'detectCircularDeps (100 models)',
  () => {
    const graph = buildDependencyGraph(largeModels as never);
    detectCircularDependencies(graph);
  },
  1000,
);
console.log('\n' + formatResult(circDepLargeResult));

// Benchmark 4: Dependency graph building only
console.log('\n\n📦 Dependency Graph Building\n');

const graphSmallResult = benchmark(
  'buildDependencyGraph (10 models)',
  () => {
    buildDependencyGraph(smallModels as never);
  },
  10000,
);
console.log(formatResult(graphSmallResult));

const graphLargeResult = benchmark(
  'buildDependencyGraph (100 models)',
  () => {
    buildDependencyGraph(largeModels as never);
  },
  5000,
);
console.log('\n' + formatResult(graphLargeResult));

// Summary
console.log('\n\n' + '═'.repeat(60));
console.log('📋 PERFORMANCE SUMMARY\n');

const results = [
  configResult,
  modelNameResult,
  modelNameNonMemoResult,
  circDepSmallResult,
  circDepMediumResult,
  circDepLargeResult,
  graphSmallResult,
  graphLargeResult,
];

console.log('Operation                              Avg (ms)    Ops/sec');
console.log('─'.repeat(60));
for (const r of results) {
  const name = r.name.padEnd(38);
  const avg = r.avgMs.toFixed(4).padStart(8);
  const ops = Math.round(r.opsPerSec).toLocaleString().padStart(10);
  console.log(`${name} ${avg}    ${ops}`);
}

// Identify bottlenecks
console.log('\n\n' + '═'.repeat(60));
console.log('⚠️  POTENTIAL BOTTLENECKS\n');

const sortedByAvg = [...results].sort((a, b) => b.avgMs - a.avgMs);
for (const r of sortedByAvg.slice(0, 3)) {
  console.log(`• ${r.name}: ${r.avgMs.toFixed(4)}ms avg`);
}

console.log('\n\n' + '═'.repeat(60));
console.log('💡 IMPROVEMENT RECOMMENDATIONS\n');

console.log(`
1. CONFIG CREATION (${configResult.avgMs.toFixed(4)}ms)
   - Consider caching unflatten results
   - Use Map instead of Object.fromEntries for fields
   - Pre-compile regex patterns in filenamify

2. MODEL NAME EXTRACTION
   - Memoization helps: ${((modelNameNonMemoResult.avgMs / modelNameResult.avgMs) * 100 - 100).toFixed(0)}% slower without cache
   - Consider using a trie data structure for keyword matching
   - Pre-sort keywords by frequency of occurrence

3. CIRCULAR DEPENDENCY DETECTION (${circDepLargeResult.avgMs.toFixed(4)}ms for 100 models)
   - Current O(V + E) complexity is optimal
   - Consider caching results between runs
   - For very large schemas, consider incremental detection

4. GENERAL IMPROVEMENTS
   - Use object pooling for frequently created objects
   - Consider parallel processing for independent operations
   - Profile memory allocation patterns
`);

console.log('═'.repeat(60));
console.log('✅ Benchmark complete!\n');
