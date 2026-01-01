import { partition } from 'lodash-es';
import type { PropertyDeclarationStructure } from 'ts-morph';

import type { DMMF, EventEmitter } from '../types.js';

export function emitSingle(emitter: EventEmitter): void {
  emitter.on('ClassProperty', classProperty);
}

function classProperty(
  property: PropertyDeclarationStructure,
  eventArguments: {
    location: DMMF.FieldLocation;
    isList: boolean;
    propertyType: string[];
  },
): void {
  const { location, isList, propertyType } = eventArguments;
  if (['inputObjectTypes', 'outputObjectTypes'].includes(location) && !isList) {
    const [safeTypes, instanceofTypes] = partition(
      propertyType,
      t => t === 'null' || t.startsWith('Prisma.'),
    );
    const mappedInstanceofTypes = instanceofTypes.map(t => `InstanceType<typeof ${t}>`);

    property.type = [...mappedInstanceofTypes, ...safeTypes].join(' | ');
  }
}
