import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';

@Component({
  selector: 'app-examples',
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
            <span class="text-white">Examples</span>
          </nav>
          <h1 class="text-4xl font-bold text-white mb-4">Examples</h1>
          <p class="text-lg text-steel-300">
            Real-world examples showing how to use the generator effectively.
          </p>
        </div>

        <!-- Blog Example -->
        <section class="mb-16">
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span class="w-10 h-10 rounded-xl bg-gradient-to-br from-pegasus-500/20 to-forge-500/20 flex items-center justify-center">📝</span>
            Blog Application
          </h2>

          <h3 class="text-lg font-semibold text-white mb-3">Prisma Schema</h3>
          <app-code-block [code]="blogSchema" language="graphql" filename="schema.prisma" />

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">NestJS Resolver</h3>
          <app-code-block [code]="blogResolver" language="typescript" filename="post.resolver.ts" />
        </section>

        <!-- E-commerce Example -->
        <section class="mb-16">
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span class="w-10 h-10 rounded-xl bg-gradient-to-br from-pegasus-500/20 to-forge-500/20 flex items-center justify-center">🛒</span>
            E-commerce Store
          </h2>

          <h3 class="text-lg font-semibold text-white mb-3">Prisma Schema</h3>
          <app-code-block [code]="ecommerceSchema" language="graphql" filename="schema.prisma" />

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Product Resolver</h3>
          <app-code-block [code]="productResolver" language="typescript" filename="product.resolver.ts" />
        </section>

        <!-- Multi-tenant Example -->
        <section class="mb-16">
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span class="w-10 h-10 rounded-xl bg-gradient-to-br from-pegasus-500/20 to-forge-500/20 flex items-center justify-center">🏢</span>
            Multi-tenant SaaS
          </h2>

          <h3 class="text-lg font-semibold text-white mb-3">Prisma Schema</h3>
          <app-code-block [code]="multitenantSchema" language="graphql" filename="schema.prisma" />
        </section>

        <!-- Custom Scalars Example -->
        <section class="mb-16">
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span class="w-10 h-10 rounded-xl bg-gradient-to-br from-pegasus-500/20 to-forge-500/20 flex items-center justify-center">🎯</span>
            Custom Scalars
          </h2>

          <h3 class="text-lg font-semibold text-white mb-3">Generator Config</h3>
          <app-code-block [code]="scalarsConfig" language="graphql" filename="schema.prisma" />

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Schema with Custom Scalars</h3>
          <app-code-block [code]="scalarsSchema" language="graphql" filename="schema.prisma" />

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">GraphQL Module Setup</h3>
          <app-code-block [code]="scalarsModule" language="typescript" filename="graphql.module.ts" />
        </section>

        <!-- Platform Setup Examples -->
        <section class="mb-16">
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span class="w-10 h-10 rounded-xl bg-gradient-to-br from-pegasus-500/20 to-forge-500/20 flex items-center justify-center">🏎️</span>
            Platform Setup (Express vs Fastify)
          </h2>

          <p class="text-steel-300 mb-6">
            This library works with both Express and Fastify. Choose your preferred platform:
          </p>

          <h3 class="text-lg font-semibold text-white mb-3">Express + Apollo (Default)</h3>
          <app-code-block [code]="expressSetup" language="typescript" filename="main.ts" />

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Fastify + Mercurius</h3>
          <app-code-block [code]="fastifyMercuriusSetup" language="typescript" filename="main.ts" />

          <h3 class="text-lg font-semibold text-white mt-6 mb-3">Fastify Module Config</h3>
          <app-code-block [code]="fastifyModuleConfig" language="typescript" filename="app.module.ts" />
        </section>

        <!-- Full CRUD Example -->
        <section class="mb-16">
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span class="w-10 h-10 rounded-xl bg-gradient-to-br from-pegasus-500/20 to-forge-500/20 flex items-center justify-center">🔄</span>
            Complete CRUD Resolver
          </h2>

          <app-code-block [code]="crudResolver" language="typescript" filename="user.resolver.ts" />
        </section>
      </div>
    </div>
  `,
})
export class ExamplesComponent {
  blogSchema = `generator client {
  provider = "prisma-client-js"
}

generator nestgraphql {
  provider               = "nestjs-prisma-graphql"
  output                 = "../src/@generated"
  esmCompatible          = true
  fields_Validator_from  = "class-validator"
  fields_Validator_input = true
  reExport               = "Directories"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())

  /// @Validator.IsEmail()
  email     String   @unique

  /// @Validator.MinLength(2)
  /// @Validator.MaxLength(50)
  name      String

  /// @HideField()
  password  String

  posts     Post[]
  comments  Comment[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id          String    @id @default(cuid())

  /// @Validator.MinLength(5)
  /// @Validator.MaxLength(200)
  title       String

  /// @Validator.MaxLength(10000)
  content     String?

  published   Boolean   @default(false)

  author      User      @relation(fields: [authorId], references: [id])
  authorId    String

  comments    Comment[]
  tags        Tag[]

  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Comment {
  id        String   @id @default(cuid())

  /// @Validator.MinLength(1)
  /// @Validator.MaxLength(1000)
  content   String

  post      Post     @relation(fields: [postId], references: [id])
  postId    String

  author    User     @relation(fields: [authorId], references: [id])
  authorId  String

  createdAt DateTime @default(now())
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]
}`;

  blogResolver = `import { Query, Resolver, Args, Mutation, ResolveField, Parent } from '@nestjs/graphql';
import { Post } from '../@generated/post/post.model.js';
import { User } from '../@generated/user/user.model.js';
import { PostCreateInput } from '../@generated/post/post-create.input.js';
import { PostUpdateInput } from '../@generated/post/post-update.input.js';
import { FindManyPostArgs } from '../@generated/post/find-many-post.args.js';
import { PrismaService } from './prisma.service.js';

@Resolver(() => Post)
export class PostResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Post])
  async posts(@Args() args: FindManyPostArgs) {
    return this.prisma.post.findMany({
      ...args,
      where: {
        ...args.where,
        published: true, // Only show published posts
      },
    });
  }

  @Query(() => Post, { nullable: true })
  async post(@Args('id') id: string) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  @Mutation(() => Post)
  async createPost(
    @Args('data') data: PostCreateInput,
    @Args('authorId') authorId: string,
  ) {
    return this.prisma.post.create({
      data: {
        ...data,
        author: { connect: { id: authorId } },
      },
    });
  }

  @Mutation(() => Post)
  async publishPost(@Args('id') id: string) {
    return this.prisma.post.update({
      where: { id },
      data: {
        published: true,
        publishedAt: new Date(),
      },
    });
  }

  @ResolveField(() => User)
  async author(@Parent() post: Post) {
    return this.prisma.user.findUnique({
      where: { id: post.authorId },
    });
  }
}`;

  ecommerceSchema = `model Product {
  id          String   @id @default(cuid())

  /// @Validator.MinLength(3)
  /// @Validator.MaxLength(100)
  name        String

  /// @Validator.MaxLength(2000)
  description String?

  /// @Validator.IsNumber()
  /// @Validator.Min(0)
  price       Decimal

  /// @Validator.IsInt()
  /// @Validator.Min(0)
  stock       Int      @default(0)

  /// @Validator.IsOptional()
  /// @Validator.IsUrl()
  imageUrl    String?

  category    Category @relation(fields: [categoryId], references: [id])
  categoryId  String

  orderItems  OrderItem[]

  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Category {
  id       String    @id @default(cuid())
  name     String    @unique
  products Product[]
}

model Order {
  id         String      @id @default(cuid())
  customer   Customer    @relation(fields: [customerId], references: [id])
  customerId String
  items      OrderItem[]
  status     OrderStatus @default(PENDING)
  total      Decimal
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}

model OrderItem {
  id        String  @id @default(cuid())
  order     Order   @relation(fields: [orderId], references: [id])
  orderId   String
  product   Product @relation(fields: [productId], references: [id])
  productId String
  quantity  Int
  price     Decimal
}

model Customer {
  id     String  @id @default(cuid())

  /// @Validator.IsEmail()
  email  String  @unique

  name   String
  orders Order[]
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}`;

  productResolver = `import { Query, Resolver, Args, Mutation, Int } from '@nestjs/graphql';
import { Product } from '../@generated/product/product.model.js';
import { ProductCreateInput } from '../@generated/product/product-create.input.js';
import { ProductWhereInput } from '../@generated/product/product-where.input.js';
import { PrismaService } from './prisma.service.js';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Product])
  async products(
    @Args('where', { nullable: true }) where?: ProductWhereInput,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
  ) {
    return this.prisma.product.findMany({
      where: { ...where, active: true },
      take,
      skip,
      include: { category: true },
    });
  }

  @Query(() => [Product])
  async searchProducts(@Args('query') query: string) {
    return this.prisma.product.findMany({
      where: {
        active: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }

  @Mutation(() => Product)
  async createProduct(@Args('data') data: ProductCreateInput) {
    return this.prisma.product.create({ data });
  }

  @Mutation(() => Product)
  async updateStock(
    @Args('id') id: string,
    @Args('quantity', { type: () => Int }) quantity: number,
  ) {
    return this.prisma.product.update({
      where: { id },
      data: { stock: { increment: quantity } },
    });
  }
}`;

  multitenantSchema = `model Tenant {
  id        String   @id @default(cuid())

  /// @Validator.MinLength(2)
  /// @Validator.MaxLength(50)
  name      String

  /// @Validator.Matches(/^[a-z0-9-]+$/)
  slug      String   @unique

  plan      Plan     @default(FREE)
  users     User[]
  projects  Project[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model User {
  id       String   @id @default(cuid())

  /// @Validator.IsEmail()
  email    String

  name     String
  role     UserRole @default(MEMBER)

  tenant   Tenant   @relation(fields: [tenantId], references: [id])
  tenantId String

  /// @HideField()
  password String

  @@unique([email, tenantId])
}

model Project {
  id       String @id @default(cuid())
  name     String

  tenant   Tenant @relation(fields: [tenantId], references: [id])
  tenantId String

  /// Hidden - internal tenant isolation
  /// @HideField()
  @@index([tenantId])
}

enum Plan {
  FREE
  STARTER
  PROFESSIONAL
  ENTERPRISE
}

enum UserRole {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}`;

  scalarsConfig = `generator nestgraphql {
  provider             = "nestjs-prisma-graphql"
  output               = "../src/@generated"

  // GraphQL scalars configuration
  fields_Scalars_from   = "graphql-scalars"
  fields_Scalars_output = true

  // Decimal handling
  graphqlScalars_Decimal_name      = "GraphQLDecimal"
  graphqlScalars_Decimal_specifier = "prisma-graphql-type-decimal"

  // BigInt handling
  graphqlScalars_BigInt_name      = "GraphQLBigInt"
  graphqlScalars_BigInt_specifier = "graphql-scalars"
}`;

  scalarsSchema = `model Product {
  id    String @id @default(cuid())

  /// @FieldType('Scalars.GraphQLPositiveFloat')
  price Decimal

  /// @FieldType('Scalars.GraphQLNonNegativeInt')
  stock Int
}

model User {
  /// @FieldType('Scalars.GraphQLEmailAddress')
  email String @unique

  /// @FieldType('Scalars.GraphQLURL')
  avatar String?

  /// @FieldType('Scalars.GraphQLPhoneNumber')
  phone String?

  /// @FieldType('Scalars.GraphQLDateTime')
  createdAt DateTime @default(now())
}

model Analytics {
  id        String @id @default(cuid())

  /// @FieldType('Scalars.GraphQLBigInt')
  pageViews BigInt

  /// @FieldType('Scalars.GraphQLJSON')
  metadata  Json
}`;

  scalarsModule = `import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  DateTimeResolver,
  EmailAddressResolver,
  URLResolver,
  PhoneNumberResolver,
  BigIntResolver,
  JSONResolver,
  PositiveFloatResolver,
  NonNegativeIntResolver,
} from 'graphql-scalars';
import { GraphQLDecimal } from 'prisma-graphql-type-decimal';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      resolvers: {
        DateTime: DateTimeResolver,
        EmailAddress: EmailAddressResolver,
        URL: URLResolver,
        PhoneNumber: PhoneNumberResolver,
        BigInt: BigIntResolver,
        JSON: JSONResolver,
        PositiveFloat: PositiveFloatResolver,
        NonNegativeInt: NonNegativeIntResolver,
        Decimal: GraphQLDecimal,
      },
    }),
  ],
})
export class GraphQLConfigModule {}`;

  expressSetup = `import 'reflect-metadata';
import './@generated/register-all-types.js';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  await app.listen(3000);
  console.log('🚀 Server running at http://localhost:3000/graphql');
}

bootstrap();`;

  fastifyMercuriusSetup = `import 'reflect-metadata';
import './@generated/register-all-types.js';

import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Fastify requires '0.0.0.0' to accept external connections
  await app.listen(3000, '0.0.0.0');
  console.log('🚀 Server running at http://localhost:3000/graphql');
}

bootstrap();`;

  fastifyModuleConfig = `import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      graphiql: true, // GraphiQL interface at /graphiql
      subscription: true, // Enable subscriptions
    }),
    // ... your feature modules
    UserModule,
    PostModule,
  ],
})
export class AppModule {}`;

  crudResolver = `import {
  Query, Resolver, Args, Mutation,
  ResolveField, Parent, Int
} from '@nestjs/graphql';
import { User } from '../@generated/user/user.model.js';
import { UserCreateInput } from '../@generated/user/user-create.input.js';
import { UserUpdateInput } from '../@generated/user/user-update.input.js';
import { UserWhereUniqueInput } from '../@generated/user/user-where-unique.input.js';
import { UserWhereInput } from '../@generated/user/user-where.input.js';
import { UserOrderByWithRelationInput } from '../@generated/user/user-order-by-with-relation.input.js';
import { AggregateUser } from '../@generated/user/aggregate-user.output.js';
import { PrismaService } from './prisma.service.js';

@Resolver(() => User)
export class UserResolver {
  constructor(private prisma: PrismaService) {}

  // CREATE
  @Mutation(() => User)
  async createUser(@Args('data') data: UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  // READ (single)
  @Query(() => User, { nullable: true })
  async user(@Args('where') where: UserWhereUniqueInput) {
    return this.prisma.user.findUnique({ where });
  }

  // READ (many)
  @Query(() => [User])
  async users(
    @Args('where', { nullable: true }) where?: UserWhereInput,
    @Args('orderBy', { nullable: true }) orderBy?: UserOrderByWithRelationInput,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
  ) {
    return this.prisma.user.findMany({ where, orderBy, take, skip });
  }

  // UPDATE
  @Mutation(() => User)
  async updateUser(
    @Args('where') where: UserWhereUniqueInput,
    @Args('data') data: UserUpdateInput,
  ) {
    return this.prisma.user.update({ where, data });
  }

  // DELETE
  @Mutation(() => User)
  async deleteUser(@Args('where') where: UserWhereUniqueInput) {
    return this.prisma.user.delete({ where });
  }

  // AGGREGATE
  @Query(() => AggregateUser)
  async aggregateUser(@Args('where', { nullable: true }) where?: UserWhereInput) {
    return this.prisma.user.aggregate({
      where,
      _count: true,
    });
  }

  // COUNT
  @Query(() => Int)
  async userCount(@Args('where', { nullable: true }) where?: UserWhereInput) {
    return this.prisma.user.count({ where });
  }

  // UPSERT
  @Mutation(() => User)
  async upsertUser(
    @Args('where') where: UserWhereUniqueInput,
    @Args('create') create: UserCreateInput,
    @Args('update') update: UserUpdateInput,
  ) {
    return this.prisma.user.upsert({ where, create, update });
  }
}`;
}
