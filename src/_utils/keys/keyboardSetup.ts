import { notePitches } from "@/_lib/_data/noteNames";
import { Key, KeyboardRange } from "@/_lib/_types/types";

/**
 * Generates an array of key definitions based on a specified keyboard range.
 * 
 * @description
 * This utility function creates a sequence of musical keys by:
 * 1. Converting pitch and octave inputs to MIDI numbers
 * 2. Validating the range is properly ordered
 * 3. Generating key objects with pitch, octave, and MIDI information
 * 
 * The function uses MIDI number calculation where:
 * - Each octave spans 12 semitones
 * - Each pitch within an octave maps to a specific offset
 * 
 * @param {KeyboardRange} range - The keyboard range specification:
 * @param {string} range.startPitch - Starting note name (e.g., 'C', 'F#')
 * @param {number} range.startOctave - Starting octave number
 * @param {string} range.endPitch - Ending note name
 * @param {number} range.endOctave - Ending octave number
 * 
 * @returns {Key[]} Array of key objects, each containing:
 * - midiNumber: MIDI note number (0-127)
 * - name: Complete note name (e.g., 'C4', 'F#5')
 * - pitch: Note name without octave (e.g., 'C', 'F#')
 * - octave: Octave number (e.g., '4', '5')
 * 
 * @throws {Error} If the start note is higher than the end note
 * 
 * @example
 * ```typescript
 * // Generate keys from C4 to G5
 * const keys = getKeys({
 *   startPitch: 'C',
 *   startOctave: 4,
 *   endPitch: 'G',
 *   endOctave: 5
 * });
 * 
 * // Result example:
 * // [
 * //   { midiNumber: 60, name: 'C4', pitch: 'C', octave: 4 },
 * //   { midiNumber: 61, name: 'C#4', pitch: 'C#', octave: 4 },
 * //   ...
 * //   { midiNumber: 79, name: 'G5', pitch: 'G', octave: 5 }
 * // ]
 * 
 * // Use in a component
 * function Piano() {
 *   const keys = getKeys({
 *     startPitch: 'A',
 *     startOctave: 3,
 *     endPitch: 'C',
 *     endOctave: 5
 *   });
 *   
 *   return (
 *     <div>
 *       {keys.map(key => (
 *         <PianoKey
 *           key={key.name}
 *           note={key.name}
 *           midiNumber={key.midiNumber}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const getKeys = ({ startPitch, startOctave, endPitch, endOctave}: KeyboardRange): Key[] => {
    // Find indices in the pitch array for start and end notes
    const startPitchIndex = notePitches.indexOf(startPitch);
    const endPitchIndex = notePitches.indexOf(endPitch);

    // Calculate MIDI numbers for range validation
    const midiNumberStart = 24 + startOctave * 12 + startPitchIndex;
    const midiNumberEnd = 24 + endOctave * 12 + endPitchIndex;

    // Validate the range is properly ordered
    if (midiNumberStart > midiNumberEnd) {
        throw new Error(
            `Invalid input: start note ${startPitch + startOctave} is higher that end note ${endPitch + endOctave}`
        );
    }

    const keysArray = [];
    let octave = startOctave;
    const numberOfKeys = midiNumberEnd - midiNumberStart;

    // Generate key objects for each note in the range
    for(let i = 0; i <= numberOfKeys; i++) {
        // Calculate current pitch using modulo to wrap around notePitches array
        const pitch = notePitches[(startPitchIndex+ i) % 12];

        // Increment octave when we reach a new C note
        if (i !== 0 && pitch === 'C') {
            octave++;
        }

        // Create and store the key object
        keysArray.push({
            midiNumber: midiNumberStart + i,
            name: pitch + octave,
            pitch,
            octave   
        });
    }

    return keysArray;
};
