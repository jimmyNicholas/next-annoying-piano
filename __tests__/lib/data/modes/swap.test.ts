import { describe, it, expect } from 'vitest';
import { SwapMode } from '@/_lib/_data/modes/swap';
import { HertzModifiers, HertzTable } from '@/_lib/_types/types';

describe('SwapMode', () => {
    it('should initialize with correct properties', () => {
      const mode = new SwapMode();
      expect(mode.id).toBe('SWAP');
      expect(mode.name).toBe('Swap');
      expect(mode.description).toBe('Swaps pitch of the last released key with the previous key.');
      expect(mode.modifiers).toEqual([]);
    });
  
    it('should swap frequencies between two different keys', () => {
      const mode = new SwapMode();
      const hertzModifiers: HertzModifiers = {
        lastKey: 'A4',
        currentKey: 'B4'
      };
      const hertzTable: HertzTable = {
        'A4': 440,
        'B4': 493.88
      };
  
      mode.modify(hertzModifiers, hertzTable);
  
      expect(hertzTable['A4']).toBe(493.88);
      expect(hertzTable['B4']).toBe(440);
    });
  
    it('should not modify frequencies when last and current keys are the same', () => {
      const mode = new SwapMode();
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
  