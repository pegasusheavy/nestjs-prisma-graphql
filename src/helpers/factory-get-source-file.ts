import type { Project } from 'ts-morph';

import type { EventEmitter } from '../types.js';
import { generateFileName } from './generate-file-name.js';

export function factoryGetSourceFile(args: {
  output: string;
  outputFilePattern: string;
  project: Project;
  getModelName(name: string): string | undefined;
  eventEmitter: EventEmitter;
}) {
  const { outputFilePattern, output, getModelName, project } = args;

  return function getSourceFile(args: { type: string; name: string }) {
    const { name, type } = args;
    let filePath = generateFileName({
      getModelName,
      name,
      type,
      template: outputFilePattern,
    });
    filePath = `${output}/${filePath}`;

    return (
      project.getSourceFile(filePath) ||
      project.createSourceFile(filePath, undefined, { overwrite: true })
    );
  };
}
