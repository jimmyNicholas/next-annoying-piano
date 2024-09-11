import { getKeys } from "@/_utils/keys/keyboardSetup";
import { expect } from '@jest/globals';

describe('getKeys function', () => {
    it('should return an array of note objects when start note is lower than end', () => {
        const startPitch = 'A';
        const startOctave = 3;
        const endPitch = 'E';
        const endOctave = 4;

        const result = getKeys(startPitch, startOctave, endPitch, endOctave);

        expect(result).toEqual([
            {
                midiNumber: 69,
                name: 'A3',
                pitch: 'A',
                octave: 3,
            },
            {
                midiNumber: 70,
                name: 'A#3',
                pitch: 'A#',
                octave: 3,
            },
            {
                midiNumber: 71,
                name: 'B3',
                pitch: 'B',
                octave: 3,
            },
            {
                midiNumber: 72,
                name: 'C4',
                pitch: 'C',
                octave: 4,
            },
            {
                midiNumber: 73,
                name: 'C#4',
                pitch: 'C#',
                octave: 4,
            },
        ]);
    });

    it('should throw an error if start note is higher than end', () => {
        const result = getKeys('D', 5, 'G', 4);
        expect(result).toThrowError('Invalid input: start note D5 is higher that end note G4');
    });
});
