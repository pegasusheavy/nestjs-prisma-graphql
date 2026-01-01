import { isWhereUniqueInputType } from '../helpers/is-where-unique-input-type.js';
import type { EventArguments, EventEmitter, InputType } from '../types.js';

export function requireSingleFieldsInWhereUniqueInput(eventEmitter: EventEmitter): void {
  eventEmitter.on('BeforeInputType', beforeInputType);
}

function beforeInputType(args: EventArguments & { inputType: InputType }): void {
  const { inputType } = args;

  if (!isWhereUniqueInputType(inputType.name) || inputType.fields.length !== 1) {
    return;
  }

  for (const field of inputType.fields) {
    field.isRequired = true;
    field.isNullable = false;
  }
}
