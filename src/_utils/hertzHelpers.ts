import { notePitches } from "@/_lib/_data/noteNames";
import { KeyboardRange, HertzTable } from "@/_lib/_types/types";

/**
 * Calculates the frequency of a note based on a base frequency and semitone interval.
 * 
 * @description
 * Uses the equal temperament formula: f = f0 * (2^(1/12))^n
 * where f0 is the base frequency and n is the number of semitones from the base note.
 * 
 * @param {number} baseHertz - Reference frequency (typically 440Hz for A4)
 * @param {number} interval - Number of semitones from the base frequency (positive or negative)
 * @returns {number} Calculated frequency in Hertz
 * 
 * @example
 * ```typescript
 * // Calculate C5 (three semitones up from A4)
 * const c5 = calculateHertz(440, 3); // ≈ 523.25 Hz
 * 
 * // Calculate G4 (two semitones down from A4)
 * const g4 = calculateHertz(440, -2); // ≈ 392 Hz
 * ```
 */
export const calculateHertz = (baseHertz: number, interval: number): number => {
    if (
        typeof baseHertz !== 'number' ||
        typeof interval !== 'number' ||
        !Number.isInteger(interval) ||
        !Number.isFinite(baseHertz) ||  
        !Number.isFinite(interval) 
    ) {
        throw new Error('Invalid input');
    }

    if (interval === 0) {
        return baseHertz;
    }
    const ratio = Math.pow(2, 1 / 12); // Equal temperament ratio
    return baseHertz * Math.pow(ratio, interval);
}

/**
 * Calculates the semitone interval between two notes.
 * 
 * @description
 * Determines the number of semitones between two notes, taking into account
 * both the pitch class (C, C#, etc.) and octave number.
 * 
 * @param {string} baseName - Reference note name
 * @param {number} baseOctave - Reference note octave
 * @param {string} targetName - Target note name (e.g., 'C', 'F#')
 * @param {number} targetOctave - Target note octave
 * @returns {number} Number of semitones between the notes (positive or negative)
*/
export function getInterval(
    baseName: string, 
    baseOctave: number,
    targetName: string, 
    targetOctave: number
): number {
    if (
        typeof targetName !== 'string' || 
        typeof targetOctave !== 'number' ||
        !Number.isInteger(targetOctave) || 
        typeof baseName !== 'string' || 
        typeof baseOctave !== 'number' ||
        !Number.isInteger(baseOctave)
    ) {
        throw new Error('Invalid input');
    }
    
    if (
        !notePitches.includes(baseName) || 
        !notePitches.includes(targetName)
    ) {
        throw new Error('Invalid note name');
    };

    const baseIndex = notePitches.indexOf(baseName);
    const targetIndex = notePitches.indexOf(targetName);

    if (baseOctave === targetOctave) {
        return targetIndex - baseIndex;
    }

    const octaveInterval = (targetOctave - baseOctave) * 12;
    return targetIndex - baseIndex + octaveInterval;
}

/**
 * Converts a note name and octave to its frequency in Hertz.
 * 
 * @description
 * Calculates the frequency of any note relative to A4 (440 Hz)
 * using equal temperament tuning.
 * 
 * @param {string} targetName - Note name (e.g., 'C', 'F#')
 * @param {number} targetOctave - Octave number
 * @returns {number} Frequency in Hertz
*/
export function convertPitchToHertz(targetName: string, targetOctave: number): number {
    if (
        typeof targetName !== 'string' ||
        typeof targetOctave !== 'number' ||
        !Number.isInteger(targetOctave)
    ) {
    throw new Error('Invalid input');
    }

    const baseName: string = 'A';
    const baseOctave: number = 4;
    const baseHertz: number = 440; // A4 = 440 Hz (concert pitch)

    if (
        !notePitches.includes(targetName)
    ) {
        throw new Error('Invalid note name');
    };

    const interval = getInterval(baseName, baseOctave, targetName, targetOctave);
    return calculateHertz(baseHertz, interval);
};

/**
 * Creates a mapping of note names to frequencies for a given keyboard range.
 * 
 * @description
 * Generates a lookup table that maps note names (e.g., 'C4', 'F#5') to their
 * corresponding frequencies in Hertz. This is useful for quick frequency lookups
 * during playback.
 * 
 * @param {KeyboardRange} range - The keyboard range specification:
 * @param {string} range.startPitch - Starting note name
 * @param {number} range.startOctave - Starting octave
 * @param {string} range.endPitch - Ending note name
 * @param {number} range.endOctave - Ending octave
 * 
 * @returns {HertzTable} Object mapping note names to frequencies
 * 
 * @throws {Error} If the start note is higher than the end note
 * 
 * @example
 * ```typescript
 * // Create frequency table for one octave
 * const frequencies = getHertzTable({
 *   startPitch: 'C',
 *   startOctave: 4,
 *   endPitch: 'B',
 *   endOctave: 4
 * });
 * 
 * // Result example:
 * // {
 * //   'C4': 261.63,
 * //   'C#4': 277.18,
 * //   'D4': 293.66,
 * //   ...
 * //   'B4': 493.88
 * // }
 * 
 * // Use in an audio context
 * function playNote(noteName: string) {
 *   const frequency = frequencies[noteName];
 *   oscillator.frequency.value = frequency;
 * }
 * ```
 */
export const getHertzTable = ({ 
    startPitch, 
    startOctave, 
    endPitch, 
    endOctave
}: KeyboardRange): HertzTable => {
    if (typeof startPitch !== 'string' || 
        typeof startOctave !== 'number' || 
        typeof endPitch !== 'string' || 
        typeof endOctave !== 'number'
    ) {
        throw new Error('Invalid input');
    }
    
    if (
        !notePitches.includes(startPitch) || 
        !notePitches.includes(endPitch)
    ) {
        throw new Error(`Invalid pitch. Must be one of: ${notePitches.join(', ')}`);
    }

    if (
        !Number.isInteger(startOctave) || 
        !Number.isInteger(endOctave)
    ) {
        throw new Error('Octave must be an integer');
    }

    const startPitchIndex = notePitches.indexOf(startPitch);
    const numberOfKeys = getInterval(startPitch, startOctave, endPitch, endOctave);

    if (numberOfKeys < 0) { 
        throw new Error(
            `Invalid input: start note ${startPitch + startOctave} is higher than end note ${endPitch + endOctave}`
        );
    };
    
    const hertzTable: {[key: string]: number} = {};
    let octave = startOctave;

    for (let i = 0; i <= numberOfKeys; i++) {
        const pitch = notePitches[(startPitchIndex+ i) % 12];

        // Increment octave when we reach a new C
        if (i !== 0 && pitch === 'C') {
            octave++;
        }
        const hertz = convertPitchToHertz(pitch, octave);
        const keyName = pitch + octave;
        hertzTable[keyName] = hertz;
    }

    return hertzTable;
};
