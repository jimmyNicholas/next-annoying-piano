import { describe, it, expect } from 'vitest';
import { calculateHertz } from '@/_utils/hertzHelpers';

describe('calculateHertz', () => {
	it('should return baseHertz when interval is 0', () => {
		expect(calculateHertz(440, 0)).toBe(440);
		expect(calculateHertz(880, 0)).toBe(880);
		expect(calculateHertz(220, 0)).toBe(220);
	});
	
	it('should calculate frequencies correctly for positive intervals', () => {
		// Up one semitone (interval = 1)
		expect(calculateHertz(440, 1)).toBeCloseTo(466.164); 
		// Up one octave (interval = 12)
		expect(calculateHertz(440, 12)).toBeCloseTo(880); 
		// Up octave and a half (interval = 18)
		expect(calculateHertz(440, 18)).toBeCloseTo(1244.508);
	});

	it('should calculate frequencies correctly for negative intervals', () => {
		// Down one semitone (interval = -1)
		expect(calculateHertz(440, -1)).toBeCloseTo(415.305); 
		// Down one octave (interval = -12)
		expect(calculateHertz(440, -12)).toBeCloseTo(220); 
		// Down octave and a half (interval = -20)
		expect(calculateHertz(440, -20)).toBeCloseTo(138.591); 
	});

	describe('error handling', () => {
		it('should throw error for non-number baseHertz', () => {
			expect(() => calculateHertz((('440' as unknown) as number), 0)).toThrow('Invalid input');
			expect(() => calculateHertz(((null as unknown) as number), 0)).toThrow('Invalid input');
			expect(() => calculateHertz(((undefined as unknown) as number), 0)).toThrow('Invalid input');
			expect(() => calculateHertz((([] as unknown) as number), 0)).toThrow('Invalid input');
		});

		it('should throw error for non-number interval', () => {
			expect(() => calculateHertz(440, (('1' as unknown) as number))).toThrow('Invalid input');
			expect(() => calculateHertz(440, ((null as unknown) as number))).toThrow('Invalid input');
			expect(() => calculateHertz(440, ((undefined as unknown) as number))).toThrow('Invalid input');
			expect(() => calculateHertz(440, (({} as unknown) as number))).toThrow('Invalid input');
		});

		it('should throw error for non-integer intervals', () => {
			expect(() => calculateHertz(440, 1.5)).toThrow('Invalid input');
			expect(() => calculateHertz(440, -2.7)).toThrow('Invalid input');
			expect(() => calculateHertz(440, Math.PI)).toThrow('Invalid input');
		});

		it('should throw error for NaN or Infinity', () => {
			expect(() => calculateHertz(NaN, 0)).toThrow('Invalid input');
			expect(() => calculateHertz(Infinity, 0)).toThrow('Invalid input');
			expect(() => calculateHertz(440, NaN)).toThrow('Invalid input');
			expect(() => calculateHertz(440, Infinity)).toThrow('Invalid input');
		});
	});
});
  