import { describe, expect, it } from 'vitest';

import { ImportDeclarationMap } from './import-declaration-map.js';

describe('ImportDeclarationMap', () => {
  describe('add method', () => {
    it('should add import with name and module specifier', () => {
      const map = new ImportDeclarationMap();
      map.add('Field', '@nestjs/graphql');

      expect(map.has('Field')).toBe(true);
      expect(map.get('Field')?.moduleSpecifier).toBe('@nestjs/graphql');
    });

    it('should add import with structure object', () => {
      const map = new ImportDeclarationMap();
      map.add('Field', {
        moduleSpecifier: '@nestjs/graphql',
        namedImports: [{ name: 'Field' }],
      });

      expect(map.has('Field')).toBe(true);
    });

    it('should not overwrite existing import', () => {
      const map = new ImportDeclarationMap();
      map.add('Field', '@nestjs/graphql');
      map.add('Field', 'other-module');

      expect(map.get('Field')?.moduleSpecifier).toBe('@nestjs/graphql');
    });

    it('should add type-only import', () => {
      const map = new ImportDeclarationMap();
      map.add('User', '@prisma/client', true);

      expect(map.get('User')?.isTypeOnly).toBe(true);
    });
  });

  describe('addType method', () => {
    it('should add type-only import with type: prefix', () => {
      const map = new ImportDeclarationMap();
      map.addType('User', './user.model');

      expect(map.has('type:User')).toBe(true);
      expect(map.get('type:User')?.isTypeOnly).toBe(true);
    });

    it('should not add if regular import already exists', () => {
      const map = new ImportDeclarationMap();
      map.add('User', './user.model');
      map.addType('User', './user.model');

      expect(map.has('type:User')).toBe(false);
      expect(map.has('User')).toBe(true);
    });

    it('should not add if type import already exists', () => {
      const map = new ImportDeclarationMap();
      map.addType('User', './user.model');
      map.addType('User', './another.model');

      expect(map.get('type:User')?.moduleSpecifier).toBe('./user.model');
    });
  });

  describe('create method', () => {
    it('should create named import', () => {
      const map = new ImportDeclarationMap();
      map.create({ name: 'Field', from: '@nestjs/graphql' });

      expect(map.has('Field')).toBe(true);
      const imp = map.get('Field');
      expect(imp?.namedImports).toContainEqual({ name: 'Field' });
    });

    it('should create default import', () => {
      const map = new ImportDeclarationMap();
      map.create({ name: 'lodash', from: 'lodash-es', defaultImport: true });

      expect(map.has('lodash')).toBe(true);
      expect(map.get('lodash')?.defaultImport).toBe('lodash');
    });

    it('should create default import with custom name', () => {
      const map = new ImportDeclarationMap();
      map.create({ name: 'pkg', from: 'some-pkg', defaultImport: 'SomePkg' });

      expect(map.has('SomePkg')).toBe(true);
      expect(map.get('SomePkg')?.defaultImport).toBe('SomePkg');
    });

    it('should create namespace import', () => {
      const map = new ImportDeclarationMap();
      map.create({ name: 'utils', from: './utils', namespaceImport: 'Utils' });

      expect(map.has('Utils')).toBe(true);
      expect(map.get('Utils')?.namespaceImport).toBe('Utils');
    });

    it('should create type-only import', () => {
      const map = new ImportDeclarationMap();
      map.create({ name: 'User', from: './user', isTypeOnly: true });

      expect(map.has('type:User')).toBe(true);
      expect(map.get('type:User')?.isTypeOnly).toBe(true);
    });

    it('should handle namedImport with namespaceImport', () => {
      const map = new ImportDeclarationMap();
      map.create({
        name: 'utils',
        from: './utils',
        namespaceImport: 'Utils',
        namedImport: true,
      });

      expect(map.has('Utils')).toBe(true);
      const imp = map.get('Utils');
      expect(imp?.namedImports).toContainEqual({ name: 'Utils' });
    });

    it('should not overwrite existing import', () => {
      const map = new ImportDeclarationMap();
      map.create({ name: 'Field', from: '@nestjs/graphql' });
      map.create({ name: 'Field', from: 'other-module' });

      expect(map.get('Field')?.moduleSpecifier).toBe('@nestjs/graphql');
    });
  });

  describe('toStatements method', () => {
    it('should yield import declaration structures', () => {
      const map = new ImportDeclarationMap();
      map.add('Field', '@nestjs/graphql');
      map.add('User', '@prisma/client');

      const statements = [...map.toStatements()];

      expect(statements).toHaveLength(2);
      expect(statements[0].kind).toBeDefined();
      expect(statements[0].moduleSpecifier).toBe('@nestjs/graphql');
      expect(statements[1].moduleSpecifier).toBe('@prisma/client');
    });

    it('should return empty iterator for empty map', () => {
      const map = new ImportDeclarationMap();

      const statements = [...map.toStatements()];

      expect(statements).toHaveLength(0);
    });
  });

  describe('Map inheritance', () => {
    it('should support standard Map operations', () => {
      const map = new ImportDeclarationMap();
      map.add('Field', '@nestjs/graphql');

      expect(map.size).toBe(1);
      expect(map.has('Field')).toBe(true);
      expect(map.delete('Field')).toBe(true);
      expect(map.size).toBe(0);
    });

    it('should support iteration', () => {
      const map = new ImportDeclarationMap();
      map.add('Field', '@nestjs/graphql');
      map.add('User', '@prisma/client');

      const entries = [...map.entries()];

      expect(entries).toHaveLength(2);
    });
  });
});
