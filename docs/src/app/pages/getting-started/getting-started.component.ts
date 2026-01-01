import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';

@Component({
  selector: 'app-getting-started',
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
            <span class="text-white">Getting Started</span>
          </nav>
          <h1 class="text-4xl font-bold text-white mb-4">Getting Started</h1>
          <p class="text-lg text-steel-300">
            Set up the NestJS Prisma GraphQL generator in your project in just a few minutes.
          </p>
        </div>

        <!-- Content -->
        <div class="prose prose-invert max-w-none">
          <!-- Prerequisites -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-pegasus-500/20 flex items-center justify-center text-pegasus-400 text-sm font-mono">1</span>
              Prerequisites
            </h2>
            <div class="p-6 rounded-xl glass">
              <ul class="space-y-3 text-steel-300">
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-pegasus-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span><strong class="text-white">Node.js 20+</strong> - ESM support requires a modern Node.js version</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-pegasus-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span><strong class="text-white">Prisma 7+</strong> - This generator is built for Prisma 7 and later</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-pegasus-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span><strong class="text-white">NestJS 10+</strong> with &#64;nestjs/graphql package</span>
                </li>
              </ul>
            </div>
          </section>

          <!-- Installation -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-pegasus-500/20 flex items-center justify-center text-pegasus-400 text-sm font-mono">2</span>
              Installation
            </h2>
            <p class="text-steel-300 mb-4">
              Install the generator as a dev dependency:
            </p>
            <app-code-block [code]="installCode" language="bash" />

            <div class="mt-6 p-4 rounded-lg bg-forge-500/10 border border-forge-500/20">
              <p class="text-sm text-forge-300 flex items-start gap-2">
                <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>If your models use <code>Decimal</code> or <code>Json</code> types, you'll also need:</span>
              </p>
              <div class="mt-3">
                <app-code-block [code]="'pnpm add graphql-type-json prisma-graphql-type-decimal decimal.js'" language="bash" />
              </div>
            </div>
          </section>

          <!-- Configuration -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-pegasus-500/20 flex items-center justify-center text-pegasus-400 text-sm font-mono">3</span>
              Configure Prisma Schema
            </h2>
            <p class="text-steel-300 mb-4">
              Add the generator to your <code>schema.prisma</code> file:
            </p>
            <app-code-block [code]="schemaConfig" language="graphql" filename="schema.prisma" />

            <div class="mt-6 p-4 rounded-lg bg-pegasus-500/10 border border-pegasus-500/20">
              <p class="text-sm text-pegasus-300">
                <strong>Tip:</strong> Enable <code>esmCompatible = true</code> for proper ESM circular import handling.
                See the <a routerLink="/esm" class="underline hover:text-pegasus-200">ESM Guide</a> for details.
              </p>
            </div>
          </section>

          <!-- Generate -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-pegasus-500/20 flex items-center justify-center text-pegasus-400 text-sm font-mono">4</span>
              Generate Types
            </h2>
            <p class="text-steel-300 mb-4">
              Run Prisma generate to create your GraphQL types:
            </p>
            <app-code-block [code]="generateCode" language="bash" />

            <p class="text-steel-300 mt-4">
              This will generate all your GraphQL types in the <code>src/&#64;generated</code> folder (or wherever you configured the output).
            </p>
          </section>

          <!-- Usage -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-pegasus-500/20 flex items-center justify-center text-pegasus-400 text-sm font-mono">5</span>
              Use in Your Resolvers
            </h2>
            <p class="text-steel-300 mb-4">
              Import and use the generated types in your NestJS resolvers:
            </p>
            <app-code-block [code]="resolverCode" language="typescript" filename="user.resolver.ts" />
          </section>

          <!-- ESM Setup -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-pegasus-500/20 flex items-center justify-center text-pegasus-400 text-sm font-mono">6</span>
              ESM Project Setup
            </h2>
            <p class="text-steel-300 mb-4">
              For ESM projects, make sure your <code>package.json</code> and <code>tsconfig.json</code> are configured correctly:
            </p>

            <div class="space-y-4">
              <app-code-block [code]="packageJson" language="json" filename="package.json" />
              <app-code-block [code]="tsconfig" language="json" filename="tsconfig.json" />
            </div>
          </section>

          <!-- Next Steps -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold text-white mb-6">Next Steps</h2>
            <div class="grid sm:grid-cols-2 gap-4">
              <a routerLink="/configuration" class="p-6 rounded-xl glass hover:bg-white/[0.04] transition-all group">
                <h3 class="font-semibold text-white mb-2 flex items-center gap-2">
                  Configuration
                  <svg class="w-4 h-4 text-steel-400 group-hover:text-pegasus-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </h3>
                <p class="text-sm text-steel-400">Explore all generator options and customize output</p>
              </a>
              <a routerLink="/decorators" class="p-6 rounded-xl glass hover:bg-white/[0.04] transition-all group">
                <h3 class="font-semibold text-white mb-2 flex items-center gap-2">
                  Decorators
                  <svg class="w-4 h-4 text-steel-400 group-hover:text-pegasus-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </h3>
                <p class="text-sm text-steel-400">Learn about field decorators and customization</p>
              </a>
              <a routerLink="/validators" class="p-6 rounded-xl glass hover:bg-white/[0.04] transition-all group">
                <h3 class="font-semibold text-white mb-2 flex items-center gap-2">
                  Validators
                  <svg class="w-4 h-4 text-steel-400 group-hover:text-pegasus-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </h3>
                <p class="text-sm text-steel-400">Add class-validator decorators to your schema</p>
              </a>
              <a routerLink="/esm" class="p-6 rounded-xl glass hover:bg-white/[0.04] transition-all group">
                <h3 class="font-semibold text-white mb-2 flex items-center gap-2">
                  ESM Guide
                  <svg class="w-4 h-4 text-steel-400 group-hover:text-pegasus-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </h3>
                <p class="text-sm text-steel-400">Handle circular dependencies in ESM</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
})
export class GettingStartedComponent {
  installCode = `# Using pnpm (recommended)
pnpm add -D @pegasus-heavy/nestjs-prisma-graphql

# Using npm
npm install -D @pegasus-heavy/nestjs-prisma-graphql

# Using yarn
yarn add -D @pegasus-heavy/nestjs-prisma-graphql`;

  schemaConfig = `generator client {
  provider = "prisma-client-js"
}

generator nestgraphql {
  provider      = "nestjs-prisma-graphql"
  output        = "../src/@generated"
  esmCompatible = true
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
}`;

  generateCode = `npx prisma generate`;

  resolverCode = `import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { User } from '../@generated/user/user.model';
import { UserCreateInput } from '../@generated/user/user-create.input';
import { FindManyUserArgs } from '../@generated/user/find-many-user.args';
import { PrismaService } from './prisma.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [User])
  async users(@Args() args: FindManyUserArgs) {
    return this.prisma.user.findMany(args);
  }

  @Mutation(() => User)
  async createUser(@Args('data') data: UserCreateInput) {
    return this.prisma.user.create({ data });
  }
}`;

  packageJson = `{
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
    "emitDecoratorMetadata": true
  }
}`;
}
