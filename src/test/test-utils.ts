import { Project, QuoteKind } from 'ts-morph';

export function createTestProject() {
  return new Project({
    manipulationSettings: {
      quoteKind: QuoteKind.Single,
    },
    skipAddingFilesFromTsConfig: true,
    skipLoadingLibFiles: true,
  });
}

export function createTestSourceFile(project: Project, content: string, fileName = 'test.ts') {
  return project.createSourceFile(fileName, content, { overwrite: true });
}
