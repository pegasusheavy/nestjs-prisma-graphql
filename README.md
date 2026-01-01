# @pegasus-heavy/nestjs-prisma-graphql

[![npm version](https://img.shields.io/npm/v/@pegasus-heavy/nestjs-prisma-graphql.svg)](https://www.npmjs.com/package/@pegasus-heavy/nestjs-prisma-graphql)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Node.js Version](https://img.shields.io/node/v/@pegasus-heavy/nestjs-prisma-graphql.svg)](https://nodejs.org)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?logo=prisma)](https://www.prisma.io)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E?logo=nestjs)](https://nestjs.com)

Generate object types, inputs, args, enums, and more from your Prisma schema for seamless integration with `@nestjs/graphql`.

**ESM-first build** — This is an ESM-native fork of [prisma-nestjs-graphql](https://github.com/unlight/prisma-nestjs-graphql), built from the ground up for ESM as the primary module format, with full Prisma 7+ compatibility.

---

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Generator Options](#generator-options)
  - [Core Options](#core-options)
  - [Code Generation Options](#code-generation-options)
  - [Type Customization Options](#type-customization-options)
- [Field Decorators](#field-decorators)
  - [@HideField](#hidefield)
  - [@FieldType](#fieldtype)
  - [@PropertyType](#propertytype)
  - [@ObjectType](#objecttype)
  - [@Directive](#directive)
  - [Deprecation](#deprecation)
  - [Complexity](#complexity)
- [Validation with class-validator](#validation-with-class-validator)
- [Custom Decorators](#custom-decorators)
- [GraphQL Scalars](#graphql-scalars)
  - [Built-in Scalar Mappings](#built-in-scalar-mappings)
  - [Custom Scalar Configuration](#custom-scalar-configuration)
- [ESM Compatibility](#esm-compatibility)
  - [Handling Circular Dependencies](#handling-circular-dependencies)
  - [Type Registry](#type-registry)
- [Integration Examples](#integration-examples)
  - [Express + Apollo (Default)](#express--apollo-default)
  - [Fastify + Mercurius](#fastify--mercurius)
  - [Fastify + Apollo](#fastify--apollo)
  - [Resolver Example](#resolver-example)
  - [Using with Prisma Service](#using-with-prisma-service)
- [Generated File Structure](#generated-file-structure)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- 🚀 **ESM-first** — Built with ESM as the primary module format using `lodash-es` and proper `.js` extensions
- 📦 **Prisma 7+ compatible** — Full support for latest Prisma versions and features
- 🔄 **Circular dependency handling** — Built-in support for ESM circular import resolution with type registry
- 🏗️ **NestJS GraphQL ready** — Generates ready-to-use `@nestjs/graphql` decorators and types
- ⚡ **TypeScript 5.x** — Full support for latest TypeScript features with `NodeNext` module resolution
- ✅ **class-validator integration** — First-class support for validation decorators
- 🎯 **Customizable output** — Flexible file patterns, selective generation, and re-export options
- 🔧 **Extensible** — Custom scalars, decorators, and field type overrides
- 🏎️ **Express & Fastify** — Works with both Express and Fastify NestJS platforms (Apollo & Mercurius)

---

## Requirements

- **Node.js** >= 20.0.0
- **Prisma** >= 7.0.0
- **@nestjs/graphql** >= 12.0.0
- **TypeScript** >= 5.0.0

---

## Installation

```bash
# Using pnpm (recommended)
pnpm add -D @pegasus-heavy/nestjs-prisma-graphql

# Using npm
npm install -D @pegasus-heavy/nestjs-prisma-graphql

# Using yarn
yarn add -D @pegasus-heavy/nestjs-prisma-graphql
```

### Peer Dependencies

Ensure you have the required peer dependencies installed:

```bash
pnpm add @nestjs/graphql prisma @prisma/client graphql
```

### Optional Dependencies

For `Decimal` and `Json` field types:

```bash
pnpm add graphql-type-json prisma-graphql-type-decimal
```

For validation support:

```bash
pnpm add class-validator class-transformer
```

---

## Quick Start

### 1. Add the Generator to Your Schema

```prisma
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

generator nestgraphql {
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
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. Generate Types

```bash
npx prisma generate
```

### 3. Use Generated Types

```typescript
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User } from './@generated/user/user.model';
import { FindManyUserArgs } from './@generated/user/find-many-user.args';
import { UserCreateInput } from './@generated/user/user-create.input';

@Resolver(() => User)
export class UserResolver {
  @Query(() => [User])
  async users(@Args() args: FindManyUserArgs): Promise<User[]> {
    // Your implementation
  }

  @Mutation(() => User)
  async createUser(@Args('data') data: UserCreateInput): Promise<User> {
    // Your implementation
  }
}
```

---

## Generator Options

### Core Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `output` | `string` | *required* | Output folder relative to the schema file |
| `outputFilePattern` | `string` | `{model}/{name}.{type}.ts` | Pattern for generated file paths |
| `esmCompatible` | `boolean` | `true` | Enable ESM circular import resolution |
| `prismaClientImport` | `string` | `@prisma/client` | Custom path to Prisma Client |
| `tsConfigFilePath` | `string` | - | Path to tsconfig.json for type checking |
| `disabled` | `boolean` | `false` | Disable generation (can also use env vars) |

### Disabling the Generator

You can disable the generator using environment variables or the `disabled` config option. This is useful for CI environments, build optimization, or conditional generation.

#### Environment Variables

```bash
# Disable this specific generator (most specific)
DISABLE_NESTJS_PRISMA_GRAPHQL=true npx prisma generate

# CI-specific skip flag
CI_SKIP_PRISMA_GRAPHQL=true npx prisma generate

# Skip all Prisma generators (common convention)
PRISMA_GENERATOR_SKIP=true npx prisma generate

# Alternative skip flag
SKIP_PRISMA_GENERATE=true npx prisma generate
```

All environment variables accept `true` or `1` as valid values to disable the generator.

#### Config Option

```prisma
generator nestgraphql {
  provider = "nestjs-prisma-graphql"
  output   = "../src/@generated"
  disabled = true  // Skip generation (accepts: true, "true", "1", "yes")
}
```

#### Priority Order

1. **Environment variables** are checked first (in order of specificity)
2. **Config option** is checked if no environment variable disables the generator

#### CI/CD Examples

```yaml
# GitHub Actions - skip generation in certain jobs
- name: Generate Prisma Client Only
  run: npx prisma generate
  env:
    DISABLE_NESTJS_PRISMA_GRAPHQL: true

# Docker build - skip during build, generate at runtime
ARG SKIP_CODEGEN=false
ENV CI_SKIP_PRISMA_GRAPHQL=$SKIP_CODEGEN
```

When disabled, the generator will output:
```
⏭️  nestjs-prisma-graphql: Generation skipped (disabled via environment variable or config)
```

#### Output File Pattern Variables

| Variable | Description |
|----------|-------------|
| `{model}` | Model name in different cases |
| `{name}` | Type/class name |
| `{type}` | File type (model, input, args, enum, output) |
| `{plural.type}` | Pluralized file type |

**Examples:**

```prisma
# Default: src/@generated/user/user-create.input.ts
outputFilePattern = "{model}/{name}.{type}.ts"

# Flat structure: src/@generated/user-create.input.ts
outputFilePattern = "{name}.{type}.ts"

# By type: src/@generated/inputs/user-create.input.ts
outputFilePattern = "{plural.type}/{name}.{type}.ts"
```

### Code Generation Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `combineScalarFilters` | `boolean` | `false` | Combine nested/nullable scalar filters into single types |
| `noAtomicOperations` | `boolean` | `false` | Remove atomic operation input types (IntFieldUpdateOperationsInput, etc.) |
| `reExport` | `enum` | `None` | Create index.ts barrel files |
| `emitSingle` | `boolean` | `false` | Generate all types in a single file |
| `emitCompiled` | `boolean` | `false` | Emit compiled JavaScript alongside TypeScript |
| `purgeOutput` | `boolean` | `false` | Delete output folder before generating |
| `emitBlocks` | `string[]` | all | Selective generation: `enums`, `models`, `inputs`, `outputs`, `args` |
| `requireSingleFieldsInWhereUniqueInput` | `boolean` | `false` | Make unique fields required in WhereUniqueInput |

#### reExport Options

| Value | Description |
|-------|-------------|
| `None` | No barrel files |
| `Directories` | Create index.ts in each directory |
| `Single` | Create single index.ts at output root |
| `All` | Create index.ts in all directories and root |

### Type Customization Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `noTypeId` | `boolean` | `false` | Use `String` instead of `ID` for @id fields |
| `omitModelsCount` | `boolean` | `false` | Omit `_count` field from model types |
| `useInputType` | `string` | - | Pattern for selecting input types |

---

## Field Decorators

Use triple-slash comments (`///`) in your Prisma schema to add decorators and customize generated code.

### @HideField

Hide fields from the GraphQL schema. Useful for sensitive data like passwords.

```prisma
model User {
  id       String @id @default(cuid())
  email    String @unique

  /// @HideField()
  password String

  /// @HideField({ input: true, output: false })
  internalId String?

  /// @HideField({ match: '*Password*' })
  tempPassword String?
}
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `input` | `boolean` | Hide from input types |
| `output` | `boolean` | Hide from output types (default: `true`) |
| `match` | `string \| string[]` | Glob pattern(s) for field name matching |

### @FieldType

Override the GraphQL field type.

```prisma
model User {
  /// @FieldType('Scalars.GraphQLEmailAddress')
  email String @unique

  /// @FieldType({ name: 'GraphQLURL', from: 'graphql-scalars', input: true })
  website String?

  /// @FieldType({ name: 'CustomType', match: 'input' })
  data Json?
}
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `name` | `string` | Type name (required) |
| `from` | `string` | Import module specifier |
| `input` | `boolean` | Apply to input types |
| `output` | `boolean` | Apply to output types |
| `match` | `string` | Glob pattern for type name matching |

### @PropertyType

Override the TypeScript property type.

```prisma
model User {
  /// @PropertyType('Buffer')
  avatar Bytes?

  /// @PropertyType({ name: 'MyCustomClass', from: './custom-class' })
  metadata Json?
}
```

### @ObjectType

Customize the generated `@ObjectType()` decorator.

```prisma
/// @ObjectType({ isAbstract: true })
model BaseEntity {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

/// @ObjectType('UserProfile')
model User {
  id   String @id
  name String
}
```

### @Directive

Add custom GraphQL directives.

```prisma
model User {
  /// @Directive('@auth(requires: ADMIN)')
  adminField String?

  /// @Directive('@deprecated(reason: "Use newField instead")')
  oldField String?
}
```

### Deprecation

Mark fields as deprecated.

```prisma
model User {
  /// @deprecated Use 'email' instead
  username String?

  email String @unique
}
```

### Complexity

Set field complexity for query cost analysis.

```prisma
model User {
  id    String @id

  /// @complexity 5
  posts Post[]

  /// @complexity 10
  followers User[]
}
```

---

## Validation with class-validator

First-class support for `class-validator` decorators on generated input types.

### Configuration

Add the validator configuration to your generator:

```prisma
generator nestgraphql {
  provider                 = "nestjs-prisma-graphql"
  output                   = "../src/@generated"
  fields_Validator_from    = "class-validator"
  fields_Validator_input   = true
}
```

### Usage in Schema

```prisma
model User {
  id    String @id @default(cuid())

  /// @Validator.IsEmail()
  /// @Validator.MaxLength(255)
  email String @unique

  /// @Validator.MinLength(2)
  /// @Validator.MaxLength(100)
  name String

  /// @Validator.IsOptional()
  /// @Validator.IsUrl()
  website String?

  /// @Validator.Min(0)
  /// @Validator.Max(150)
  age Int?

  /// @Validator.IsPhoneNumber('US')
  phone String?

  /// @Validator.Matches(/^[a-zA-Z0-9_]+$/)
  username String @unique
}
```

### Generated Output

```typescript
import { IsEmail, MaxLength, MinLength, IsOptional, IsUrl } from 'class-validator';

@InputType()
export class UserCreateInput {
  @IsEmail()
  @MaxLength(255)
  @Field(() => String)
  email!: string;

  @MinLength(2)
  @MaxLength(100)
  @Field(() => String)
  name!: string;

  @IsOptional()
  @IsUrl()
  @Field(() => String, { nullable: true })
  website?: string;
}
```

### Available Validators

All `class-validator` decorators are supported:

**String Validators:**
- `@Validator.IsEmail()`
- `@Validator.IsUrl()`
- `@Validator.IsUUID()`
- `@Validator.MinLength(n)`
- `@Validator.MaxLength(n)`
- `@Validator.Matches(regex)`
- `@Validator.IsAlpha()`
- `@Validator.IsAlphanumeric()`

**Number Validators:**
- `@Validator.Min(n)`
- `@Validator.Max(n)`
- `@Validator.IsPositive()`
- `@Validator.IsNegative()`
- `@Validator.IsInt()`

**Type Validators:**
- `@Validator.IsBoolean()`
- `@Validator.IsDate()`
- `@Validator.IsArray()`
- `@Validator.IsObject()`

**General:**
- `@Validator.IsOptional()`
- `@Validator.IsNotEmpty()`
- `@Validator.IsDefined()`
- `@Validator.ValidateNested()`

---

## Custom Decorators

Define custom decorator namespaces for your own decorators or third-party libraries.

### Configuration

```prisma
generator nestgraphql {
  provider                    = "nestjs-prisma-graphql"
  output                      = "../src/@generated"

  # class-transformer decorators
  fields_Transform_from       = "class-transformer"
  fields_Transform_input      = true

  # Custom decorators
  fields_Custom_from          = "./decorators"
  fields_Custom_input         = true
  fields_Custom_output        = true
}
```

### Usage

```prisma
model User {
  /// @Transform.Type(() => Date)
  /// @Transform.Transform(({ value }) => new Date(value))
  birthDate DateTime?

  /// @Custom.Sanitize()
  bio String?
}
```

---

## GraphQL Scalars

### Built-in Scalar Mappings

| Prisma Type | GraphQL Type | TypeScript Type |
|-------------|--------------|-----------------|
| `String` | `String` | `string` |
| `Int` | `Int` | `number` |
| `Float` | `Float` | `number` |
| `Boolean` | `Boolean` | `boolean` |
| `DateTime` | `Date` | `Date \| string` |
| `Json` | `GraphQLJSON` | `any` |
| `Decimal` | `GraphQLDecimal` | `Decimal` |
| `BigInt` | `BigInt` | `bigint \| number` |
| `Bytes` | `String` | `Uint8Array` |
| `@id` fields | `ID` | `string` |

### Custom Scalar Configuration

Override default scalar mappings:

```prisma
generator nestgraphql {
  provider = "nestjs-prisma-graphql"
  output   = "../src/@generated"

  # Custom DateTime scalar
  graphqlScalars_DateTime_name      = "GraphQLISODateTime"
  graphqlScalars_DateTime_specifier = "@nestjs/graphql"

  # Custom JSON scalar
  graphqlScalars_Json_name      = "GraphQLJSONObject"
  graphqlScalars_Json_specifier = "graphql-type-json"

  # Custom BigInt scalar
  graphqlScalars_BigInt_name      = "GraphQLBigInt"
  graphqlScalars_BigInt_specifier = "graphql-scalars"
}
```

### Using graphql-scalars

```prisma
generator nestgraphql {
  provider = "nestjs-prisma-graphql"
  output   = "../src/@generated"

  graphqlScalars_DateTime_name      = "GraphQLDateTime"
  graphqlScalars_DateTime_specifier = "graphql-scalars"
}
```

---

## ESM Compatibility

This generator is built from the ground up for ESM (ECMAScript Modules).

### Key ESM Features

- Uses `lodash-es` instead of `lodash`
- All imports include `.js` extensions
- `"type": "module"` in package.json
- `NodeNext` module resolution
- Proper `import type` for type-only imports

### ESM vs CommonJS: The Circular Dependency Problem

In CommonJS, circular dependencies "just work" because modules receive a partial export object that gets filled in as the module executes. In ESM, imports are "live bindings" that reference the actual exported value—which may be `undefined` if the module hasn't finished initializing.

**CommonJS behavior:**
```javascript
// user.js imports post.js, post.js imports user.js
// CJS: Both get a partial object that fills in later ✅
```

**ESM behavior:**
```javascript
// user.js imports post.js, post.js imports user.js
// ESM: One of them gets undefined during initialization ❌
```

This causes bundling errors where CJS would produce valid bundles but ESM complains about broken dependency cycles.

### The Solution: esmCompatible Mode

Enable `esmCompatible` mode to generate code that handles circular dependencies:

```prisma
generator nestgraphql {
  provider      = "nestjs-prisma-graphql"
  output        = "../src/@generated"
  esmCompatible = true
}
```

### Type Registry

When `esmCompatible` is enabled, the generator creates:

1. **`type-registry.ts`** — Central registry with lazy type resolution helpers
2. **`register-all-types.ts`** — Registers all types at application startup

#### Available Functions

| Function | Description |
|----------|-------------|
| `registerType(name, type)` | Register a type with the registry |
| `getType<T>(name)` | Get a registered type (for `@Field` decorators) |
| `forwardRef<T>(name)` | Create a forward reference with error handling |
| `lazyType<T>(name)` | Create a lazy type thunk (safest pattern) |
| `isTypeRegistered(name)` | Check if a type is registered |
| `validateRegistry(types)` | Validate expected types are registered |

#### Setup

Import the registry **first** in your application bootstrap:

```typescript
// main.ts - register-all-types MUST be the first import!
import './@generated/register-all-types.js';

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
```

#### How It Works

For circular references, the generator uses lazy type resolution:

```typescript
// Instead of direct import (causes circular dependency)
import { Post } from '../post/post.model.js';

// Uses lazy resolution via type registry
import { getType } from '../type-registry.js';
import type { Post } from '../post/post.model.js'; // Type-only import is safe

@ObjectType()
export class User {
  @Field(() => getType('Post'), { nullable: true })
  posts?: Post[];
}

// Register this type
registerType('User', User);
```

### Bundler Compatibility

The ESM-compatible output works with:

| Bundler | Status | Notes |
|---------|--------|-------|
| **esbuild** | ✅ | Native ESM support |
| **Vite** | ✅ | Uses esbuild under the hood |
| **Rollup** | ✅ | With proper config |
| **webpack** | ✅ | ESM output mode |
| **tsx/ts-node** | ✅ | With ESM loader |
| **Node.js** | ✅ | v20+ with `"type": "module"` |

### Debugging Circular Dependencies

If you see errors like "Cannot access 'X' before initialization":

1. **Check import order**: Ensure `register-all-types.js` is imported first
2. **Verify registration**: Use `getRegisteredTypes()` to see what's registered
3. **Validate types**: Use `validateRegistry(['User', 'Post'])` to check expected types

```typescript
import { getRegisteredTypes, validateRegistry } from './@generated/type-registry.js';

// Debug: see what's registered
console.log('Registered types:', getRegisteredTypes());

// Validate expected types exist
validateRegistry(['User', 'Post', 'Comment']);
```

---

## Integration Examples

This library works with both **Express** (default) and **Fastify** NestJS applications.

### Express + Apollo (Default)

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    // Your feature modules
    UserModule,
    PostModule,
  ],
})
export class AppModule {}
```

```typescript
// main.ts (Express)
import 'reflect-metadata';
import './@generated/register-all-types.js';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(3000);
}
bootstrap();
```

### Fastify + Mercurius

For better performance, you can use Fastify with Mercurius as the GraphQL adapter:

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      graphiql: true,
    }),
    // Your feature modules
    UserModule,
    PostModule,
  ],
})
export class AppModule {}
```

```typescript
// main.ts (Fastify)
import 'reflect-metadata';
import './@generated/register-all-types.js';

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
```

### Fastify + Apollo

You can also use Apollo Server with Fastify:

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    UserModule,
    PostModule,
  ],
})
export class AppModule {}
```

```typescript
// main.ts (Fastify + Apollo)
import 'reflect-metadata';
import './@generated/register-all-types.js';

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
```

### Resolver Example

```typescript
// user.resolver.ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { User } from './@generated/user/user.model.js';
import { FindManyUserArgs } from './@generated/user/find-many-user.args.js';
import { FindUniqueUserArgs } from './@generated/user/find-unique-user.args.js';
import { UserCreateInput } from './@generated/user/user-create.input.js';
import { UserUpdateInput } from './@generated/user/user-update.input.js';
import { UserWhereUniqueInput } from './@generated/user/user-where-unique.input.js';
import { PrismaService } from './prisma.service.js';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => [User], { name: 'users' })
  async findMany(@Args() args: FindManyUserArgs): Promise<User[]> {
    return this.prisma.user.findMany(args);
  }

  @Query(() => User, { name: 'user', nullable: true })
  async findUnique(@Args() args: FindUniqueUserArgs): Promise<User | null> {
    return this.prisma.user.findUnique(args);
  }

  @Mutation(() => User)
  async createUser(@Args('data') data: UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  @Mutation(() => User)
  async updateUser(
    @Args('where') where: UserWhereUniqueInput,
    @Args('data') data: UserUpdateInput,
  ): Promise<User> {
    return this.prisma.user.update({ where, data });
  }

  @Mutation(() => User)
  async deleteUser(@Args('where') where: UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({ where });
  }
}
```

### Using with Prisma Service

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
```

### With Validation Pipe

```typescript
// main.ts
import 'reflect-metadata';
import './@generated/register-all-types.js';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable class-validator validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3000);
}

bootstrap();
```

---

## Generated File Structure

With default settings, the generator creates:

```
src/@generated/
├── prisma/
│   ├── sort-order.enum.ts
│   ├── query-mode.enum.ts
│   └── ...scalar-filters
├── user/
│   ├── user.model.ts
│   ├── user-create.input.ts
│   ├── user-update.input.ts
│   ├── user-where.input.ts
│   ├── user-where-unique.input.ts
│   ├── user-order-by.input.ts
│   ├── find-many-user.args.ts
│   ├── find-unique-user.args.ts
│   ├── create-one-user.args.ts
│   ├── update-one-user.args.ts
│   ├── delete-one-user.args.ts
│   └── ...
├── post/
│   └── ...
├── type-registry.ts          # ESM type registry
├── register-all-types.ts     # Type registration
└── index.ts                  # Barrel export (if reExport enabled)
```

---

## Troubleshooting

### Common Issues

#### "Cannot find module" errors in ESM

Ensure all imports in your code include `.js` extensions:

```typescript
// ❌ Wrong
import { User } from './@generated/user/user.model';

// ✅ Correct
import { User } from './@generated/user/user.model.js';
```

#### Circular dependency warnings

Enable `esmCompatible` mode and import the type registry:

```typescript
// main.ts - import early
import './@generated/register-all-types.js';
```

#### Type mismatch with Prisma Client

Ensure your generator output is excluded from tsconfig's `include`:

```json
{
  "compilerOptions": { ... },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "src/@generated"]
}
```

#### Decimal type not found

Install the required package:

```bash
pnpm add prisma-graphql-type-decimal decimal.js
```

#### JSON type not found

Install the required package:

```bash
pnpm add graphql-type-json
```

### Debugging

Enable verbose logging by setting the `DEBUG` environment variable:

```bash
DEBUG=prisma:generator npx prisma generate
```

---

## Development

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 10.0.0

### Setup

```bash
# Clone the repository
git clone https://github.com/pegasusheavy/nestjs-prisma-graphql.git
cd nestjs-prisma-graphql

# Install dependencies
pnpm install

# Build
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:cov

# Type check
pnpm typecheck

# Lint
pnpm lint

# Format
pnpm format
```

### Project Structure

```
src/
├── handlers/          # Event handlers for code generation
├── helpers/           # Utility functions
├── generate.ts        # Main generation logic
├── index.ts           # Entry point
├── types.ts           # Type definitions
└── event-names.ts     # Event constants
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test:cov
```

---

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, semicolons, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## License

Copyright 2026 Pegasus Heavy Industries LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

See the [LICENSE](LICENSE) file for full details.

---

## Acknowledgments

This project is a fork of [prisma-nestjs-graphql](https://github.com/unlight/prisma-nestjs-graphql) by [unlight](https://github.com/unlight). We thank the original author for their excellent work.

---

## Support

- 📖 [Documentation](https://github.com/pegasusheavy/nestjs-prisma-graphql#readme)
- 🐛 [Issue Tracker](https://github.com/pegasusheavy/nestjs-prisma-graphql/issues)
- 💬 [Discussions](https://github.com/pegasusheavy/nestjs-prisma-graphql/discussions)
- ❤️ [Sponsor](https://github.com/sponsors/pegasusheavy)
