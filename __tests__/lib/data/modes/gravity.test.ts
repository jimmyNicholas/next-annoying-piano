import { describe, it, expect } from 'vitest';
import { GravityMode } from '@/_lib/_data/modes/gravity';
import { HertzModifiers, HertzTable } from '@/_lib/_types/types';

describe('GravityMode', () => {
  it('should initialize with correct properties', () => {
    const mode = new GravityMode();
    expect(mode.id).toBe('GRAVITY');
    expect(mode.name).toBe('Gravity');
    expect(mode.description).toBe('Pulls the pitch of the previous key toward it the last released key.');
    expect(mode.modifiers).toHaveLength(1);
    expect(mode.modifiers[0]).toEqual({
      id: 'STRENGTH',
      name: 'Strength',
      min: 1,
      value: 2,
      max: 10,
      step: 0.1
    });
  });

  it('should pull frequency toward target based on strength', () => {
    const mode = new GravityMode();
    const hertzModifiers: HertzModifiers = {
      lastKey: 'A4',
      currentKey: 'B4'
    };
    const hertzTable: HertzTable = {
      'A4': 440,
      'B4': 493.88
    };

    mode.modify(hertzModifiers, hertzTable);

    // With default strength of 2 and max of 10, the formula would be:
    // newHertz = 440 - ((440 - 493.88) / (10 - 2))
    // This pulls A4 partially toward B4
    expect(hertzTable['A4']).toBeCloseTo(446.735, 3);
    expect(hertzTable['B4']).toBe(493.88); // Target frequency shouldn't change
  });

  it('should not modify frequencies when last and current keys are the same', () => {
    const mode = new GravityMode();
    const hertzModifiers: HertzModifiers = {
      lastKey: 'A4',
      currentKey: 'A4'
    };
    const hertzTable: HertzTable = {
      'A4': 440
    };

    const originalTable = { ...hertzTable };
    mode.modify(hertzModifiers, hertzTable);

    expect(hertzTable).toEqual(originalTable);
  });
});
