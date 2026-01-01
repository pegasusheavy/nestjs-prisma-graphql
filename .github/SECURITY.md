# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### Do NOT

- Open a public GitHub issue
- Discuss the vulnerability publicly
- Exploit the vulnerability

### Do

1. **Email us directly** at security@pegasusheavy.dev with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fixes

2. **Allow time for response**
   - We will acknowledge receipt within 48 hours
   - We will provide a detailed response within 7 days
   - We will work on a fix and coordinate disclosure

3. **Coordinate disclosure**
   - We will credit you in the security advisory (if desired)
   - We will notify you when the fix is released

## Security Best Practices

When using this generator:

1. **Keep dependencies updated**
   ```bash
   pnpm update
   ```

2. **Review generated code**
   - The generator creates code from your schema
   - Always review generated types for sensitive fields

3. **Use @HideField()**
   ```prisma
   model User {
     /// @HideField()
     password String
   }
   ```

4. **Validate inputs**
   - Enable class-validator in production
   - Use strict validation rules

## Security Features

This generator includes:

- **No code execution** - Only generates static TypeScript files
- **No network access** - Works entirely offline
- **No file access** - Only writes to configured output directory
- **Sanitized output** - All generated code is properly escaped
