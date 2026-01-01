import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';

@Component({
  selector: 'app-configuration',
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
            <span class="text-white">Configuration</span>
          </nav>
          <h1 class="text-4xl font-bold text-white mb-4">Configuration</h1>
          <p class="text-lg text-steel-300">
            Complete reference for all generator configuration options.
          </p>
        </div>

        <!-- Core Options -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Core Options</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="py-3 px-4 text-steel-300 font-medium">Option</th>
                  <th class="py-3 px-4 text-steel-300 font-medium">Type</th>
                  <th class="py-3 px-4 text-steel-300 font-medium">Default</th>
                  <th class="py-3 px-4 text-steel-300 font-medium">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                @for (opt of coreOptions; track opt.name) {
                  <tr class="hover:bg-white/[0.02]">
                    <td class="py-3 px-4"><code class="text-pegasus-400">{{ opt.name }}</code></td>
                    <td class="py-3 px-4 text-steel-400">{{ opt.type }}</td>
                    <td class="py-3 px-4"><code class="text-forge-400">{{ opt.default }}</code></td>
                    <td class="py-3 px-4 text-steel-300">{{ opt.description }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>

        <!-- Example -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Full Example</h2>
          <app-code-block [code]="fullExample" language="graphql" filename="schema.prisma" />
        </section>

        <!-- Output Patterns -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Output File Pattern</h2>
          <p class="text-steel-300 mb-4">
            The <code>outputFilePattern</code> option controls how generated files are organized. Available placeholders:
          </p>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="py-3 px-4 text-steel-300 font-medium">Placeholder</th>
                  <th class="py-3 px-4 text-steel-300 font-medium">Description</th>
                  <th class="py-3 px-4 text-steel-300 font-medium">Example</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                @for (p of placeholders; track p.name) {
                  <tr class="hover:bg-white/[0.02]">
                    <td class="py-3 px-4"><code class="text-pegasus-400">{{ p.name }}</code></td>
                    <td class="py-3 px-4 text-steel-300">{{ p.description }}</td>
                    <td class="py-3 px-4"><code class="text-forge-400">{{ p.example }}</code></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div class="mt-6">
            <h3 class="text-lg font-semibold text-white mb-3">Examples</h3>
            <app-code-block [code]="patternExamples" language="graphql" />
          </div>
        </section>

        <!-- Re-export -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Re-export Options</h2>
          <p class="text-steel-300 mb-4">
            The <code>reExport</code> option controls how index files are generated:
          </p>
          <div class="space-y-4">
            @for (opt of reExportOptions; track opt.value) {
              <div class="p-4 rounded-xl glass">
                <div class="flex items-center gap-3 mb-2">
                  <code class="text-pegasus-400 font-medium">{{ opt.value }}</code>
                </div>
                <p class="text-steel-400 text-sm">{{ opt.description }}</p>
              </div>
            }
          </div>
        </section>

        <!-- Code Generation -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Code Generation Options</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="py-3 px-4 text-steel-300 font-medium">Option</th>
                  <th class="py-3 px-4 text-steel-300 font-medium">Type</th>
                  <th class="py-3 px-4 text-steel-300 font-medium">Default</th>
                  <th class="py-3 px-4 text-steel-300 font-medium">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                @for (opt of codeGenOptions; track opt.name) {
                  <tr class="hover:bg-white/[0.02]">
                    <td class="py-3 px-4"><code class="text-pegasus-400">{{ opt.name }}</code></td>
                    <td class="py-3 px-4 text-steel-400">{{ opt.type }}</td>
                    <td class="py-3 px-4"><code class="text-forge-400">{{ opt.default }}</code></td>
                    <td class="py-3 px-4 text-steel-300">{{ opt.description }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>

        <!-- Decorate -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Custom Decorators (decorate_*)</h2>
          <p class="text-steel-300 mb-4">
            Add custom decorators to specific types or fields using the <code>decorate_*</code> pattern:
          </p>
          <app-code-block [code]="decorateExample" language="graphql" filename="schema.prisma" />

          <div class="mt-6 p-4 rounded-lg bg-pegasus-500/10 border border-pegasus-500/20">
            <p class="text-sm text-pegasus-300">
              <strong>Pattern:</strong> <code>decorate_N_property</code> where N is a number (1, 2, 3...)
              and property is one of: <code>type</code>, <code>field</code>, <code>name</code>, <code>from</code>, <code>arguments</code>
            </p>
          </div>
        </section>

        <!-- Fields Configuration -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Field Namespace Configuration</h2>
          <p class="text-steel-300 mb-4">
            Configure custom namespaces (like Validator, Scalars) using the <code>fields_*</code> pattern:
          </p>
          <app-code-block [code]="fieldsExample" language="graphql" filename="schema.prisma" />
        </section>

        <!-- Disabling Generator -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Disabling the Generator</h2>
          <p class="text-steel-300 mb-4">
            You can disable code generation using environment variables or the <code>disabled</code> config option.
            This is useful for CI/CD pipelines, Docker builds, or conditional generation.
          </p>

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Environment Variables</h3>
          <app-code-block [code]="disableEnvExample" language="bash" />

          <div class="mt-4 p-4 rounded-lg bg-steel-500/10 border border-steel-500/20">
            <p class="text-sm text-steel-300">
              <strong>Priority:</strong> Environment variables are checked in order of specificity.
              <code>DISABLE_NESTJS_PRISMA_GRAPHQL</code> takes precedence over <code>PRISMA_GENERATOR_SKIP</code>.
            </p>
          </div>

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Config Option</h3>
          <app-code-block [code]="disableConfigExample" language="graphql" filename="schema.prisma" />

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">CI/CD Examples</h3>
          <app-code-block [code]="disableCiExample" language="yaml" filename=".github/workflows/ci.yml" />
        </section>
      </div>
    </div>
  `,
})
export class ConfigurationComponent {
  coreOptions = [
    { name: 'output', type: 'string', default: '-', description: 'Output folder relative to schema file' },
    { name: 'outputFilePattern', type: 'string', default: '{model}/{name}.{type}.ts', description: 'File path pattern for generated files' },
    { name: 'esmCompatible', type: 'boolean', default: 'true', description: 'Enable ESM circular import resolution' },
    { name: 'prismaClientImport', type: 'string', default: '@prisma/client', description: 'Path to Prisma Client import' },
    { name: 'tsConfigFilePath', type: 'string', default: '-', description: 'Path to tsconfig.json for type checking' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable code generation (accepts: true, "1", "yes")' },
  ];

  codeGenOptions = [
    { name: 'combineScalarFilters', type: 'boolean', default: 'false', description: 'Combine nested/nullable scalar filters into single types' },
    { name: 'noAtomicOperations', type: 'boolean', default: 'false', description: 'Remove atomic operation input types (IntFieldUpdateOperationsInput, etc.)' },
    { name: 'reExport', type: 'enum', default: 'None', description: 'Create index.ts files: None, Directories, Single, All' },
    { name: 'emitSingle', type: 'boolean', default: 'false', description: 'Generate all types in a single file' },
    { name: 'emitCompiled', type: 'boolean', default: 'false', description: 'Emit compiled JavaScript alongside TypeScript' },
    { name: 'purgeOutput', type: 'boolean', default: 'false', description: 'Delete output folder before generating' },
    { name: 'noTypeId', type: 'boolean', default: 'false', description: 'Disable GraphQL ID type for @id fields' },
    { name: 'omitModelsCount', type: 'boolean', default: 'false', description: 'Omit _count field from model outputs' },
    { name: 'useInputType', type: 'string', default: '-', description: 'Use input types in specific locations' },
    { name: 'graphqlScalars', type: 'string', default: '-', description: 'Custom GraphQL scalar mappings' },
  ];

  placeholders = [
    { name: '{model}', description: 'Model name in kebab-case', example: 'user, blog-post' },
    { name: '{name}', description: 'Type name in kebab-case', example: 'user-create-input' },
    { name: '{type}', description: 'Category of type', example: 'model, input, args, enum' },
    { name: '{plural}', description: 'Pluralized model name', example: 'users, blog-posts' },
  ];

  reExportOptions = [
    { value: 'None', description: 'No index files generated (default)' },
    { value: 'Directories', description: 'Create index.ts in each model directory' },
    { value: 'Single', description: 'Create a single index.ts at the output root' },
    { value: 'All', description: 'Create both directory indexes and root index' },
  ];

  fullExample = `generator nestgraphql {
  provider               = "nestjs-prisma-graphql"
  output                 = "../src/@generated"

  // ESM Support
  esmCompatible          = true

  // Output structure
  outputFilePattern      = "{model}/{name}.{type}.ts"
  reExport               = "Directories"
  purgeOutput            = true

  // Code generation
  combineScalarFilters   = true
  noAtomicOperations     = false
  noTypeId               = false
  omitModelsCount        = false

  // Validators
  fields_Validator_from  = "class-validator"
  fields_Validator_input = true

  // Custom scalars
  fields_Scalars_from    = "graphql-scalars"
  fields_Scalars_output  = true
}`;

  patternExamples = `// Default - organized by model
outputFilePattern = "{model}/{name}.{type}.ts"
// Result: user/user.model.ts, user/user-create.input.ts

// Flat structure
outputFilePattern = "{name}.{type}.ts"
// Result: user.model.ts, user-create.input.ts

// Grouped by type
outputFilePattern = "{type}/{name}.ts"
// Result: model/user.ts, input/user-create.ts`;

  decorateExample = `generator nestgraphql {
  provider = "nestjs-prisma-graphql"
  output   = "../src/@generated"

  // Add @ValidateNested() to UserCreateInput.data
  decorate_1_type      = "UserCreateInput"
  decorate_1_field     = "data"
  decorate_1_name      = "ValidateNested"
  decorate_1_from      = "class-validator"
  decorate_1_arguments = "[]"

  // Add @Type(() => ProfileCreateInput)
  decorate_2_type      = "UserCreateInput"
  decorate_2_field     = "profile"
  decorate_2_name      = "Type"
  decorate_2_from      = "class-transformer"
  decorate_2_arguments = "[() => ProfileCreateInput]"
}`;

  fieldsExample = `generator nestgraphql {
  provider = "nestjs-prisma-graphql"
  output   = "../src/@generated"

  // Enable class-validator support
  fields_Validator_from   = "class-validator"
  fields_Validator_input  = true    // Apply to input types
  fields_Validator_output = false   // Don't apply to output types
  fields_Validator_model  = false   // Don't apply to model types

  // Enable GraphQL scalars
  fields_Scalars_from     = "graphql-scalars"
  fields_Scalars_output   = true
}`;

  disableEnvExample = `# Most specific - disable only this generator
DISABLE_NESTJS_PRISMA_GRAPHQL=true npx prisma generate

# CI-specific skip flag
CI_SKIP_PRISMA_GRAPHQL=true npx prisma generate

# Skip all Prisma generators (common convention)
PRISMA_GENERATOR_SKIP=true npx prisma generate

# Alternative skip flag
SKIP_PRISMA_GENERATE=true npx prisma generate`;

  disableConfigExample = `generator nestgraphql {
  provider = "nestjs-prisma-graphql"
  output   = "../src/@generated"
  disabled = true  // Skip code generation
}`;

  disableCiExample = `jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Generate Prisma Client only (skip GraphQL types)
      - name: Generate Prisma Client
        run: npx prisma generate
        env:
          DISABLE_NESTJS_PRISMA_GRAPHQL: true

      # Full generation in another job
      - name: Generate All Types
        run: npx prisma generate
        # No env var = generates everything`;
}
