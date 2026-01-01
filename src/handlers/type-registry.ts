import { StructureKind } from 'ts-morph';

import type { EventArguments } from '../types.js';

/**
 * Generate the type-registry.ts file that provides lazy type resolution
 * for circular dependencies in ESM environments.
 *
 * This solves the ESM bundling issue where CJS would return valid bundles
 * but ESM complains about broken dependency cycles. In ESM, circular imports
 * can result in undefined values because module evaluation order differs from CJS.
 *
 * The registry pattern defers type resolution until runtime when all modules
 * have been fully initialized.
 */
export function generateTypeRegistry(args: EventArguments): void {
  const { config, output, project } = args;

  if (!config.esmCompatible) {
    return;
  }

  const rootDirectory = project.getDirectory(output) || project.createDirectory(output);

  const sourceFile = rootDirectory.createSourceFile(
    'type-registry.ts',
    undefined,
    { overwrite: true },
  );

  // Generate a comprehensive type registry with error handling and forwardRef support
  const registryCode = `/**
 * Type Registry for ESM Circular Dependency Resolution
 *
 * In ESM, circular dependencies behave differently than CommonJS:
 * - CJS: Modules get a partial/incomplete export object that gets filled in
 * - ESM: Imports are "live bindings" but can be undefined if not yet initialized
 *
 * This registry solves this by:
 * 1. Deferring type resolution until runtime (after all modules are loaded)
 * 2. Providing a forwardRef pattern for GraphQL field type declarations
 * 3. Validating all types are registered before they're needed
 */

const registry = new Map<string, unknown>();
const pendingResolutions = new Map<string, Array<(type: unknown) => void>>();
let registrationComplete = false;

/**
 * Register a type with the registry.
 * This should be called at module load time after the class is defined.
 */
export function registerType(name: string, type: unknown): void {
  if (type === undefined) {
    console.warn(\`[nestjs-prisma-graphql] Warning: Registering undefined type for "\${name}". This may indicate a circular dependency issue.\`);
  }
  registry.set(name, type);

  // Resolve any pending forwardRef callbacks
  const pending = pendingResolutions.get(name);
  if (pending) {
    for (const callback of pending) {
      callback(type);
    }
    pendingResolutions.delete(name);
  }
}

/**
 * Get a type from the registry.
 * Returns the type if registered, undefined otherwise.
 *
 * For use in \\@Field(() => getType('TypeName')) decorators.
 */
export function getType<T = unknown>(name: string): T {
  const type = registry.get(name);
  if (type === undefined && registrationComplete) {
    console.warn(\`[nestjs-prisma-graphql] Warning: Type "\${name}" not found in registry. Ensure register-all-types is imported before using generated types.\`);
  }
  return type as T;
}

/**
 * Create a forward reference to a type that may not be registered yet.
 * This is useful for handling circular dependencies where type A references type B
 * and type B references type A.
 *
 * Usage: \\@Field(() => forwardRef('Post'))
 */
export function forwardRef<T = unknown>(name: string): () => T {
  return () => {
    const type = registry.get(name);
    if (type === undefined) {
      throw new Error(
        \`[nestjs-prisma-graphql] Type "\${name}" not registered. \\n\` +
        \`This usually means:\\n\` +
        \`  1. The register-all-types.ts file was not imported early enough\\n\` +
        \`  2. There's a circular dependency that couldn't be resolved\\n\` +
        \`  3. The type file failed to load\\n\\n\` +
        \`Make sure to import 'register-all-types' at the top of your main.ts or app.module.ts\`
      );
    }
    return type as T;
  };
}

/**
 * Lazily resolve a type, returning a thunk that can be called later.
 * This is the safest pattern for circular references in ESM.
 *
 * Usage: \\@Field(lazyType('Post'))
 */
export function lazyType<T = unknown>(name: string): () => T {
  return () => getType<T>(name);
}

/**
 * Mark registration as complete. Called after all types are imported.
 * This enables warning messages for missing types.
 */
export function markRegistrationComplete(): void {
  registrationComplete = true;

  // Warn about any unresolved forward refs
  if (pendingResolutions.size > 0) {
    const missing = Array.from(pendingResolutions.keys()).join(', ');
    console.warn(\`[nestjs-prisma-graphql] Warning: Unresolved forward references: \${missing}\`);
  }
}

/**
 * Get all registered type names (useful for debugging)
 */
export function getRegisteredTypes(): string[] {
  return Array.from(registry.keys());
}

/**
 * Check if a type is registered
 */
export function isTypeRegistered(name: string): boolean {
  return registry.has(name);
}

/**
 * Validate that all expected types are registered.
 * Throws an error if any types are missing.
 */
export function validateRegistry(expectedTypes: string[]): void {
  const missing = expectedTypes.filter(name => !registry.has(name));
  if (missing.length > 0) {
    throw new Error(
      \`[nestjs-prisma-graphql] Missing type registrations: \${missing.join(', ')}\\n\` +
      \`Ensure register-all-types.ts is imported before using these types.\`
    );
  }
}
`;

  sourceFile.addStatements(registryCode);
}
