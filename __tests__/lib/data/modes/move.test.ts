import { describe, it, expect } from 'vitest';
import { MoveMode } from '@/_lib/_data/modes/move';
import { HertzModifiers, HertzTable } from '@/_lib/_types/types';

describe('MoveMode', () => {
    it('should initialize with correct properties', () => {
      const mode = new MoveMode();
      expect(mode.id).toBe('MOVE');
      expect(mode.name).toBe('Move');
      expect(mode.description).toBe('Last released key moves up or down a specified number of semitones..');
      expect(mode.modifiers).toHaveLength(1);
      expect(mode.modifiers[0]).toEqual({
        id: 'SEMITONES',
        name: 'semitones',
        min: -2,
        value: 1,
        max: 2,
        step: 1
      });
    });
  
    it('should shift frequency up by one semitone with default modifier', () => {
      const mode = new MoveMode();
      const hertzModifiers: HertzModifiers = {
        currentKey: 'A4',
        lastKey: 'B4'
      };
      const hertzTable: HertzTable = {
        'A4': 440,
        'B4': 493.88
      };
  
      mode.modify(hertzModifiers, hertzTable);
  
      // One semitone up from A4 (440Hz) should be approximately 466.16Hz
      expect(hertzTable['A4']).toBeCloseTo(466.16, 2);
    });
  
    it('should shift frequency down when using negative semitones', () => {
      const mode = new MoveMode();
      mode.modifiers[0].value = -1;  // Set to shift down one semitone
      
      const hertzModifiers: HertzModifiers = {
        currentKey: 'B4',
        lastKey: 'A4'
      };
      const hertzTable: HertzTable = {
        'A4': 440,
        'B4': 493.88
      };
  
      mode.modify(hertzModifiers, hertzTable);
  
      // One semitone down from B4 (493.88Hz) should be approximately 466.16Hz
      expect(hertzTable['B4']).toBeCloseTo(466.16, 2);
    });
  });
