import { describe, expect, it } from 'vitest';

import { createComment } from './create-comment.js';
import { ObjectSettings } from './object-settings.js';

describe('createComment', () => {
  it('should create a JSDoc comment from single line documentation', () => {
    const result = createComment('This is a description');

    expect(result).toContain('/**');
    expect(result).toContain(' * This is a description');
    expect(result).toContain(' */');
  });

  it('should create a JSDoc comment from multi-line documentation', () => {
    const result = createComment('First line\nSecond line\nThird line');

    expect(result).toContain(' * First line');
    expect(result).toContain(' * Second line');
    expect(result).toContain(' * Third line');
  });

  it('should include deprecation reason when provided in settings', () => {
    const settings = new ObjectSettings();
    settings.push({
      name: '',
      kind: 'Field',
      input: false,
      output: false,
      model: false,
      from: '',
      arguments: { deprecationReason: 'Use newField instead' },
    });

    const result = createComment('Field description', settings);

    expect(result).toContain(' * @deprecated Use newField instead');
  });

  it('should not include @deprecated when no deprecation reason', () => {
    const settings = new ObjectSettings();

    const result = createComment('Field description', settings);

    expect(result).not.toContain('@deprecated');
  });

  it('should handle empty documentation', () => {
    const result = createComment('');

    expect(result).toContain('/**');
    expect(result).toContain(' * ');
    expect(result).toContain(' */');
  });

  it('should format comment with proper JSDoc structure', () => {
    const result = createComment('Test documentation');
    const lines = result.split('\n');

    expect(lines[0]).toBe('/**');
    expect(lines[1]).toBe(' * Test documentation');
    expect(lines[2]).toBe(' */');
  });

  it('should handle documentation with special characters', () => {
    const result = createComment('Description with `code` and *emphasis*');

    expect(result).toContain(' * Description with `code` and *emphasis*');
  });

  it('should preserve indentation in documentation', () => {
    const result = createComment('Line 1\n  Indented line\nLine 3');

    expect(result).toContain(' * Line 1');
    expect(result).toContain(' *   Indented line');
    expect(result).toContain(' * Line 3');
  });

  it('should handle settings without Field kind', () => {
    const settings = new ObjectSettings();
    settings.push({
      name: 'SomeDecorator',
      kind: 'Decorator',
      input: false,
      output: false,
      model: false,
      from: 'somewhere',
    });

    const result = createComment('Description', settings);

    expect(result).not.toContain('@deprecated');
  });
});
