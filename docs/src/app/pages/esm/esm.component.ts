import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';

@Component({
  selector: 'app-esm',
  standalone: true,
  imports: [RouterLink, CodeBlockComponent],
  template: `
    <div class="pt-24 pb-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-12">
          <nav class="flex items-center gap-2 text-sm text-steel-400 mb-4">
            <a routerLink="/" class="hover:text-pegasus-400 transition-colors">Home</a>
            <span>/</span>
            <span class="text-white">ESM Guide</span>
          </nav>
          <h1 class="text-4xl font-bold text-white mb-4">ESM Compatibility</h1>
          <p class="text-lg text-steel-300">
            This generator is built ESM-first. Learn how to handle circular dependencies and
            configure your project for optimal ESM support.
          </p>
        </div>

        <!-- Why ESM -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Why ESM-First?</h2>
          <div class="grid sm:grid-cols-2 gap-4">
            @for (benefit of benefits; track benefit.title) {
              <div class="p-5 rounded-xl glass">
                <div class="text-2xl mb-3">{{ benefit.icon }}</div>
                <h3 class="font-semibold text-white mb-2">{{ benefit.title }}</h3>
                <p class="text-sm text-steel-400">{{ benefit.description }}</p>
              </div>
            }
          </div>
        </section>

        <!-- Circular Dependencies -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">The Circular Dependency Problem</h2>
          <p class="text-steel-300 mb-4">
            In ESM, circular imports behave differently than CommonJS. When models reference each other
            (like User ↔ Post), you can get undefined imports at runtime:
          </p>
          <app-code-block [code]="circularProblem" language="graphql" filename="schema.prisma" />

          <div class="mt-4 p-4 rounded-lg bg-forge-500/10 border border-forge-500/20">
            <p class="text-sm text-forge-300">
              <strong>Without handling:</strong> When <code>user.model.ts</code> imports <code>Post</code>
              and <code>post.model.ts</code> imports <code>User</code>, one of them will be
              <code>undefined</code> during initialization.
            </p>
          </div>
        </section>

        <!-- Solution -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">The Solution: esmCompatible</h2>
          <p class="text-steel-300 mb-4">
            Enable the <code>esmCompatible</code> option to generate code that handles circular dependencies:
          </p>
          <app-code-block [code]="esmConfig" language="graphql" filename="schema.prisma" />

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">What Gets Generated</h3>
          <div class="space-y-4">
            <div class="p-4 rounded-lg glass">
              <code class="text-pegasus-400">type-registry.ts</code>
              <p class="text-sm text-steel-400 mt-1">
                Central registry for lazy type resolution. Types are registered at module load time
                and resolved at runtime.
              </p>
            </div>
            <div class="p-4 rounded-lg glass">
              <code class="text-pegasus-400">register-all-types.ts</code>
              <p class="text-sm text-steel-400 mt-1">
                Import this early in your application to ensure all types are registered before use.
              </p>
            </div>
          </div>
        </section>

        <!-- Type Registry -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Using the Type Registry</h2>
          <p class="text-steel-300 mb-4">
            The type registry provides a <code>getType()</code> function for runtime type resolution:
          </p>
          <app-code-block [code]="registryExample" language="typescript" filename="type-registry.ts" />

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">In Generated Models</h3>
          <app-code-block [code]="modelExample" language="typescript" filename="user.model.ts" />
        </section>

        <!-- App Setup -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Application Setup</h2>
          <p class="text-steel-300 mb-4">
            Import the type registry early in your application's entry point:
          </p>
          <app-code-block [code]="mainSetup" language="typescript" filename="main.ts" />

          <div class="mt-4 p-4 rounded-lg bg-pegasus-500/10 border border-pegasus-500/20">
            <p class="text-sm text-pegasus-300">
              <strong>Important:</strong> The <code>register-all-types</code> import must come
              before any code that uses the generated types.
            </p>
          </div>
        </section>

        <!-- Project Config -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Project Configuration</h2>

          <h3 class="text-lg font-semibold text-white mb-3">package.json</h3>
          <app-code-block [code]="packageJson" language="json" filename="package.json" />

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">tsconfig.json</h3>
          <app-code-block [code]="tsconfig" language="json" filename="tsconfig.json" />
        </section>

        <!-- Troubleshooting -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Troubleshooting</h2>

          <div class="space-y-6">
            <div class="p-5 rounded-xl glass">
              <h3 class="font-semibold text-white mb-2 flex items-center gap-2">
                <span class="text-forge-400">⚠️</span>
                Type is undefined at runtime
              </h3>
              <p class="text-steel-400 text-sm mb-3">
                Ensure you're importing <code>register-all-types</code> before using any generated types.
              </p>
              <app-code-block [code]="registerImportFix" language="typescript" />
            </div>

            <div class="p-5 rounded-xl glass">
              <h3 class="font-semibold text-white mb-2 flex items-center gap-2">
                <span class="text-forge-400">⚠️</span>
                ERR_MODULE_NOT_FOUND
              </h3>
              <p class="text-steel-400 text-sm mb-3">
                Make sure all imports use <code>.js</code> extensions (TypeScript resolves them to <code>.ts</code>):
              </p>
              <app-code-block [code]="extensionExample" language="typescript" />
            </div>

            <div class="p-5 rounded-xl glass">
              <h3 class="font-semibold text-white mb-2 flex items-center gap-2">
                <span class="text-forge-400">⚠️</span>
                Cannot use import statement outside a module
              </h3>
              <p class="text-steel-400 text-sm mb-3">
                Add <code>"type": "module"</code> to your package.json or use <code>.mjs</code> extension.
              </p>
            </div>
          </div>
        </section>

        <!-- Without ESM -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">CommonJS Fallback</h2>
          <p class="text-steel-300 mb-4">
            If you're not using ESM, you can disable the ESM-specific features:
          </p>
          <app-code-block [code]="cjsConfig" language="graphql" />
          <div class="mt-4 p-4 rounded-lg bg-steel-500/10 border border-steel-500/20">
            <p class="text-sm text-steel-300">
              <strong>Note:</strong> The generator still produces valid TypeScript. CommonJS bundlers
              and transpilers will handle the output correctly. The <code>esmCompatible</code> option
              only affects how circular dependencies are handled.
            </p>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class EsmComponent {
  benefits = [
    {
      icon: '🌳',
      title: 'Tree Shaking',
      description: 'ESM enables better dead code elimination and smaller bundle sizes.',
    },
    {
      icon: '⚡',
      title: 'Native Support',
      description: 'Modern Node.js and browsers support ESM natively without transpilation.',
    },
    {
      icon: '🔒',
      title: 'Static Analysis',
      description: 'ESM imports are statically analyzable for better tooling support.',
    },
    {
      icon: '🔮',
      title: 'Future-Proof',
      description: 'ESM is the official JavaScript module standard going forward.',
    },
  ];

  circularProblem = `model User {
  id    String @id @default(cuid())
  posts Post[]  // User references Post
}

model Post {
  id       String @id @default(cuid())
  author   User   @relation(fields: [authorId], references: [id])
  authorId String // Post references User
}`;

  esmConfig = `generator nestgraphql {
  provider      = "nestjs-prisma-graphql"
  output        = "../src/@generated"
  esmCompatible = true  // Enable ESM circular dependency handling
}`;

  registryExample = `// Auto-generated type registry
const typeRegistry = new Map<string, () => unknown>();

export function registerType(name: string, typeFactory: () => unknown): void {
  typeRegistry.set(name, typeFactory);
}

export function getType<T>(name: string): T {
  const factory = typeRegistry.get(name);
  if (!factory) {
    throw new Error(\`Type "\${name}" not registered\`);
  }
  return factory() as T;
}`;

  modelExample = `import { ObjectType, Field, ID } from '@nestjs/graphql';
import { getType } from './type-registry.js';

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  // Instead of direct import, use getType for circular refs
  @Field(() => [getType<typeof Post>('Post')])
  posts?: Post[];
}

// Register this type
import { registerType } from './type-registry.js';
registerType('User', () => User);`;

  mainSetup = `// Import type registry FIRST - before any generated types
import './${'@'}generated/register-all-types.js';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();`;

  registerImportFix = `import './${'@'}generated/register-all-types.js';`;

  packageJson = `{
  "name": "my-nestjs-app",
  "type": "module",
  "engines": {
    "node": ">=20.0.0"
  }
}`;

  tsconfig = `{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "strict": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "verbatimModuleSyntax": true
  }
}`;

  extensionExample = `// ❌ Wrong - will fail in ESM
import { User } from './user.model';

// ✅ Correct - use .js extension
import { User } from './user.model.js';`;

  cjsConfig = `generator nestgraphql {
  provider      = "nestjs-prisma-graphql"
  output        = "../src/@generated"
  esmCompatible = false  // Disable ESM handling
}`;
}
