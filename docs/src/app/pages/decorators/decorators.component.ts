import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';

@Component({
  selector: 'app-decorators',
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
            <span class="text-white">Decorators</span>
          </nav>
          <h1 class="text-4xl font-bold text-white mb-4">Field Decorators</h1>
          <p class="text-lg text-steel-300">
            Customize generated types using triple-slash comments in your Prisma schema.
          </p>
        </div>

        <!-- Overview -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">How It Works</h2>
          <p class="text-steel-300 mb-4">
            Add triple-slash (<code>///</code>) comments above your Prisma fields to customize
            the generated GraphQL types. These comments are processed during generation.
          </p>
          <app-code-block [code]="overviewExample" language="graphql" filename="schema.prisma" />
        </section>

        <!-- HideField -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <code class="text-pegasus-400">&#64;HideField()</code>
          </h2>
          <p class="text-steel-300 mb-4">
            Hide a field from the GraphQL schema. The field will still exist in the Prisma model
            but won't be exposed in your API.
          </p>
          <app-code-block [code]="hideFieldExample" language="graphql" />

          <div class="mt-4 p-4 rounded-lg bg-forge-500/10 border border-forge-500/20">
            <p class="text-sm text-forge-300">
              <strong>Use cases:</strong> Sensitive data like passwords, internal fields,
              computed fields that shouldn't be queried directly.
            </p>
          </div>

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Options</h3>
          <app-code-block [code]="hideFieldOptions" language="graphql" />
        </section>

        <!-- FieldType -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <code class="text-pegasus-400">&#64;FieldType()</code>
          </h2>
          <p class="text-steel-300 mb-4">
            Override the GraphQL type for a field. Useful for custom scalars or when you want
            a different representation in your API.
          </p>
          <app-code-block [code]="fieldTypeExample" language="graphql" />

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Using Custom Scalars</h3>
          <app-code-block [code]="fieldTypeScalars" language="graphql" />
        </section>

        <!-- PropertyType -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <code class="text-pegasus-400">&#64;PropertyType()</code>
          </h2>
          <p class="text-steel-300 mb-4">
            Override the TypeScript property type. This affects the generated class property
            type, not the GraphQL schema.
          </p>
          <app-code-block [code]="propertyTypeExample" language="graphql" />
        </section>

        <!-- Directive -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <code class="text-pegasus-400">&#64;Directive()</code>
          </h2>
          <p class="text-steel-300 mb-4">
            Add GraphQL directives to fields. These are passed through to the generated schema.
          </p>
          <app-code-block [code]="directiveExample" language="graphql" />
        </section>

        <!-- Validators -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <code class="text-pegasus-400">&#64;Validator.*()</code>
          </h2>
          <p class="text-steel-300 mb-4">
            Add class-validator decorators to input fields. Requires configuring the Validator
            namespace in your generator config.
          </p>
          <app-code-block [code]="validatorExample" language="graphql" />

          <div class="mt-4">
            <a routerLink="/validators" class="inline-flex items-center gap-2 text-pegasus-400 hover:text-pegasus-300 font-medium transition-colors">
              See full validator documentation
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </section>

        <!-- Documentation Comments -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-4">Documentation Comments</h2>
          <p class="text-steel-300 mb-4">
            Any triple-slash comment that doesn't start with <code>&#64;</code> is treated as
            documentation and will be added as a GraphQL description.
          </p>
          <app-code-block [code]="docCommentExample" language="graphql" />

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Generated Output</h3>
          <app-code-block [code]="docCommentOutput" language="typescript" />
        </section>

        <!-- Multiple Decorators -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-4">Combining Decorators</h2>
          <p class="text-steel-300 mb-4">
            You can combine multiple decorators on a single field. Each decorator should be on its own line.
          </p>
          <app-code-block [code]="multipleExample" language="graphql" />
        </section>

        <!-- Input vs Output -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-4">Input vs Output Targeting</h2>
          <p class="text-steel-300 mb-4">
            Some decorators can target specific type categories:
          </p>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="py-3 px-4 text-steel-300 font-medium">Option</th>
                  <th class="py-3 px-4 text-steel-300 font-medium">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr class="hover:bg-white/[0.02]">
                  <td class="py-3 px-4"><code class="text-pegasus-400">input: true</code></td>
                  <td class="py-3 px-4 text-steel-300">Apply to input types (CreateInput, UpdateInput, etc.)</td>
                </tr>
                <tr class="hover:bg-white/[0.02]">
                  <td class="py-3 px-4"><code class="text-pegasus-400">output: true</code></td>
                  <td class="py-3 px-4 text-steel-300">Apply to output types (Model, Output)</td>
                </tr>
                <tr class="hover:bg-white/[0.02]">
                  <td class="py-3 px-4"><code class="text-pegasus-400">model: true</code></td>
                  <td class="py-3 px-4 text-steel-300">Apply to the main model class</td>
                </tr>
              </tbody>
            </table>
          </div>

          <app-code-block [code]="targetingExample" language="graphql" />
        </section>
      </div>
    </div>
  `,
})
export class DecoratorsComponent {
  overviewExample = `model User {
  id       String  @id @default(cuid())

  /// User's email address - used for login
  /// @FieldType('Scalars.GraphQLEmailAddress')
  email    String  @unique

  /// @HideField()
  password String
}`;

  hideFieldExample = `model User {
  id       String @id @default(cuid())
  email    String @unique

  /// @HideField()
  password String   // Won't appear in GraphQL schema

  /// @HideField({ output: true, input: false })
  secret   String?  // Hidden from output, visible in input
}`;

  hideFieldOptions = `/// @HideField()                          // Hide from all types
/// @HideField({ output: true })          // Hide from output types only
/// @HideField({ input: true })           // Hide from input types only
/// @HideField({ match: 'Create*' })      // Hide from types matching pattern
/// @HideField({ match: '@(Create|Update)*' }) // Multiple patterns`;

  fieldTypeExample = `model Product {
  id    String @id @default(cuid())

  /// @FieldType('Int')
  price Decimal  // Use Int instead of default Decimal scalar

  /// @FieldType('GraphQLJSON')
  meta  Json     // Use custom JSON scalar
}`;

  fieldTypeScalars = `/// First, configure the namespace in generator:
/// fields_Scalars_from = "graphql-scalars"
/// fields_Scalars_output = true

model User {
  /// @FieldType('Scalars.GraphQLEmailAddress')
  email String

  /// @FieldType('Scalars.GraphQLURL')
  website String?

  /// @FieldType('Scalars.GraphQLPhoneNumber')
  phone String?
}`;

  propertyTypeExample = `model Settings {
  id   String @id @default(cuid())

  /// @PropertyType('Record<string, unknown>')
  data Json   // TypeScript type is Record, GraphQL type is Json
}`;

  directiveExample = `model Post {
  id      String  @id @default(cuid())

  /// @Directive('@deprecated(reason: "Use body instead")')
  content String?

  body    String?
}`;

  validatorExample = `/// Enable in generator config first:
/// fields_Validator_from = "class-validator"
/// fields_Validator_input = true

model User {
  /// @Validator.IsEmail()
  /// @Validator.IsNotEmpty()
  email String

  /// @Validator.MinLength(2)
  /// @Validator.MaxLength(100)
  name String
}`;

  docCommentExample = `model User {
  id String @id @default(cuid())

  /// The user's unique email address.
  /// This is used for authentication and notifications.
  email String @unique

  /// Display name shown in the UI
  name String?
}`;

  docCommentOutput = `@ObjectType({ description: undefined })
export class User {
  @Field(() => ID)
  id!: string;

  @Field(() => String, {
    description: 'The user\\'s unique email address. This is used for authentication and notifications.'
  })
  email!: string;

  @Field(() => String, {
    nullable: true,
    description: 'Display name shown in the UI'
  })
  name?: string | null;
}`;

  multipleExample = `model User {
  id String @id @default(cuid())

  /// User's primary email for communication
  /// @FieldType('Scalars.GraphQLEmailAddress')
  /// @Validator.IsEmail()
  /// @Validator.IsNotEmpty()
  /// @Validator.MaxLength(255)
  email String @unique
}`;

  targetingExample = `/// In generator config:
/// fields_Validator_input = true     // Only on inputs
/// fields_Scalars_output = true      // Only on outputs

model User {
  /// @Validator.IsEmail()
  /// Validators only applied to input types (CreateUserInput, UpdateUserInput)
  email String

  /// @FieldType('Scalars.GraphQLDateTime')
  /// Scalar type only applied to output types (User model)
  createdAt DateTime @default(now())
}`;
}
