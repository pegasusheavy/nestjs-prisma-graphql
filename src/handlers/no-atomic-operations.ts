import type { EventArguments, EventEmitter, InputType } from '../types.js';

export function noAtomicOperations(eventEmitter: EventEmitter): void {
  eventEmitter.on('BeforeInputType', beforeInputType);
  eventEmitter.on('BeforeGenerateFiles', beforeGenerateFiles);
}

function beforeInputType(args: EventArguments & { inputType: InputType }): void {
  const { inputType, getModelName } = args;

  for (const field of inputType.fields) {
    const fieldName = field.name;
    field.inputTypes = field.inputTypes.filter(it => {
      const inputTypeName = String(it.type);
      const modelName = getModelName(inputTypeName);

      if (
        isAtomicOperation(inputTypeName) ||
        (modelName && isListInput(inputTypeName, modelName, fieldName))
      ) {
        return false;
      }
      return true;
    });
  }
}

function beforeGenerateFiles(args: EventArguments): void {
  const { project } = args;

  for (const sourceFile of project.getSourceFiles()) {
    const className = sourceFile.getClass(() => true)?.getName();

    if (className && isAtomicOperation(className)) {
      project.removeSourceFile(sourceFile);
    }
  }
}

function isAtomicOperation(typeName: string): boolean {
  if (typeName.endsWith('FieldUpdateOperationsInput')) {
    return true;
  }
  return false;
}

function isListInput(typeName: string, model: string, field: string): boolean {
  return (
    typeName === `${model}Create${field}Input` ||
    typeName === `${model}Update${field}Input`
  );
}
