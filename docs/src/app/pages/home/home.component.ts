import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CodeBlockComponent],
  template: `
    <div class="pt-16">
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="absolute inset-0 industrial-grid"></div>
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-pegasus-500/20 rounded-full blur-[128px] animate-pulse-slow"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-forge-500/20 rounded-full blur-[128px] animate-pulse-slow" style="animation-delay: 2s"></div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div class="text-center">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up opacity-0">
              <span class="w-2 h-2 rounded-full bg-pegasus-400 animate-pulse"></span>
              <span class="text-sm text-steel-300">ESM-first • Prisma 7+ • NestJS</span>
            </div>

            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 animate-fade-in-up opacity-0 stagger-1">
              Generate GraphQL Types<br>
              <span class="text-gradient">from Prisma Schema</span>
            </h1>

            <p class="text-xl text-steel-300 max-w-3xl mx-auto mb-10 animate-fade-in-up opacity-0 stagger-2">
              A modern, ESM-first code generator that creates NestJS GraphQL types, inputs, and args
              directly from your Prisma schema. Built for Prisma 7+ with full TypeScript support.
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up opacity-0 stagger-3">
              <a
                routerLink="/getting-started"
                class="px-8 py-4 rounded-xl bg-gradient-to-r from-pegasus-700 to-pegasus-600 text-white font-bold hover:from-pegasus-600 hover:to-pegasus-500 transition-all shadow-lg shadow-pegasus-900/40 hover:shadow-xl hover:shadow-pegasus-800/50 hover:-translate-y-0.5 border border-pegasus-400/30"
                style="text-shadow: 0 1px 2px rgba(0,0,0,0.2);"
              >
                Get Started
              </a>
              <a
                href="https://github.com/pegasusheavy/nestjs-prisma-graphql"
                target="_blank"
                rel="noopener"
                class="px-8 py-4 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                View on GitHub
              </a>
            </div>
          </div>

          <!-- Code Preview -->
          <div class="mt-16 animate-fade-in-up opacity-0 stagger-4">
            <app-code-block
              [code]="schemaCode"
              language="graphql"
              filename="schema.prisma"
            />
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-24 relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose This Generator?
            </h2>
            <p class="text-lg text-steel-400 max-w-2xl mx-auto">
              Built from the ground up for modern JavaScript/TypeScript ecosystems
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (feature of features; track feature.title) {
              <div class="p-6 rounded-2xl glass hover:bg-white/[0.04] transition-all group">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-pegasus-500/20 to-forge-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span class="text-2xl">{{ feature.icon }}</span>
                </div>
                <h3 class="text-xl font-semibold text-white mb-2">{{ feature.title }}</h3>
                <p class="text-steel-400">{{ feature.description }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Quick Install -->
      <section class="py-24 relative border-t border-white/5">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
              Quick Installation
            </h2>
            <p class="text-lg text-steel-400">
              Get started in seconds with your favorite package manager
            </p>
          </div>

          <div class="space-y-4">
            <app-code-block
              [code]="'pnpm add -D @pegasus-heavy/nestjs-prisma-graphql'"
              language="bash"
            />

            <div class="text-center text-steel-500">or</div>

            <app-code-block
              [code]="'npm install -D @pegasus-heavy/nestjs-prisma-graphql'"
              language="bash"
            />
          </div>

          <div class="mt-12 text-center">
            <a
              routerLink="/getting-started"
              class="inline-flex items-center gap-2 text-pegasus-400 hover:text-pegasus-300 font-medium transition-colors"
            >
              View full installation guide
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      <!-- Generated Output Preview -->
      <section class="py-24 relative border-t border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
              See What Gets Generated
            </h2>
            <p class="text-lg text-steel-400">
              From your Prisma schema to ready-to-use NestJS GraphQL types
            </p>
          </div>

          <div class="grid lg:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-steel-300 mb-3 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-forge-400"></span>
                Input
              </h3>
              <app-code-block
                [code]="prismaInput"
                language="graphql"
                filename="schema.prisma"
              />
            </div>
            <div>
              <h3 class="text-lg font-medium text-steel-300 mb-3 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-pegasus-400"></span>
                Output
              </h3>
              <app-code-block
                [code]="generatedOutput"
                language="typescript"
                filename="user.model.ts"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-24 relative border-t border-white/5">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="p-12 rounded-3xl glass-strong glow-border">
            <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p class="text-lg text-steel-300 mb-8 max-w-xl mx-auto">
              Start generating type-safe GraphQL types from your Prisma schema today.
            </p>
            <a
              routerLink="/getting-started"
              class="inline-flex px-8 py-4 rounded-xl bg-gradient-to-r from-pegasus-700 via-pegasus-600 to-forge-600 text-white font-bold hover:from-pegasus-600 hover:via-pegasus-500 hover:to-forge-500 transition-all shadow-xl shadow-pegasus-900/50 border border-white/20"
              style="text-shadow: 0 1px 2px rgba(0,0,0,0.3);"
            >
              Read the Documentation
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class HomeComponent {
  schemaCode = `generator nestgraphql {
  provider      = "nestjs-prisma-graphql"
  output        = "../src/@generated"
  esmCompatible = true
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}`;

  prismaInput = `model User {
  id    String  @id @default(cuid())

  /// @Validator.IsEmail()
  email String  @unique

  /// @Validator.MaxLength(100)
  name  String?

  posts Post[]
}`;

  generatedOutput = `import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsEmail, MaxLength } from 'class-validator';

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field({ nullable: true })
  @MaxLength(100)
  name?: string | null;

  @Field(() => [Post])
  posts?: Post[];
}`;

  features = [
    {
      icon: '⚡',
      title: 'ESM-First',
      description: 'Built with ES Modules as the primary target. Full support for modern bundlers and runtimes.',
    },
    {
      icon: '🔷',
      title: 'Prisma 7+ Ready',
      description: 'Designed specifically for Prisma 7 and later versions with full DMMF compatibility.',
    },
    {
      icon: '🏗️',
      title: 'NestJS Native',
      description: 'Generates types with @nestjs/graphql decorators ready for immediate use.',
    },
    {
      icon: '🏎️',
      title: 'Express & Fastify',
      description: 'Works with both Express and Fastify platforms. Supports Apollo and Mercurius adapters.',
    },
    {
      icon: '✅',
      title: 'Class Validators',
      description: 'Built-in support for class-validator decorators via schema comments.',
    },
    {
      icon: '🔄',
      title: 'Circular Import Safe',
      description: 'Intelligent handling of circular dependencies with lazy type resolution.',
    },
  ];
}
