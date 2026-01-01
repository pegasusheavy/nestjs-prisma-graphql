import type { EventArguments, InputType, OutputType } from '../types.js';

/**
 * Create aggregate inputs from aggregate outputs.
 * See client/src/generation/TSClient.ts @ getAggregationTypes
 * Subscribes on: 'AggregateOutput'
 */
export function createAggregateInput(
  args: EventArguments & { outputType: OutputType },
): void {
  const { eventEmitter, outputType } = args;
  const className = `${outputType.name}Input`;

  const inputType: InputType = {
    constraints: { maxNumFields: null, minNumFields: null },
    name: className,
    fields: outputType.fields.map(x => ({
      name: x.name,
      isNullable: x.isNullable ?? true,
      isRequired: false,
      inputTypes: [
        {
          isList: false,
          type: 'true',
          location: 'scalar',
        },
      ],
    })),
  };

  eventEmitter.emitSync('InputType', {
    ...args,
    inputType,
    fileType: 'input',
    classDecoratorName: 'InputType',
  });
}
