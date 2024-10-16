// Options Panel Types
export interface OptionsPanelProps {
    globalProps: GlobalProps;
    inputProps: InputProps;
    modeProps: ModeProps;
    outputProps: OutputProps;
};

export interface GlobalProps {
    onReset: () => void;
};

export interface InputProps {
    checkIsQwertyEnabled: () => boolean;
    toggleIsQwertyEnabled: () => void;
    keyHandlers: KeyHandlers;
};

export interface ModeProps {
    mode: Mode;
    updateMode: (mode: number) => void;
    onModChange: (value: number, index: number) => void;
    maxModes: number;
};

export interface OutputProps {
    effectsNodes: {
        gainNode: Gain | null; 
        reverbNode: Reverb | null;
        vibratoNode: Vibrato | null;
    };
};

// Mode Types
export interface Mode {
    index: number;
    text: string;
    value: string;
    modifiers?: ModeModifiers[];
}

interface ModeModifiers {
    modName: string,
    label: string;
    min: number;
    value: number;
    max: number;
}

//Keyboard Types
export interface KeyboardProps {
    keys: Key[],
    keyHandlers: KeyHandlers;
}

export interface Key {
    midiNumber: number;
    name: string;
    pitch: string;
    octave: number;
};

export interface KeyboardRange {
    startPitch: string; 
    startOctave: number; 
    endPitch: string; 
    endOctave: number;
};

// Hertz State Types
export interface ModeSelect {
    mode: string;
    hertzModifiers: HertzModifiers;
    hertzTable: HertzTable;
};

export interface HertzModifiers {
    lastKey: string;
    currentKey: string;
    modifiers: ModeModifiers[] | undefined; 
}

export interface HertzTable {
    [key: string]: number;
};

// Key Handler Types
export interface KeyHandlers {
    onKeyDown: (keyName: string) => void;
    onKeyUp: (keyName: string) => void;
}

// User Input Types
export interface QwertyInputProps {
    checkIsQwertyEnabled: () => boolean; 
    octaveRange: OctaveRange;
    keyHandlers: KeyHandlers;
};

interface OctaveRange {
    octaveMin: number;
    currentOctave: number;
    octaveMax: number; 
};

export interface QwertyMap {
    [key: string]: BaseKeyName;
};

export interface BaseKeyName {
    pitch: string;
    baseOctave: number;
};

export interface MidiPlaybackState {
    fileName: string;
    tracks: {
        name: string;
        muted: boolean;
        noteEvents: NoteEvent[];
    }[],
}

export interface NoteEvent {
    name: string;
    startTime: number;
    duration: number;
};

// Audio Output Types
import * as ToneType from 'tone';
export { ToneType };

export interface Note {
    keyName: string;
    hertz: number;
};

export interface HertzPlayback {
    playHertz: (keyName: string, hertz:number) => void;
    stopHertz: (keyName: string) => void;
};

// Audio Synth Types
export type PolySynth = ToneType.PolySynth;

// Audio Effects Types
export type InputNode = ToneType.InputNode;
export type Gain = ToneType.Gain;
export type Reverb = ToneType.Reverb;
export type Vibrato = ToneType.Vibrato;
