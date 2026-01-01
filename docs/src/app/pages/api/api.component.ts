import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';

@Component({
  selector: 'app-api',
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
            <span class="text-white">API Reference</span>
          </nav>
          <h1 class="text-4xl font-bold text-white mb-4">API Reference</h1>
          <p class="text-lg text-steel-300">
            Technical reference for the generator's programmatic API.
          </p>
        </div>

        <!-- Generate Function -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">generate()</h2>
          <p class="text-steel-300 mb-4">
            The main generator function. Called by Prisma during <code>prisma generate</code>.
          </p>
          <app-code-block [code]="generateApi" language="typescript" />
          
          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Parameters</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="py-3 px-4 text-steel-300 font-medium">Name</th>
                  <th class="py-3 px-4 text-steel-300 font-medium">Type</th>
                  <th class="py-3 px-4 text-steel-300 font-medium">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr class="hover:bg-white/[0.02]">
                  <td class="py-3 px-4"><code class="text-pegasus-400">args</code></td>
                  <td class="py-3 px-4 text-steel-400">GeneratorOptions</td>
                  <td class="py-3 px-4 text-steel-300">Prisma generator options from DMMF</td>
                </tr>
                <tr class="hover:bg-white/[0.02]">
                  <td class="py-3 px-4"><code class="text-pegasus-400">skipAddOutputSourceFiles</code></td>
                  <td class="py-3 px-4 text-steel-400">boolean</td>
                  <td class="py-3 px-4 text-steel-300">Skip adding source files to project (testing)</td>
                </tr>
                <tr class="hover:bg-white/[0.02]">
                  <td class="py-3 px-4"><code class="text-pegasus-400">connectCallback</code></td>
                  <td class="py-3 px-4 text-steel-400">Function</td>
                  <td class="py-3 px-4 text-steel-300">Hook to connect to generator events</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Event Emitter -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Event System</h2>
          <p class="text-steel-300 mb-4">
            The generator uses an event-based architecture. You can hook into various stages 
            of generation using the <code>connectCallback</code> parameter.
          </p>

          <h3 class="text-lg font-semibold text-white mb-3">Available Events</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="py-3 px-4 text-steel-300 font-medium">Event</th>
                  <th class="py-3 px-4 text-steel-300 font-medium">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                @for (event of events; track event.name) {
                  <tr class="hover:bg-white/[0.02]">
                    <td class="py-3 px-4"><code class="text-pegasus-400">{{ event.name }}</code></td>
                    <td class="py-3 px-4 text-steel-300">{{ event.description }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Example: Custom Event Handler</h3>
          <app-code-block [code]="eventExample" language="typescript" />
        </section>

        <!-- Generated Types -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Generated Type Categories</h2>
          <p class="text-steel-300 mb-4">
            The generator creates different type categories for each model:
          </p>

          <div class="grid sm:grid-cols-2 gap-4">
            @for (type of typeCategories; track type.name) {
              <div class="p-5 rounded-xl glass">
                <code class="text-pegasus-400 font-medium">{{ type.name }}</code>
                <p class="text-sm text-steel-400 mt-2">{{ type.description }}</p>
                <p class="text-xs text-steel-500 mt-2">Example: {{ type.example }}</p>
              </div>
            }
          </div>
        </section>

        <!-- Configuration Types -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Configuration Types</h2>
          <app-code-block [code]="configTypes" language="typescript" />
        </section>

        <!-- EventArguments -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">EventArguments</h2>
          <p class="text-steel-300 mb-4">
            The context object passed to all event handlers:
          </p>
          <app-code-block [code]="eventArgsType" language="typescript" />
        </section>

        <!-- Utility Functions -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Utility Functions</h2>
          
          <div class="space-y-6">
            <div class="p-5 rounded-xl glass">
              <h3 class="font-semibold text-white mb-2">
                <code class="text-pegasus-400">createGetModelName(modelNames: string[])</code>
              </h3>
              <p class="text-steel-400 text-sm mb-3">
                Creates a function that extracts model names from Prisma type names.
              </p>
              <app-code-block [code]="getModelNameExample" language="typescript" />
            </div>

            <div class="p-5 rounded-xl glass">
              <h3 class="font-semibold text-white mb-2">
                <code class="text-pegasus-400">pascalCase(value: string)</code>
              </h3>
              <p class="text-steel-400 text-sm mb-3">
                Converts strings to PascalCase.
              </p>
              <app-code-block [code]="pascalCaseExample" language="typescript" />
            </div>

            <div class="p-5 rounded-xl glass">
              <h3 class="font-semibold text-white mb-2">
                <code class="text-pegasus-400">getPropertyType(field: Field)</code>
              </h3>
              <p class="text-steel-400 text-sm mb-3">
                Gets the TypeScript property type for a Prisma field.
              </p>
              <app-code-block [code]="propertyTypeExample" language="typescript" />
            </div>
          </div>
        </section>

        <!-- DMMF Types -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Prisma DMMF Types</h2>
          <p class="text-steel-300 mb-4">
            The generator works with Prisma's DMMF (Data Model Meta Format). Key types:
          </p>
          <app-code-block [code]="dmmfTypes" language="typescript" />
        </section>
      </div>
    </div>
  `,
})
export class ApiComponent {
  generateApi = `import { generate } from '@pegasus-heavy/nestjs-prisma-graphql/generate';
import type { GeneratorOptions } from '@prisma/generator-helper';

// Called by Prisma during \`prisma generate\`
export async function generate(
  args: GeneratorOptions & {
    skipAddOutputSourceFiles?: boolean;
    connectCallback?: (
      emitter: EventEmitter,
      eventArguments: EventArguments,
    ) => void | Promise<void>;
  }
): Promise<void>;`;

  events = [
    { name: 'Begin', description: 'Generation started, schema parsed' },
    { name: 'BeforeGenerateFiles', description: 'Before writing any files' },
    { name: 'BeforeInputType', description: 'Before generating an input type' },
    { name: 'BeforeOutputType', description: 'Before generating an output type' },
    { name: 'BeforeModel', description: 'Before generating a model class' },
    { name: 'BeforeGenerateField', description: 'Before generating a field' },
    { name: 'BeforeEnum', description: 'Before generating an enum' },
    { name: 'AfterGenerateFiles', description: 'After all files generated' },
    { name: 'End', description: 'Generation complete' },
    { name: 'Warning', description: 'Non-fatal warning occurred' },
  ];

  eventExample = `import { generate } from '@pegasus-heavy/nestjs-prisma-graphql/generate';

await generate({
  ...options,
  connectCallback: (emitter, args) => {
    // Log when each model is generated
    emitter.on('BeforeModel', ({ model }) => {
      console.log(\`Generating model: \${model.name}\`);
    });

    // Modify field before generation
    emitter.on('BeforeGenerateField', ({ field, sourceFile }) => {
      if (field.name === 'password') {
        // Custom handling for password fields
      }
    });

    // Track warnings
    emitter.on('Warning', (message) => {
      console.warn(\`Generator warning: \${message}\`);
    });
  },
});`;

  typeCategories = [
    { name: 'model', description: 'Main model class with ObjectType decorator', example: 'User, Post' },
    { name: 'input', description: 'Input types for mutations', example: 'UserCreateInput, PostUpdateInput' },
    { name: 'args', description: 'Arguments for queries/mutations', example: 'FindManyUserArgs' },
    { name: 'output', description: 'Output types for aggregations', example: 'AggregateUser, UserCountOutput' },
    { name: 'enum', description: 'Prisma enums as GraphQL enums', example: 'Role, Status' },
  ];

  configTypes = `interface GeneratorConfiguration {
  // Output settings
  output: string;
  outputFilePattern: string;
  
  // ESM support
  esmCompatible: boolean;
  
  // Code generation
  combineScalarFilters: boolean;
  noAtomicOperations: boolean;
  reExport: 'None' | 'Directories' | 'Single' | 'All';
  emitSingle: boolean;
  emitCompiled: boolean;
  purgeOutput: boolean;
  
  // Type customization
  noTypeId: boolean;
  omitModelsCount: boolean;
  
  // Field namespaces (Validator, Scalars, etc.)
  fields: Record<string, FieldNamespaceConfig>;
  
  // Custom decorators
  decorate: DecorateConfig[];
}

interface FieldNamespaceConfig {
  from: string;      // Import path
  input?: boolean;   // Apply to input types
  output?: boolean;  // Apply to output types  
  model?: boolean;   // Apply to model types
}`;

  eventArgsType = `interface EventArguments {
  // Schema data
  schema: Schema;
  models: Map<string, Model>;
  modelNames: string[];
  modelFields: Map<string, Map<string, Field>>;
  enums: Record<string, DatamodelEnum | undefined>;
  
  // Configuration
  config: GeneratorConfiguration;
  
  // Code generation
  project: Project;          // ts-morph Project
  output: string;            // Output directory
  
  // Utilities
  getSourceFile(args: { type: string; name: string }): SourceFile;
  getModelName(name: string): string | undefined;
  eventEmitter: EventEmitter;
  
  // Type tracking
  typeNames: Set<string>;
  removeTypes: Set<string>;
  classTransformerTypeModels: Set<string>;
  circularDependencies: Set<string>;
}`;

  getModelNameExample = `import { createGetModelName } from './helpers/get-model-name.js';

const getModelName = createGetModelName(['User', 'Post', 'Comment']);

getModelName('UserCreateInput');     // 'User'
getModelName('FindManyPostArgs');    // 'Post'
getModelName('CommentOrderByInput'); // 'Comment'
getModelName('Unknown');             // undefined`;

  pascalCaseExample = `import { pascalCase } from './helpers/pascal-case.js';

pascalCase('hello_world');  // 'HelloWorld'
pascalCase('user-profile'); // 'UserProfile'
pascalCase('API_KEY');      // 'ApiKey'`;

  propertyTypeExample = `import { getPropertyType } from './helpers/get-property-type.js';

// For a String field
getPropertyType({ type: 'String', isList: false, isRequired: true });
// Returns: 'string'

// For an optional Int array
getPropertyType({ type: 'Int', isList: true, isRequired: false });
// Returns: 'number[] | null'

// For a relation
getPropertyType({ type: 'User', isList: false, isRequired: true, kind: 'object' });
// Returns: 'User'`;

  dmmfTypes = `import type { DMMF } from '@prisma/generator-helper';

// Core DMMF types used by the generator
type Document = DMMF.Document;
type Model = DMMF.Model;
type Field = DMMF.Field;
type Schema = DMMF.Schema;
type InputType = DMMF.InputType;
type OutputType = DMMF.OutputType;
type SchemaEnum = DMMF.SchemaEnum;
type SchemaArg = DMMF.SchemaArg;
type SchemaField = DMMF.SchemaField;

// Field location types
type FieldLocation = 
  | 'scalar' 
  | 'inputObjectTypes' 
  | 'outputObjectTypes' 
  | 'enumTypes';`;
}
