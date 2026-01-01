import { camelCase, startCase } from 'lodash-es';

export function pascalCase(string: string) {
  return startCase(camelCase(string)).replaceAll(' ', '');
}
