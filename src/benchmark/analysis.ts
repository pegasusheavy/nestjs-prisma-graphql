/**
 * Code analysis and improvement recommendations
 *
 * Run with: pnpm tsx src/benchmark/analysis.ts
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

interface FileAnalysis {
  path: string;
  lines: number;
  functions: number;
  imports: number;
  lodashImports: string[];
  asyncFunctions: number;
  potentialIssues: string[];
}

interface ImprovementSuggestion {
  category: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  file?: string;
  impact: string;
}

function analyzeFile(filePath: string): FileAnalysis {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const potentialIssues: string[] = [];
  const lodashImports: string[] = [];

  // Count functions
  const functionMatches = content.match(/function\s+\w+|=>\s*{|=>\s*[^{]/g) || [];

  // Count imports
  const importMatches = content.match(/^import\s/gm) || [];

  // Count async functions
  const asyncMatches = content.match(/async\s+(function|\w+\s*=|\()/g) || [];

  // Find lodash imports
  const lodashMatch = content.match(/from\s+['"]lodash-es['"]/);
  if (lodashMatch) {
    const importLine = lines.find((l) => l.includes('lodash-es'));
    if (importLine) {
      const namedImports = importLine.match(/{\s*([^}]+)\s*}/);
      if (namedImports) {
        lodashImports.push(
          ...namedImports[1].split(',').map((s) => s.trim()),
        );
      }
    }
  }

  // Check for potential issues

  // 1. Large functions (rough estimate by checking function size)
  const functionBlocks = content.match(/function\s+\w+[^{]*{[^}]{500,}/g);
  if (functionBlocks) {
    potentialIssues.push(
      `${functionBlocks.length} potentially large function(s) detected`,
    );
  }

  // 2. Repeated object spreads in loops
  if (
    content.includes('for') &&
    (content.includes('...') || content.includes('Object.assign'))
  ) {
    potentialIssues.push('Object spreading in loops may cause memory churn');
  }

  // 3. Synchronous event emission
  if (content.includes('emitSync')) {
    potentialIssues.push('Synchronous event emissions may block');
  }

  // 4. JSON.parse/stringify in hot paths
  const jsonOps =
    (content.match(/JSON\.(parse|stringify)/g) || []).length;
  if (jsonOps > 2) {
    potentialIssues.push(
      `${jsonOps} JSON operations - consider alternatives for hot paths`,
    );
  }

  // 5. Repeated Map/Set operations
  const mapSetCreation = (content.match(/new (Map|Set)\(/g) || []).length;
  if (mapSetCreation > 3) {
    potentialIssues.push(`${mapSetCreation} Map/Set creations - consider reusing`);
  }

  // 6. String concatenation in loops
  if (
    (content.includes('for') || content.includes('.forEach')) &&
    content.includes("+ '") &&
    content.includes("'")
  ) {
    potentialIssues.push('String concatenation in loops - consider array join');
  }

  return {
    path: filePath,
    lines: lines.length,
    functions: functionMatches.length,
    imports: importMatches.length,
    lodashImports,
    asyncFunctions: asyncMatches.length,
    potentialIssues,
  };
}

function analyzeDirectory(dir: string): FileAnalysis[] {
  const results: FileAnalysis[] = [];

  function walkDir(currentDir: string): void {
    const entries = readdirSync(currentDir);
    for (const entry of entries) {
      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory() && !entry.includes('node_modules') && entry !== 'benchmark') {
        walkDir(fullPath);
      } else if (entry.endsWith('.ts') && !entry.endsWith('.spec.ts') && !entry.endsWith('.test.ts')) {
        results.push(analyzeFile(fullPath));
      }
    }
  }

  walkDir(dir);
  return results;
}

function generateImprovementSuggestions(
  analyses: FileAnalysis[],
): ImprovementSuggestion[] {
  const suggestions: ImprovementSuggestion[] = [];

  // Aggregate lodash usage
  const allLodashImports = new Map<string, number>();
  for (const analysis of analyses) {
    for (const imp of analysis.lodashImports) {
      allLodashImports.set(imp, (allLodashImports.get(imp) || 0) + 1);
    }
  }

  // Check for lodash functions that have native alternatives
  const nativeAlternatives: Record<string, string> = {
    first: 'array[0] or array.at(0)',
    last: 'array.at(-1)',
    flatten: 'array.flat()',
    flattenDeep: 'array.flat(Infinity)',
    includes: 'array.includes()',
    find: 'array.find()',
    filter: 'array.filter()',
    map: 'array.map()',
    reduce: 'array.reduce()',
    forEach: 'array.forEach()',
    some: 'array.some()',
    every: 'array.every()',
    keys: 'Object.keys()',
    values: 'Object.values()',
    entries: 'Object.entries()',
    assign: 'Object.assign() or spread',
    isArray: 'Array.isArray()',
    isString: "typeof x === 'string'",
    isNumber: "typeof x === 'number'",
    isBoolean: "typeof x === 'boolean'",
    isNull: 'x === null',
    isUndefined: 'x === undefined',
    isNil: 'x == null',
  };

  for (const [fn, count] of allLodashImports) {
    if (nativeAlternatives[fn]) {
      suggestions.push({
        category: 'Dependencies',
        priority: count > 2 ? 'medium' : 'low',
        description: `Replace lodash '${fn}' with native ${nativeAlternatives[fn]}`,
        impact: `Used ${count} times - reduces bundle size and improves performance`,
      });
    }
  }

  // Large file suggestions
  const largeFiles = analyses.filter((a) => a.lines > 200);
  for (const file of largeFiles) {
    suggestions.push({
      category: 'Code Organization',
      priority: file.lines > 350 ? 'high' : 'medium',
      description: `Consider splitting large file (${file.lines} lines)`,
      file: file.path,
      impact: 'Improves maintainability and tree-shaking',
    });
  }

  // Files with potential issues
  for (const analysis of analyses) {
    for (const issue of analysis.potentialIssues) {
      suggestions.push({
        category: 'Performance',
        priority: issue.includes('loop') ? 'high' : 'medium',
        description: issue,
        file: analysis.path,
        impact: 'May affect generation performance',
      });
    }
  }

  // General architecture suggestions
  suggestions.push(
    {
      category: 'Architecture',
      priority: 'high',
      description: 'Consider using a worker pool for parallel file generation',
      impact: 'Could significantly speed up large schema generation',
    },
    {
      category: 'Architecture',
      priority: 'medium',
      description: 'Implement incremental generation based on schema changes',
      impact: 'Faster regeneration for small schema updates',
    },
    {
      category: 'Memory',
      priority: 'medium',
      description: 'Use streaming writes instead of building full file in memory',
      impact: 'Reduces memory usage for large schemas',
    },
    {
      category: 'Caching',
      priority: 'high',
      description: 'Cache ts-morph Project and SourceFile objects between runs',
      impact: 'Significant speedup for watch mode',
    },
    {
      category: 'Dependencies',
      priority: 'low',
      description: 'Consider removing await-event-emitter for simpler async handling',
      impact: 'Reduces dependencies and bundle size',
    },
  );

  return suggestions;
}

// Run analysis
console.log('🔍 Code Analysis for nestjs-prisma-graphql\n');
console.log('═'.repeat(70));

const srcDir = new URL('../', import.meta.url).pathname;
const analyses = analyzeDirectory(srcDir);

// Summary statistics
console.log('\n📊 CODEBASE STATISTICS\n');
const totalLines = analyses.reduce((sum, a) => sum + a.lines, 0);
const totalFunctions = analyses.reduce((sum, a) => sum + a.functions, 0);
const totalImports = analyses.reduce((sum, a) => sum + a.imports, 0);
const totalAsync = analyses.reduce((sum, a) => sum + a.asyncFunctions, 0);

console.log(`Files analyzed: ${analyses.length}`);
console.log(`Total lines: ${totalLines.toLocaleString()}`);
console.log(`Total functions: ${totalFunctions}`);
console.log(`Total imports: ${totalImports}`);
console.log(`Async functions: ${totalAsync}`);

// Lodash usage
console.log('\n\n📦 LODASH-ES USAGE\n');
const lodashUsage = new Map<string, number>();
for (const analysis of analyses) {
  for (const fn of analysis.lodashImports) {
    lodashUsage.set(fn, (lodashUsage.get(fn) || 0) + 1);
  }
}

const sortedLodash = [...lodashUsage.entries()].sort((a, b) => b[1] - a[1]);
console.log('Function          Usage Count');
console.log('─'.repeat(35));
for (const [fn, count] of sortedLodash) {
  console.log(`${fn.padEnd(18)} ${count}`);
}

// Large files
console.log('\n\n📁 LARGEST FILES\n');
const sortedByLines = [...analyses].sort((a, b) => b.lines - a.lines);
console.log('Lines   File');
console.log('─'.repeat(60));
for (const file of sortedByLines.slice(0, 10)) {
  const relativePath = file.path.replace(srcDir, '');
  console.log(`${String(file.lines).padStart(5)}   ${relativePath}`);
}

// Files with issues
console.log('\n\n⚠️  FILES WITH POTENTIAL ISSUES\n');
const filesWithIssues = analyses.filter((a) => a.potentialIssues.length > 0);
for (const file of filesWithIssues) {
  const relativePath = file.path.replace(srcDir, '');
  console.log(`\n${relativePath}:`);
  for (const issue of file.potentialIssues) {
    console.log(`  • ${issue}`);
  }
}

// Improvement suggestions
console.log('\n\n' + '═'.repeat(70));
console.log('💡 IMPROVEMENT SUGGESTIONS\n');

const suggestions = generateImprovementSuggestions(analyses);
const byPriority = {
  high: suggestions.filter((s) => s.priority === 'high'),
  medium: suggestions.filter((s) => s.priority === 'medium'),
  low: suggestions.filter((s) => s.priority === 'low'),
};

console.log('🔴 HIGH PRIORITY\n');
for (const s of byPriority.high) {
  console.log(`[${s.category}] ${s.description}`);
  if (s.file) console.log(`   File: ${s.file.replace(srcDir, '')}`);
  console.log(`   Impact: ${s.impact}\n`);
}

console.log('\n🟡 MEDIUM PRIORITY\n');
for (const s of byPriority.medium) {
  console.log(`[${s.category}] ${s.description}`);
  if (s.file) console.log(`   File: ${s.file.replace(srcDir, '')}`);
  console.log(`   Impact: ${s.impact}\n`);
}

console.log('\n🟢 LOW PRIORITY\n');
for (const s of byPriority.low.slice(0, 5)) {
  console.log(`[${s.category}] ${s.description}`);
  console.log(`   Impact: ${s.impact}\n`);
}

console.log('\n' + '═'.repeat(70));
console.log('✅ Analysis complete!\n');
