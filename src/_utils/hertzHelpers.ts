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
 * @param {string} targetName - Target note name (e.g., 'C', 'F#')
 * @param {number} targetOctave - Target note octave
 * @param {string} baseName - Reference note name
 * @param {number} baseOctave - Reference note octave
 * @returns {number} Number of semitones between the notes (positive or negative)
*/
function getInterval(
    targetName: string, 
    targetOctave: number, 
    baseName: string, 
    baseOctave: number
): number {
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
function convertPitchToHertz(targetName: string, targetOctave: number): number {
    const baseName: string = 'A';
    const baseOctave: number = 4;
    const baseHertz: number = 440; // A4 = 440 Hz (concert pitch)

    const interval = getInterval(targetName, targetOctave, baseName, baseOctave);
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
    const startPitchIndex = notePitches.indexOf(startPitch);
    const numberOfKeys = getInterval(endPitch, endOctave, startPitch, startOctave);

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
