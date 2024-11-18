import { describe, it, expect } from 'vitest';
import { calculateHertz } from '@/_utils/hertzHelpers';

describe('calculateHertz', () => {
    it('should return the base frequency when interval is 0', () => {
      const baseFrequency = 440 // A4 note
      expect(calculateHertz(baseFrequency, 0)).toBe(440)
    })

    it('should calculate one semitone up correctly', () => {
        const baseFrequency = 440 // A4 note
        // A#4 should be approximately 466.16 Hz
        expect(calculateHertz(baseFrequency, 1)).toBeCloseTo(466.16, 2)
    })

    it('should calculate one semitone down correctly', () => {
        const baseFrequency = 440 // A4 note
        // G#4 should be approximately 415.30 Hz
        expect(calculateHertz(baseFrequency, -1)).toBeCloseTo(415.30, 2)
    })

    it('should calculate an octave up correctly', () => {
        const baseFrequency = 440 // A4 note
        // A5 should be 880 Hz
        expect(calculateHertz(baseFrequency, 12)).toBeCloseTo(880, 2)
    })

    it('should calculate an octave down correctly', () => {
        const baseFrequency = 440 // A4 note
        // A3 should be 220 Hz
        expect(calculateHertz(baseFrequency, -12)).toBeCloseTo(220, 2)
    })

    it('should handle arbitrary intervals', () => {
        const baseFrequency = 440 // A4 note
        // Perfect fifth up (7 semitones) should be approximately 659.25 Hz
        expect(calculateHertz(baseFrequency, 7)).toBeCloseTo(659.25, 1)
    })
});