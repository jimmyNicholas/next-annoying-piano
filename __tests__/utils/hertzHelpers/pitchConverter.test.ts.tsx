import { describe, it, expect } from 'vitest';
import { convertPitchToHertz } from '@/_utils/hertzHelpers';

describe('convertPitchToHertz', () => {
    it('should correctly convert A4 (concert pitch', () => {
        expect(convertPitchToHertz('A', 4)).toBe(440);
    });

    it('should correctly convert notes within the same octave as A4', () => {
        // Test notes around A4
        expect(convertPitchToHertz('G', 4)).toBeCloseTo(391.995, 3);
        expect(convertPitchToHertz('A#', 4)).toBeCloseTo(466.164, 3);
        expect(convertPitchToHertz('B', 4)).toBeCloseTo(493.883, 3);
        expect(convertPitchToHertz('C', 4)).toBeCloseTo(261.626, 3);
        expect(convertPitchToHertz('F#', 4)).toBeCloseTo(369.994, 3);
    });

    it('should correctly convert notes in different octaves', () => {
        // Test octaves above A4
        expect(convertPitchToHertz('A', 5)).toBeCloseTo(880.000, 3);
        expect(convertPitchToHertz('C', 5)).toBeCloseTo(523.251, 3); 
        
        // Test octaves below A4
        expect(convertPitchToHertz('A', 3)).toBeCloseTo(220.000, 3);
        expect(convertPitchToHertz('C', 3)).toBeCloseTo(130.813, 3);
    });

    it('should correctly convert edge cases', () => {
        // Very high notes
        expect(convertPitchToHertz('C', 8)).toBeCloseTo(4186.009, 3); 
        
        // Very low notes
        expect(convertPitchToHertz('C', 0)).toBeCloseTo(16.352, 3);
    });

    it('should throw error for invalid input types', () => {
        // Type checking tests
        expect(() => convertPitchToHertz(((5 as unknown) as string), 4)).toThrow('Invalid input');
        expect(() => convertPitchToHertz('A', (('four' as unknown) as number))).toThrow('Invalid input');
        expect(() => convertPitchToHertz(((undefined as unknown) as string), 4)).toThrow('Invalid input');
        expect(() => convertPitchToHertz('A', ((null as unknown) as number))).toThrow('Invalid input');
    });
    
    it('should throw error for invalid note names', () => {
        expect(() => convertPitchToHertz('H', 4)).toThrow('Invalid note name');
        expect(() => convertPitchToHertz('Cb', 4)).toThrow('Invalid note name');
    });
});
  