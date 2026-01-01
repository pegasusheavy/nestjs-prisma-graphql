import { StructureKind } from 'ts-morph';

import { relativePath } from '../helpers/relative-path.js';
import type { EventArguments } from '../types.js';

/**
 * Generate the register-all-types.ts file that imports all generated types
 * to ensure their registerType() calls are executed.
 *
 * This file must be imported early in the application, before any code
 * tries to use getType() for lazy type resolution.
 *
 * This solves the ESM bundling issue where CJS would return valid bundles
 * but ESM complains about broken dependency cycles.
 */
export function generateRegisterAllTypes(args: EventArguments): void {
  const { config, output, project } = args;

  if (!config.esmCompatible) {
    return;
  }

  const rootDirectory = project.getDirectory(output) || project.createDirectory(output);
  const sourceFile = rootDirectory.createSourceFile(
    'register-all-types.ts',
    undefined,
    { overwrite: true },
  );

  // Collect all generated source files that have registerType() calls
  const importPaths: string[] = [];
  const typeNames: string[] = [];

  // Get all source files in the output directory
  const allSourceFiles = project.getSourceFiles(`${output}/**/*.ts`);

  for (const file of allSourceFiles) {
    const filePath = file.getFilePath();

    // Skip utility files and the register file itself
    if (
      filePath.endsWith('type-registry.ts') ||
      filePath.endsWith('register-all-types.ts') ||
      filePath.endsWith('index.ts')
    ) {
      continue;
    }

    // Check if this file has a registerType() call
    const fileText = file.getText();
    const registerMatch = fileText.match(/registerType\(['"]([^'"]+)['"]/);
    if (registerMatch) {
      // Get relative path from register-all-types.ts to this file
      const relPath = relativePath(sourceFile.getFilePath(), filePath);
      importPaths.push(relPath);
      typeNames.push(registerMatch[1]);
    }
  }

  // Sort for consistent output
  importPaths.sort();
  typeNames.sort();

  // Generate the file content with proper ESM handling
  const fileContent = `/**
 * ESM Type Registration Module
 *
 * This file registers all generated types with the type registry to solve
 * ESM circular dependency issues. In ESM, unlike CommonJS, circular imports
 * can result in undefined values because modules are evaluated in a different order.
 *
 * IMPORTANT: Import this file at the very top of your application entry point,
 * BEFORE any other code that uses the generated types.
 *
 * Example usage in main.ts:
 *
 *   // This MUST be the first import
 *   import './@generated/register-all-types.js';
 *
 *   // Now you can safely import and use generated types
 *   import { NestFactory } from '@nestjs/core';
 *   import { AppModule } from './app.module.js';
 *
 * Why this is needed:
 * - ESM uses "live bindings" where imports reference the actual export
 * - With circular deps (User -> Post -> User), one module isn't ready when imported
 * - CJS would give a partial object that fills in later; ESM gives undefined
 * - This registry pattern defers type resolution until runtime when all modules are loaded
 */

import { markRegistrationComplete } from './type-registry.js';

// Import all generated type files to trigger their registerType() calls
// These are side-effect imports that populate the type registry
${importPaths.map(p => `import '${p}';`).join('\n')}

// Mark registration as complete to enable warning messages
markRegistrationComplete();

// Export type names for validation (optional)
export const registeredTypes = [
${typeNames.map(n => `  '${n}',`).join('\n')}
] as const;

export type RegisteredTypeName = typeof registeredTypes[number];
`;

  sourceFile.addStatements(fileContent);
}
