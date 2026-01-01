import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';

@Component({
  selector: 'app-validators',
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
            <span class="text-white">Validators</span>
          </nav>
          <h1 class="text-4xl font-bold text-white mb-4">Class-Validator Support</h1>
          <p class="text-lg text-steel-300">
            Add runtime validation to your GraphQL inputs using class-validator decorators.
          </p>
        </div>

        <!-- Setup -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Setup</h2>

          <h3 class="text-lg font-semibold text-white mb-3">1. Install class-validator</h3>
          <app-code-block [code]="'pnpm add class-validator class-transformer'" language="bash" />

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">2. Configure Generator</h3>
          <app-code-block [code]="generatorConfig" language="graphql" filename="schema.prisma" />

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">3. Enable Validation in NestJS</h3>
          <app-code-block [code]="nestConfig" language="typescript" filename="main.ts" />
        </section>

        <!-- Basic Usage -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Basic Usage</h2>
          <p class="text-steel-300 mb-4">
            Add <code>&#64;Validator.*</code> decorators in your Prisma schema comments:
          </p>
          <app-code-block [code]="basicUsage" language="graphql" filename="schema.prisma" />
        </section>

        <!-- Common Validators -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Common Validators</h2>

          <h3 class="text-lg font-semibold text-white mb-4">String Validators</h3>
          <div class="overflow-x-auto mb-6">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="py-3 px-4 text-steel-300 font-medium">Decorator</th>
                  <th class="py-3 px-4 text-steel-300 font-medium">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                @for (v of stringValidators; track v.name) {
                  <tr class="hover:bg-white/[0.02]">
                    <td class="py-3 px-4"><code class="text-pegasus-400">{{ v.name }}</code></td>
                    <td class="py-3 px-4 text-steel-300">{{ v.description }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <h3 class="text-lg font-semibold text-white mb-4">Number Validators</h3>
          <div class="overflow-x-auto mb-6">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="py-3 px-4 text-steel-300 font-medium">Decorator</th>
                  <th class="py-3 px-4 text-steel-300 font-medium">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                @for (v of numberValidators; track v.name) {
                  <tr class="hover:bg-white/[0.02]">
                    <td class="py-3 px-4"><code class="text-pegasus-400">{{ v.name }}</code></td>
                    <td class="py-3 px-4 text-steel-300">{{ v.description }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <h3 class="text-lg font-semibold text-white mb-4">Type Validators</h3>
          <div class="overflow-x-auto mb-6">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="py-3 px-4 text-steel-300 font-medium">Decorator</th>
                  <th class="py-3 px-4 text-steel-300 font-medium">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                @for (v of typeValidators; track v.name) {
                  <tr class="hover:bg-white/[0.02]">
                    <td class="py-3 px-4"><code class="text-pegasus-400">{{ v.name }}</code></td>
                    <td class="py-3 px-4 text-steel-300">{{ v.description }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <h3 class="text-lg font-semibold text-white mb-4">Array Validators</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="py-3 px-4 text-steel-300 font-medium">Decorator</th>
                  <th class="py-3 px-4 text-steel-300 font-medium">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                @for (v of arrayValidators; track v.name) {
                  <tr class="hover:bg-white/[0.02]">
                    <td class="py-3 px-4"><code class="text-pegasus-400">{{ v.name }}</code></td>
                    <td class="py-3 px-4 text-steel-300">{{ v.description }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>

        <!-- Advanced Examples -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Advanced Examples</h2>

          <h3 class="text-lg font-semibold text-white mb-3">Full User Model</h3>
          <app-code-block [code]="fullExample" language="graphql" filename="schema.prisma" />

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Generated Output</h3>
          <app-code-block [code]="generatedOutput" language="typescript" filename="user-create.input.ts" />
        </section>

        <!-- Nested Validation -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Nested Object Validation</h2>
          <p class="text-steel-300 mb-4">
            For validating nested objects (relations), use the <code>decorate_*</code> config to add
            <code>&#64;ValidateNested()</code> and <code>&#64;Type()</code> decorators:
          </p>
          <app-code-block [code]="nestedValidation" language="graphql" filename="schema.prisma" />
        </section>

        <!-- Custom Error Messages -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Custom Error Messages</h2>
          <p class="text-steel-300 mb-4">
            Pass custom error messages using the message option:
          </p>
          <app-code-block [code]="customMessages" language="graphql" />
        </section>

        <!-- Conditional Validation -->
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Conditional & Groups</h2>
          <p class="text-steel-300 mb-4">
            Use <code>&#64;Validator.IsOptional()</code> for nullable fields and validation groups
            for conditional validation:
          </p>
          <app-code-block [code]="conditionalExample" language="graphql" />
        </section>
      </div>
    </div>
  `,
})
export class ValidatorsComponent {
  generatorConfig = `generator nestgraphql {
  provider               = "nestjs-prisma-graphql"
  output                 = "../src/@generated"

  // Enable class-validator
  fields_Validator_from  = "class-validator"
  fields_Validator_input = true    // Apply to input types
}`;

  nestConfig = `import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  await app.listen(3000);
}

bootstrap();`;

  basicUsage = `model User {
  id    String  @id @default(cuid())

  /// @Validator.IsEmail()
  email String  @unique

  /// @Validator.MinLength(2)
  /// @Validator.MaxLength(50)
  name  String

  /// @Validator.IsOptional()
  /// @Validator.IsUrl()
  website String?
}`;

  stringValidators = [
    { name: '@Validator.IsString()', description: 'Check if value is a string' },
    { name: '@Validator.IsNotEmpty()', description: 'Check if string is not empty' },
    { name: '@Validator.MinLength(n)', description: 'Check if string length >= n' },
    { name: '@Validator.MaxLength(n)', description: 'Check if string length <= n' },
    { name: '@Validator.Length(min, max)', description: 'Check if string length is within range' },
    { name: '@Validator.IsEmail()', description: 'Check if string is a valid email' },
    { name: '@Validator.IsUrl()', description: 'Check if string is a valid URL' },
    { name: '@Validator.IsUUID()', description: 'Check if string is a valid UUID' },
    { name: '@Validator.Matches(regex)', description: 'Check if string matches regex pattern' },
    { name: '@Validator.IsAlpha()', description: 'Check if string contains only letters' },
    { name: '@Validator.IsAlphanumeric()', description: 'Check if string contains letters and numbers' },
    { name: '@Validator.IsPhoneNumber()', description: 'Check if string is a phone number' },
  ];

  numberValidators = [
    { name: '@Validator.IsNumber()', description: 'Check if value is a number' },
    { name: '@Validator.IsInt()', description: 'Check if value is an integer' },
    { name: '@Validator.Min(n)', description: 'Check if number >= n' },
    { name: '@Validator.Max(n)', description: 'Check if number <= n' },
    { name: '@Validator.IsPositive()', description: 'Check if number > 0' },
    { name: '@Validator.IsNegative()', description: 'Check if number < 0' },
  ];

  typeValidators = [
    { name: '@Validator.IsBoolean()', description: 'Check if value is a boolean' },
    { name: '@Validator.IsDate()', description: 'Check if value is a Date' },
    { name: '@Validator.IsDateString()', description: 'Check if string is a valid date string' },
    { name: '@Validator.IsEnum(entity)', description: 'Check if value is a valid enum value' },
    { name: '@Validator.IsOptional()', description: 'Skip validation if value is null/undefined' },
  ];

  arrayValidators = [
    { name: '@Validator.IsArray()', description: 'Check if value is an array' },
    { name: '@Validator.ArrayNotEmpty()', description: 'Check if array is not empty' },
    { name: '@Validator.ArrayMinSize(n)', description: 'Check if array has at least n items' },
    { name: '@Validator.ArrayMaxSize(n)', description: 'Check if array has at most n items' },
    { name: '@Validator.ArrayUnique()', description: 'Check if all array values are unique' },
  ];

  fullExample = `model User {
  id        String   @id @default(cuid())

  /// @Validator.IsEmail()
  /// @Validator.IsNotEmpty()
  email     String   @unique

  /// @Validator.MinLength(8)
  /// @Validator.MaxLength(128)
  /// @Validator.Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)/)
  password  String

  /// @Validator.MinLength(2)
  /// @Validator.MaxLength(100)
  /// @Validator.IsAlpha()
  firstName String

  /// @Validator.MinLength(2)
  /// @Validator.MaxLength(100)
  lastName  String

  /// @Validator.IsOptional()
  /// @Validator.IsInt()
  /// @Validator.Min(13)
  /// @Validator.Max(120)
  age       Int?

  /// @Validator.IsOptional()
  /// @Validator.IsUrl()
  website   String?

  /// @Validator.IsOptional()
  /// @Validator.IsPhoneNumber()
  phone     String?

  /// @Validator.IsOptional()
  /// @Validator.Matches(/^[a-z0-9_-]{3,30}$/)
  username  String?  @unique
}`;

  generatedOutput = `import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsAlpha,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsUrl,
  IsPhoneNumber,
} from 'class-validator';

@InputType()
export class UserCreateInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Field()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)/)
  password!: string;

  @Field()
  @MinLength(2)
  @MaxLength(100)
  @IsAlpha()
  firstName!: string;

  @Field()
  @MinLength(2)
  @MaxLength(100)
  lastName!: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(13)
  @Max(120)
  age?: number | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  website?: string | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string | null;

  @Field({ nullable: true })
  @IsOptional()
  @Matches(/^[a-z0-9_-]{3,30}$/)
  username?: string | null;
}`;

  nestedValidation = `generator nestgraphql {
  provider = "nestjs-prisma-graphql"
  output   = "../src/@generated"

  fields_Validator_from  = "class-validator"
  fields_Validator_input = true

  // Add @ValidateNested() to profile field on UserCreateInput
  decorate_1_type      = "UserCreateInput"
  decorate_1_field     = "profile"
  decorate_1_name      = "ValidateNested"
  decorate_1_from      = "class-validator"
  decorate_1_arguments = "[]"

  // Add @Type(() => ProfileCreateInput) for class-transformer
  decorate_2_type      = "UserCreateInput"
  decorate_2_field     = "profile"
  decorate_2_name      = "Type"
  decorate_2_from      = "class-transformer"
  decorate_2_arguments = "[() => ProfileCreateNestedOneWithoutUserInput]"
}

model User {
  id      String   @id @default(cuid())
  profile Profile?
}

model Profile {
  id     String  @id @default(cuid())

  /// @Validator.IsOptional()
  /// @Validator.MaxLength(500)
  bio    String?

  user   User    @relation(fields: [userId], references: [id])
  userId String  @unique
}`;

  customMessages = `model User {
  /// @Validator.IsEmail({ message: 'Please provide a valid email address' })
  email String

  /// @Validator.MinLength(8, { message: 'Password must be at least 8 characters' })
  /// @Validator.MaxLength(128, { message: 'Password cannot exceed 128 characters' })
  password String
}`;

  conditionalExample = `model User {
  /// Required field - not optional
  /// @Validator.IsNotEmpty()
  email String

  /// Optional field - validation runs only if value provided
  /// @Validator.IsOptional()
  /// @Validator.MinLength(10)
  bio String?

  /// Validation groups example (for advanced use)
  /// @Validator.IsNotEmpty({ groups: ['create'] })
  /// @Validator.IsOptional({ groups: ['update'] })
  password String
}`;
}
