import { describe, it, expect } from 'vitest';
import { getHertzTable } from '@/_utils/hertzHelpers';
import { KeyboardRange } from '@/_lib/_types/types';

describe('getHertzTable', () => {
    // Helper function for frequency comparison
    const roundFreq = (freq: number) => Math.round(freq * 100) / 100;
    
    describe('Input validation', () => {
      it('throws on invalid input types', () => {
        const invalidInputs = [
          { startPitch: 42, startOctave: 4, endPitch: 'C', endOctave: 5 },
          { startPitch: 'C', startOctave: '4', endPitch: 'C', endOctave: 5 },
          { startPitch: 'C', startOctave: 4, endPitch: null, endOctave: 5 },
          { startPitch: 'C', startOctave: 4, endPitch: 'C', endOctave: '5' }
        ];
  
        invalidInputs.forEach(input => {
          expect(() => getHertzTable(input as unknown as KeyboardRange))
            .toThrow('Invalid input');
        });
      });
  
      it('throws on invalid pitch values', () => {
        const invalidPitches = [
          { startPitch: 'H', startOctave: 4, endPitch: 'C', endOctave: 5 },
          { startPitch: 'C', startOctave: 4, endPitch: 'X', endOctave: 5 },
        ];
  
        invalidPitches.forEach(input => {
          expect(() => getHertzTable(input as KeyboardRange))
            .toThrow(/Invalid pitch. Must be one of:/);
        });
      });
  
      it('throws on non-integer octaves', () => {
        const invalidOctaves = [
          { startPitch: 'C', startOctave: 4.5, endPitch: 'C', endOctave: 5 },
          { startPitch: 'C', startOctave: 4, endPitch: 'C', endOctave: 5.7 },
        ];
  
        invalidOctaves.forEach(input => {
          expect(() => getHertzTable(input as KeyboardRange))
            .toThrow('Octave must be an integer');
        });
      });
  
      it('throws when start note is higher than end note', () => {
        const input: KeyboardRange = {
          startPitch: 'C',
          startOctave: 5,
          endPitch: 'C',
          endOctave: 4
        };
  
        expect(() => getHertzTable(input))
          .toThrow(/Invalid input: start note .* is higher than end note/);
      });
    });
  
    describe('Frequency calculations', () => {
      it('calculates correct frequencies for one octave C4 to C5', () => {
        const input: KeyboardRange = {
          startPitch: 'C',
          startOctave: 4,
          endPitch: 'C',
          endOctave: 5
        };
  
        const result = getHertzTable(input);
        
        // Test standard frequencies
        expect(roundFreq(result['C4'])).toBe(261.63);  // Middle C
        expect(roundFreq(result['A4'])).toBe(440.00);  // A440 concert pitch
        expect(roundFreq(result['C5'])).toBe(523.25);  // One octave up
      });
  
      it('handles octave transitions correctly', () => {
        const input: KeyboardRange = {
          startPitch: 'A',
          startOctave: 4,
          endPitch: 'E',
          endOctave: 6
        };
  
        const result = getHertzTable(input);
        
        // Check octave transition
        expect(result['B4']).toBeLessThan(result['C5']);
        
        // Test that C5 is the correct frequency ratio above C4
        expect(roundFreq(result['A5'] / result['A4'])).toBe(2); // Octave relationship
      });
  
      it('generates correct number of keys', () => {
        const input: KeyboardRange = {
          startPitch: 'C',
          startOctave: 4,
          endPitch: 'G',
          endOctave: 4
        };
  
        const result = getHertzTable(input);
        expect(Object.keys(result).length).toBe(8); // C to G is 8 notes
      });
  
      it('handles single note range', () => {
        const input: KeyboardRange = {
          startPitch: 'A',
          startOctave: 4,
          endPitch: 'A',
          endOctave: 4
        };
  
        const result = getHertzTable(input);
        expect(Object.keys(result).length).toBe(1);
        expect(roundFreq(result['A4'])).toBe(440.00);
      });
  
      it('maintains frequency ratios between semitones', () => {
        const input: KeyboardRange = {
          startPitch: 'A',
          startOctave: 4,
          endPitch: 'A',
          endOctave: 4
        };
  
        const result = getHertzTable(input);
        const semitoneRatio = Math.pow(2, 1/12); // Approximately 1.059463
        
        // Check if adjacent notes follow the semitone ratio
        for (let i = 0; i < Object.keys(result).length - 1; i++) {
          const currentFreq = Object.values(result)[i];
          const nextFreq = Object.values(result)[i + 1];
          expect(roundFreq(nextFreq / currentFreq)).toBe(roundFreq(semitoneRatio));
        }
      });
    });
});
