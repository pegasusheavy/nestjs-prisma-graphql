# Contributing to nestjs-prisma-graphql

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- Git

### Development Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/nestjs-prisma-graphql.git
   cd nestjs-prisma-graphql
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run tests**

   ```bash
   pnpm test
   ```

4. **Build the project**

   ```bash
   pnpm build
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names:

- `feat/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring
- `test/description` - Test updates

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/). Format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Tests
- `build` - Build system
- `ci` - CI/CD
- `chore` - Maintenance

**Examples:**

```
feat(generator): add support for custom scalars
fix(esm): resolve circular dependency in type registry
docs: update configuration examples
```

### Code Style

- We use ESLint with strict TypeScript rules
- All methods must have explicit accessibility modifiers
- Run `pnpm lint` before committing
- Run `pnpm format` to auto-format code

### Testing

- Write tests for all new features
- Ensure all tests pass: `pnpm test`
- Check coverage: `pnpm test:cov`
- Maintain or improve test coverage

## Pull Request Process

1. **Create a feature branch**

   ```bash
   git checkout -b feat/my-feature
   ```

2. **Make your changes**

   - Write clean, documented code
   - Add/update tests
   - Update documentation if needed

3. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

4. **Push and create PR**

   ```bash
   git push origin feat/my-feature
   ```

5. **Fill out the PR template**

   - Describe your changes
   - Link related issues
   - Complete the checklist

6. **Address review feedback**

   - Make requested changes
   - Push additional commits
   - Re-request review when ready

## Project Structure

```
src/
├── handlers/        # Event handlers for different type categories
├── helpers/         # Utility functions
├── index.ts         # Main export
├── generate.ts      # Core generation logic
├── types.ts         # TypeScript type definitions
└── event-names.ts   # Event name constants

docs/                # Angular documentation site
  └── src/app/       # Angular components

.github/
├── workflows/       # GitHub Actions
└── ISSUE_TEMPLATE/  # Issue templates
```

## Testing Guidelines

### Unit Tests

- Located in `src/**/*.spec.ts`
- Use Vitest
- Test individual functions in isolation

```typescript
describe('functionName', () => {
  it('should do something', () => {
    expect(functionName(input)).toBe(expected);
  });
});
```

### Integration Tests

- Test complete generation flow
- Use realistic Prisma schemas

## Documentation

### Code Documentation

- Add JSDoc comments to public APIs
- Document complex logic inline
- Keep README.md up to date

### Docs Site

The documentation site is in `docs/`:

```bash
cd docs
pnpm install
pnpm start
```

## Release Process

Releases are automated via GitHub Actions:

1. Maintainers tag a release: `git tag v1.0.0`
2. Push the tag: `git push --tags`
3. CI builds, tests, and publishes

## Getting Help

- **Questions?** Open a [Discussion](https://github.com/PegasusHeavyIndustries/nestjs-prisma-graphql/discussions)
- **Bugs?** Open an [Issue](https://github.com/PegasusHeavyIndustries/nestjs-prisma-graphql/issues)
- **Security?** Email security@pegasusheavy.dev

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0. See the [LICENSE](../LICENSE) file for details.
