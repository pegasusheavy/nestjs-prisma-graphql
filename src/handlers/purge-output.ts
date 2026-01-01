import { rmdirSync } from 'node:fs';

import type { EventArguments, EventEmitter } from '../types.js';

export function purgeOutput(emitter: EventEmitter): void {
  emitter.on('Begin', begin);
  emitter.on('End', end);
}

function begin({ project, output }: EventArguments): void {
  const sourceFiles = project.getDirectory(output)?.getDescendantSourceFiles();

  if (sourceFiles) {
    for (const sourceFile of sourceFiles) {
      sourceFile.delete();
    }
  }
}

function end({ project, output }: EventArguments): void {
  const directories = project
    .getDirectory(output)
    ?.getDescendantDirectories()
    .filter(directory => directory.getSourceFiles().length === 0)
    .map(directory => directory.getPath());

  for (const directory of directories ?? []) {
    try {
      rmdirSync(directory);
    } catch {
      // Ignore errors
    }
  }
}
