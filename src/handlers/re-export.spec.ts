import { describe, expect, it } from 'vitest';

import { ReExport } from './re-export.js';

describe('ReExport enum', () => {
  it('should have None value', () => {
    expect(ReExport.None).toBe('None');
  });

  it('should have Directories value', () => {
    expect(ReExport.Directories).toBe('Directories');
  });

  it('should have Single value', () => {
    expect(ReExport.Single).toBe('Single');
  });

  it('should have All value', () => {
    expect(ReExport.All).toBe('All');
  });

  it('should have exactly 4 values', () => {
    const values = Object.values(ReExport);
    expect(values).toHaveLength(4);
  });
});
