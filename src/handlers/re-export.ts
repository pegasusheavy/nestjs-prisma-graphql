import {
  type Directory,
  type ExportDeclarationStructure,
  type SourceFile,
  StructureKind,
} from 'ts-morph';

import type { EventArguments, EventEmitter } from '../types.js';

export enum ReExport {
  None = 'None',
  Directories = 'Directories',
  Single = 'Single',
  All = 'All',
}

export function reExport(emitter: EventEmitter): void {
  emitter.on('BeforeGenerateFiles', beforeGenerateFiles);
}

function beforeGenerateFiles(args: EventArguments): void {
  const { project, output, config } = args;
  const rootDirectory = project.getDirectoryOrThrow(output);

  if ([ReExport.Directories, ReExport.All].includes(config.reExport)) {
    // Collect all directories first to avoid iteration issues during file creation
    const directories = [...rootDirectory.getDescendantDirectories()];
    const indexFiles: Array<{ path: string; statements: ExportDeclarationStructure[] }> = [];

    for (const directory of directories) {
      const sourceFiles = directory
        .getSourceFiles()
        .filter(sourceFile => sourceFile.getBaseName() !== 'index.ts');

      if (sourceFiles.length > 0) {
        const exportDeclarations = sourceFiles.map(sourceFile =>
          getExportDeclaration(directory, sourceFile),
        );
        indexFiles.push({
          path: `${directory.getPath()}/index.ts`,
          statements: exportDeclarations,
        });
      } else {
        const subdirs = directory.getDirectories();
        if (subdirs.length > 0) {
          const namespaceExportDeclarations = subdirs.map(sourceDirectory =>
            getNamespaceExportDeclaration(directory, sourceDirectory),
          );
          indexFiles.push({
            path: `${directory.getPath()}/index.ts`,
            statements: namespaceExportDeclarations,
          });
        }
      }
    }

    // Create all index files after iteration
    for (const { path, statements } of indexFiles) {
      project.createSourceFile(path, { statements }, { overwrite: true });
    }
  }

  if (config.reExport === ReExport.Single) {
    const sourceFiles = project
      .getSourceFiles()
      .filter(sourceFile => sourceFile.getBaseName() !== 'index.ts');

    const exportDeclarations = sourceFiles.map(sourceFile =>
      getExportDeclaration(rootDirectory, sourceFile),
    );

    rootDirectory.createSourceFile(
      'index.ts',
      { statements: exportDeclarations },
      { overwrite: true },
    );
  }

  if (config.reExport === ReExport.All) {
    const exportDeclarations: ExportDeclarationStructure[] = [];
    const directories = rootDirectory.getDirectories();

    for (const directory of directories) {
      if (directory.getBaseName() === 'node_modules') continue;
      const indexFile = directory.getSourceFile('index.ts');
      if (indexFile) {
        // For ESM, we need to explicitly reference the index.js file
        const dirName = directory.getBaseName();
        exportDeclarations.push({
          kind: StructureKind.ExportDeclaration,
          moduleSpecifier: `./${dirName}/index.js`,
        });
      }
    }

    if (exportDeclarations.length > 0) {
      rootDirectory.createSourceFile(
        'index.ts',
        { statements: exportDeclarations },
        { overwrite: true },
      );
    }
  }
}

function getExportDeclaration(
  directory: Directory,
  sourceFile: SourceFile,
): ExportDeclarationStructure {
  // For ESM, ensure module specifiers have .js extension
  let moduleSpecifier = directory.getRelativePathAsModuleSpecifierTo(sourceFile);
  if (!moduleSpecifier.endsWith('.js') && !moduleSpecifier.endsWith('.ts')) {
    moduleSpecifier = moduleSpecifier + '.js';
  } else if (moduleSpecifier.endsWith('.ts')) {
    moduleSpecifier = moduleSpecifier.slice(0, -3) + '.js';
  }

  // Use namespace exports (export * from) instead of named exports
  // to avoid stack overflow when processing many files with complex exports
  return {
    kind: StructureKind.ExportDeclaration,
    moduleSpecifier,
  };
}

function getNamespaceExportDeclaration(
  directory: Directory,
  sourceDirectory: Directory,
): ExportDeclarationStructure {
  let moduleSpecifier = directory.getRelativePathAsModuleSpecifierTo(sourceDirectory);
  if (!moduleSpecifier.endsWith('/index.js')) {
    moduleSpecifier = moduleSpecifier + '/index.js';
  }

  return {
    kind: StructureKind.ExportDeclaration,
    moduleSpecifier,
  };
}
