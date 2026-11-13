import { describe, it, expect } from 'vitest';
import { mapPteToClb, getClbDescription } from '../../src/services/scoring/clbMapping';

describe('CLB Mapping', () => {
  it('maps PTE scores accurately to Canadian CLB levels for all 4 skills', () => {
    // Speaking
    expect(mapPteToClb(89, 'speaking')).toBe(10);
    expect(mapPteToClb(84, 'speaking')).toBe(9);
    expect(mapPteToClb(76, 'speaking')).toBe(8);
    expect(mapPteToClb(68, 'speaking')).toBe(7);
    expect(mapPteToClb(51, 'speaking')).toBe(5);

    // Listening
    expect(mapPteToClb(89, 'listening')).toBe(10);
    expect(mapPteToClb(82, 'listening')).toBe(9);
    expect(mapPteToClb(71, 'listening')).toBe(8);
    expect(mapPteToClb(60, 'listening')).toBe(7);

    // Reading
    expect(mapPteToClb(88, 'reading')).toBe(10);
    expect(mapPteToClb(78, 'reading')).toBe(9);
    expect(mapPteToClb(69, 'reading')).toBe(8);
    expect(mapPteToClb(60, 'reading')).toBe(7);

    // Writing
    expect(mapPteToClb(90, 'writing')).toBe(10);
    expect(mapPteToClb(88, 'writing')).toBe(9);
    expect(mapPteToClb(79, 'writing')).toBe(8);
    expect(mapPteToClb(69, 'writing')).toBe(7);
  });

  it('provides official CLB description', () => {
    const desc = getClbDescription(9);
    expect(desc).toContain('Advanced');
  });
});
