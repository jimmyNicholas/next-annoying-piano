/**
 * Mapping interface for QWERTY keyboard keys to musical notes
 * Associates keyboard characters with their corresponding musical pitch and octave
 * 
 * @interface QwertyMap
 * @property {BaseKeyName} [key: string] - Maps each keyboard character to its musical properties
 */
interface QwertyMap {
    [key: string]: BaseKeyName;
};

/**
 * Properties defining a musical note's basic characteristics
 * 
 * @interface BaseKeyName
 * @property {string} pitch - The musical pitch (e.g., 'C', 'C#', 'D', etc.)
 * @property {number} baseOctave - The octave offset (0 for lower octave, 1 for higher octave)
 */
interface BaseKeyName {
    pitch: string;
    baseOctave: number;
};

/**
 * Standard QWERTY keyboard mapping for a two-octave piano layout
 * Maps keyboard keys to corresponding musical notes in a piano-like arrangement
 * 
 * @constant
 * @type {QwertyMap}
 */
export const qwertyMap: QwertyMap = {
	'a' : {
		pitch: 'C',
		baseOctave: 0
    },
	'w': {
	    pitch: 'C#',
		baseOctave: 0
    },
    's': {
	    pitch: 'D',
		baseOctave: 0
    },
    'e' : {
		pitch: 'D#',
		baseOctave: 0
    },
	'd': {
	    pitch: 'E',
		baseOctave: 0
    },
    'f': {
	    pitch: 'F',
		baseOctave: 0
    },
    't' : {
		pitch: 'F#',
		baseOctave: 0
    },
	'g': {
	    pitch: 'G',
		baseOctave: 0
    },
    'y': {
	    pitch: 'G#',
		baseOctave: 0
    },
    'h' : {
		pitch: 'A',
		baseOctave: 0
    },
	'u': {
	    pitch: 'A#',
		baseOctave: 0
    },
    'j': {
	    pitch: 'B',
		baseOctave: 0
    },
    'k' : {
		pitch: 'C',
		baseOctave: 1
    },
	'o': {
	    pitch: 'C#',
		baseOctave: 1
    },
    'l': {
	    pitch: 'D',
		baseOctave: 1
    },
    'p' : {
		pitch: 'D#',
		baseOctave: 1
    },
	';': {
	    pitch: 'E',
		baseOctave: 1
    },
};
