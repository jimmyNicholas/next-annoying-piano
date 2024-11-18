/**
 * Array of standard musical note pitches in chromatic order
 * Contains all 12 notes in Western musical notation, starting from C
 * 
 * Features:
 * - Follows standard musical notation (C through B)
 * - Includes sharp notes (denoted with #)
 * - Ordered chromatically (each adjacent pair is separated by a semitone)
 * - Used for:
 *   - Generating keyboard layouts
 *   - Musical scale calculations
 *   - Pitch mapping and transposition
 *   - Note name lookups
 * 
 * Note: This array represents one octave. For full range,
 * it can be repeated at different octaves (e.g., C0, C1, C2, etc.)
 * 
 * @constant
 * @type {string[]}
 */
export const notePitches: string[] = [
    'C', 
    'C#', 
    'D', 
    'D#', 
    'E', 
    'F', 
    'F#', 
    'G', 
    'G#', 
    'A', 
    'A#', 
    'B'
];
