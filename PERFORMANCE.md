# Performance Analysis & Improvement Recommendations

This document contains the results of benchmarking and static analysis of the `nestjs-prisma-graphql` generator.

## Benchmark Results Summary

| Operation | Avg Time | Ops/sec | Notes |
|-----------|----------|---------|-------|
| `createConfig` | 0.0157ms | 63,790 | Config parsing overhead |
| `getModelName` (memoized) | 0.0003ms | 3,661,599 | Very fast with cache |
| `getModelName` (fresh) | 0.0205ms | 48,686 | 74x slower without memoization |
| `detectCircularDeps` (10 models) | 0.0049ms | 203,623 | Good |
| `detectCircularDeps` (50 models) | 0.0272ms | 36,722 | Scales linearly |
| `detectCircularDeps` (100 models) | 0.0618ms | 16,175 | Acceptable |
| `buildDependencyGraph` (10 models) | 0.0008ms | 1,222,036 | Excellent |
| `buildDependencyGraph` (100 models) | 0.0085ms | 117,372 | Good scaling |

## Codebase Statistics

- **Files**: 45 TypeScript source files
- **Total Lines**: 3,574
- **Functions**: 174
- **Async Functions**: 2

### Largest Files

| Lines | File | Status |
|-------|------|--------|
| 356 | `handlers/input-type.ts` | ⚠️ Consider splitting |
| 349 | `helpers/object-settings.ts` | ⚠️ Consider splitting |
| 335 | `handlers/model-output-type.ts` | ⚠️ Consider splitting |
| 223 | `generate.ts` | OK |
| 205 | `helpers/create-config.ts` | OK |

## Identified Improvement Areas

### 🔴 High Priority

#### 1. Object Spreading in Loops

**Issue**: Multiple handlers use object spreading (`{...obj}`) inside loops, which creates new objects on each iteration.

**Affected Files**:
- `generate.ts`
- `handlers/input-type.ts`
- `handlers/model-output-type.ts`
- `handlers/output-type.ts`
- `handlers/args-type.ts`

**Recommendation**: Use `Object.assign()` with a pre-allocated object or restructure to avoid spreading in hot paths.

```typescript
// Before (allocates new object each iteration)
for (const item of items) {
  const result = { ...baseObj, ...item };
}

// After (reuses object)
const result = Object.assign({}, baseObj);
for (const item of items) {
  Object.assign(result, item);
}
```

#### 2. Worker Pool for Parallel Generation

**Issue**: File generation is sequential, which doesn't utilize multi-core CPUs.

**Recommendation**: Implement worker threads for parallel file generation:

```typescript
import { Worker, isMainThread, parentPort } from 'worker_threads';

// Main thread distributes work
const workers = os.cpus().length;
const chunks = chunkArray(sourceFiles, workers);
await Promise.all(chunks.map(chunk =>
  runWorker(chunk)
));
```

#### 3. ts-morph Caching

**Issue**: ts-morph `Project` and `SourceFile` objects are recreated on each run.

**Recommendation**: Cache the Project instance for watch mode:

```typescript
const projectCache = new Map<string, Project>();

function getOrCreateProject(output: string): Project {
  if (!projectCache.has(output)) {
    projectCache.set(output, new Project({...}));
  }
  return projectCache.get(output)!;
}
```

### 🟡 Medium Priority

#### 4. Replace Lodash with Native Methods

**Current Usage**:
- `first` → Use `arr[0]` or `arr.at(0)`
- `last` → Use `arr.at(-1)`
- `castArray` → Use `Array.isArray(x) ? x : [x]`
- `mapKeys` → Use `Object.fromEntries(Object.entries(obj).map(...))`

**Example**:
```typescript
// Before
import { first, last } from 'lodash-es';
const firstItem = first(arr);
const lastItem = last(arr);

// After
const firstItem = arr[0];
const lastItem = arr.at(-1);
```

#### 5. Incremental Generation

**Issue**: Full regeneration on every schema change.

**Recommendation**: Implement change detection:

```typescript
interface SchemaChecksum {
  models: Record<string, string>;
  enums: Record<string, string>;
}

function detectChanges(prev: SchemaChecksum, curr: SchemaChecksum): Changes {
  // Only regenerate files for changed models/enums
}
```

#### 6. Streaming File Writes

**Issue**: Full file content is built in memory before writing.

**Recommendation**: For very large schemas, consider streaming:

```typescript
import { createWriteStream } from 'node:fs';

const stream = createWriteStream(filePath);
stream.write('// Generated file\n');
for (const declaration of declarations) {
  stream.write(declaration.toString());
}
stream.end();
```

### 🟢 Low Priority

#### 7. Reduce Event Emitter Overhead

**Issue**: Synchronous event emissions (`emitSync`) may block.

**Recommendation**: Consider direct function calls for synchronous operations:

```typescript
// Before
eventEmitter.emitSync('BeforeGenerateField', field, args);

// After
beforeGenerateField(field, args);
```

#### 8. Pre-compile Regex Patterns

**Issue**: Some regex patterns may be recreated on each call.

**Recommendation**: Move regex to module level constants:

```typescript
// Module level (compiled once)
const MODEL_NAME_PATTERN = /^(\w+)(CreateInput|UpdateInput|...)$/;

// Function level (recompiled each call) - AVOID
function getModelName(name: string) {
  const pattern = /^(\w+)(CreateInput|...)$/;
}
```

#### 9. Use WeakMap for Object Caching

**Issue**: Some caches may hold references to objects longer than needed.

**Recommendation**: Use `WeakMap` for object-keyed caches:

```typescript
const settingsCache = new WeakMap<Model, ObjectSettings>();
```

## Implementation Priority

### Phase 1: Quick Wins (1-2 hours)
- [ ] Replace `first`/`last` with native methods
- [ ] Pre-compile regex patterns
- [ ] Use `Object.assign` instead of spread in loops

### Phase 2: Medium Effort (4-8 hours)
- [ ] Implement ts-morph Project caching
- [ ] Add change detection for incremental generation
- [ ] Replace remaining Lodash functions with native alternatives

### Phase 3: Major Refactoring (1-2 weeks)
- [ ] Implement worker pool for parallel generation
- [ ] Add streaming writes for large schemas
- [ ] Refactor event system to direct function calls

## Monitoring

### Recommended Metrics

Add these metrics to track performance over time:

```typescript
interface GenerationMetrics {
  totalTime: number;
  parseTime: number;
  generateTime: number;
  writeTime: number;
  filesGenerated: number;
  linesGenerated: number;
  memoryUsed: number;
}
```

### Benchmark Script

Run benchmarks with:

```bash
pnpm benchmark        # Performance benchmarks
pnpm benchmark:analyze # Code analysis
```

## Memory Profile

For large schemas (100+ models), monitor memory usage:

```bash
node --max-old-space-size=4096 --expose-gc \
  -e "global.gc(); console.log(process.memoryUsage())" \
  ./dist/index.js
```

## Related Resources

- [ts-morph Performance Tips](https://ts-morph.com/manipulation/#performance)
- [Node.js Worker Threads](https://nodejs.org/api/worker_threads.html)
- [V8 Object Shape Optimization](https://v8.dev/blog/fast-properties)
