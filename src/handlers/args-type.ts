import { isManyAndReturnOutputType } from '../helpers/is-many-and-return.js';
import { pascalCase } from '../helpers/pascal-case.js';
import type { EventArguments, InputType, SchemaField } from '../types.js';

/**
 * See https://github.com/prisma/prisma/blob/master/src/packages/client/src/generation/TSClient/Model.ts@getAggregationTypes
 * Subscribes on: 'ArgsType'
 */
export function argsType(field: SchemaField, args: EventArguments): void {
  if (['queryRaw', 'executeRaw'].includes(field.name)) {
    return;
  }
  if (isManyAndReturnOutputType(field.name)) return;

  const { eventEmitter, typeNames, getModelName } = args;
  let className = pascalCase(`${field.name}Args`);
  const modelName = getModelName(className) ?? '';

  switch (className) {
    case `Aggregate${modelName}Args`: {
      className = `${modelName}AggregateArgs`;
      break;
    }
    case `GroupBy${modelName}Args`: {
      className = `${modelName}GroupByArgs`;
      break;
    }
  }

  const inputType: InputType = {
    constraints: { maxNumFields: null, minNumFields: null },
    name: className,
    fields: [...field.args],
  };

  if (
    !field.args.some(x => x.name === '_count') &&
    [`${modelName}AggregateArgs`, `${modelName}GroupByArgs`].includes(className)
  ) {
    const names = ['Count', 'Avg', 'Sum', 'Min', 'Max'];
    if (`${modelName}GroupByArgs` === inputType.name) {
      // Make `by` property array only, noEnumerable
      const byField = inputType.fields.find(f => f.name === 'by');
      if (byField?.inputTypes) {
        byField.inputTypes = byField.inputTypes.filter(it => it.isList);
      }
    }
    for (const name of names) {
      if (!typeNames.has(`${modelName}${name}AggregateInput`)) {
        continue;
      }

      inputType.fields.push({
        name: `_${name.toLowerCase()}`,
        isRequired: false,
        isNullable: true,
        inputTypes: [
          {
            location: 'inputObjectTypes',
            type: `${modelName}${name}AggregateInput`,
            isList: false,
          },
        ],
      });
    }
  }

  eventEmitter.emitSync('InputType', {
    ...args,
    inputType,
    fileType: 'args',
    classDecoratorName: 'ArgsType',
  });
}
