import { describe, it, expect } from 'vitest';
import { getInterval } from '@/_utils/hertzHelpers';

describe('getInterval', () => {
	// Test cases for intervals within the same octave
	it('should calculate different intervals within an octave', () => {
		expect(getInterval('C', 7, 'B', 7)).toBe(11); // up a major seventh
		expect(getInterval('C', 0, 'A#', 0)).toBe(10); // up a dominant seventh
		expect(getInterval('C', 2, 'G', 2)).toBe(7); // up a perfect fifth
		expect(getInterval('C#', 0, 'G', 0)).toBe(6); // up a tri-tone
		expect(getInterval('D', 4, 'F', 4)).toBe(3); // up a minor third
		expect(getInterval('D#', 0, 'E', 0)).toBe(1); // up a minor second
		expect(getInterval('F', 5, 'E', 5)).toBe(-1); // down a minor second
		expect(getInterval('F', 0, 'D#', 0)).toBe(-2); // down a major second
		expect(getInterval('F#', 3, 'D', 3)).toBe(-4); // down a major third
		expect(getInterval('G', 0, 'D', 0)).toBe(-5); // down a perfect fourth
		expect(getInterval('G#', 1, 'C', 1)).toBe(-8); // down a minor sixth
		expect(getInterval('B', 0, 'D', 0)).toBe(-9); // down a major sixth
	}); 

	// Test cases for identical notes
	it('should return 0 if the notes and ocataves are the same', () => {
		expect(getInterval('C', 0, 'C', 0)).toBe(0);
		expect(getInterval('F#', 3, 'F#', 3)).toBe(0);
		expect(getInterval('B', 5, 'B', 5)).toBe(0);
		expect(getInterval('G', 6, 'G', 6)).toBe(0);
		expect(getInterval('D#', 7, 'D#', 7)).toBe(0);
	}); 

	// Test cases for intervals across different octaves
	it('should calculate different intervals across octaves', () => {
		expect(getInterval('C', 2, 'A', 6)).toBe(57); // Up 4 octaves + major sixth
		expect(getInterval('B', 3, 'A#', 4)).toBe(11); // Up 1 octave - semitone
		expect(getInterval('C', 6, 'G', 4)).toBe(-17); // Down 2 octaves + fifth
		expect(getInterval('C#', 9, 'G', 4)).toBe(-54); // Down 5 octaves + tritone
		expect(getInterval('D', 4, 'C', 3)).toBe(-14); // Down 1 octave + major second
	}); 

	// Test cases for invalid type inputs
	it('should throw error for invalid input types', () => {
		expect(() => getInterval(((5 as unknown) as string), 2, 'A', 5)).toThrow('Invalid input');
		expect(() => getInterval('C', (('one' as unknown) as number), 'A', 5)).toThrow('Invalid input');
		expect(() => getInterval('G', 0, ((undefined as unknown) as string), 5)).toThrow('Invalid input');
		expect(() => getInterval('C', 2, 'A', ((null as unknown) as number))).toThrow('Invalid input');
		expect(() => 
			getInterval(
				((7 as unknown) as string), 
				(('foo' as unknown) as number), 
				(([] as unknown) as string), 
				(({} as unknown) as number)))
		.toThrow('Invalid input');
	}); 

	// Test cases for invalid note name inputs
	it('should throw error for invalid input types', () => {
		expect(() => getInterval('foo', 2, 'A', 5)).toThrow('Invalid note name');
		expect(() => getInterval('C', 2, 'bar', 3)).toThrow('Invalid note name');
		expect(() => getInterval('foo', 2, 'bar', 3)).toThrow('Invalid note name');
	}); 
	
	// Test cases for invalid octave inputs
	it('should throw error for non integer numbers', () => {
		expect(() => getInterval('C', 5.67, 'A', 7)).toThrow('Invalid input');
		expect(() => getInterval('E', 0, 'B', 3.1)).toThrow('Invalid input');
		expect(() => getInterval('F#', 3.14, 'D#', 65.2)).toThrow('Invalid input');
		expect(getInterval('D', 2.0, 'G#', 3)).toBe(18);
	});
});
  