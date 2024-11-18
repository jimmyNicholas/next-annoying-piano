import * as ToneType from "tone";

/**
 * @namespace ModeConfiguration
 */

/**
 * Represents a musical mode with modification capabilities
 * @interface Mode
 * @property {string} id - Unique identifier for the mode
 * @property {string} name - Display name of the mode
 * @property {string} description - Description of the mode's musical characteristics
 * @property {ModeModifiers[]} [modifiers] - Optional array of modifiers that can alter the mode
 * @property {(hertzModifiers: HertzModifiers, hertzTable: HertzTable) => void} modify - Function to apply mode modifications
 */
export interface Mode {
    id: string;
    name: string;
    description: string;
    modifiers?: ModeModifiers[];
    modify: (hertzModifiers: HertzModifiers, hertzTable: HertzTable) => void;
}

/**
 * Represents a modifier that can be applied to a mode
 * @interface ModeModifiers
 * @property {string} id - Unique identifier for the modifier
 * @property {string} name - Display name of the modifier
 * @property {number} min - Minimum value for the modifier
 * @property {number} value - Current value of the modifier
 * @property {number} max - Maximum value for the modifier
 * @property {number} step - Step increment for the modifier
 */
export interface ModeModifiers {
    id: string,
    name: string;
    min: number;
    value: number;
    max: number;
    step: number;
}

/**
 * @namespace KeyboardConfiguration
 */

/**
 * Defines the range of a keyboard
 * @interface KeyboardRange
 * @property {string} startPitch - Starting pitch (e.g., "C", "F#")
 * @property {number} startOctave - Starting octave number
 * @property {string} endPitch - Ending pitch
 * @property {number} endOctave - Ending octave number
 */
export interface KeyboardRange {
    startPitch: string; 
    startOctave: number; 
    endPitch: string; 
    endOctave: number;
};

/**
 * @namespace FrequencyManagement
 */

/**
 * Tracks the current and last played keys for hertz calculations
 * @interface HertzModifiers
 * @property {string} lastKey - Previously played key
 * @property {string} currentKey - Currently playing key
 */
export interface HertzModifiers {
    lastKey: string;
    currentKey: string;
}

/**
 * Lookup table for key frequencies
 * @interface HertzTable
 * @property {number} [key: string] - Frequency in hertz for each key
 */
export interface HertzTable {
    [key: string]: number;
};

/**
 * Represents a musical key with its properties
 * @interface Key
 * @property {number} midiNumber - MIDI note number
 * @property {string} name - Full name of the key (e.g., "C4")
 * @property {string} pitch - Pitch class (e.g., "C", "F#")
 * @property {number} octave - Octave number
 */
export interface Key {
    midiNumber: number;
    name: string;
    pitch: string;
    octave: number;
};

/**
 * @namespace KeyHandling
 */

/**
 * Handlers for keyboard events
 * @interface KeyHandlers
 * @property {(keyName: string) => void} onKeyDown - Handler for key press
 * @property {(keyName: string) => void} onKeyUp - Handler for key release
 */
export interface KeyHandlers {
    onKeyDown: (keyName: string) => void;
    onKeyUp: (keyName: string) => void;
}

export type Emitter = ToneType.Emitter;

/**
 * @namespace MidiPlayback
 */

/**
 * Possible states for MIDI playback
 * @type {('stopped' | 'playing' | 'paused')}
 */
export type MidiPlaybackState = 'stopped' | 'playing' | 'paused';

/**
 * @namespace ToneTypes
 */
export { ToneType };
export type PolySynth = ToneType.PolySynth;

/**
 * Interface for playing and stopping frequency playback
 * @interface HertzPlayback
 * @property {(keyName: string, hertz: number) => void} playHertz - Start playing a frequency
 * @property {(keyName: string) => void} stopHertz - Stop playing a frequency
 */
export interface HertzPlayback {
    playHertz: (keyName: string, hertz:number) => void;
    stopHertz: (keyName: string) => void;
};

/**
 * @namespace AudioEffects
 */
export type InputNode = ToneType.InputNode;
export type Reverb = ToneType.Reverb;
export type Vibrato = ToneType.Vibrato;

/**
 * Interface for audio effects
 * @interface EffectInterface
 * @property {string | undefined} name - Name of the effect
 * @property {EffectOptions[]} options - Array of configurable options for the effect
 */
export interface EffectInterface {
    name: string | undefined;
    options: EffectOptions[];
};

/**
 * Configuration options for an audio effect
 * @interface EffectOptions
 * @property {string} title - Display title for the option
 * @property {string} name - Internal name of the option
 * @property {() => number | undefined} get - Getter function for the option value
 * @property {(value: number) => void} set - Setter function for the option value
 * @property {number} min - Minimum value
 * @property {number} max - Maximum value
 * @property {number} step - Step increment
 */
interface EffectOptions {
    title: string;
    name: string;
    get: () => number | undefined;
    set: (value: number) => void;
    min: number;
    max: number;
    step: number
};
