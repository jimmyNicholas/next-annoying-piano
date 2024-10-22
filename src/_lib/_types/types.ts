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
    midiPlaybackProps: MidiPlaybackProps;
};

export interface MidiPlaybackProps {
    getMidiFileText: () => string | null;
    handleMidiUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    play: () => void; 
    pause: () => void;
    stop: () => void;
    getPlaybackState: () => 'stopped' | 'playing' | 'paused'
};

export interface ModeProps {
    getModeState: () => Mode;
    setModeState: (mode: number) => void;
    setMod: (value: number, index: number) => void;
    maxModes: number;
};

export interface OutputProps {
    effectsInterfaces: {
        gainInterface: EffectInterface; 
        reverbInterface: EffectInterface;
        vibratoInterface: EffectInterface;
    };
};

// Mode Types
export interface Mode {
    index: number;
    text: string;
    value: string;
    description: string;
    modifiers?: ModeModifiers[];
}

interface ModeModifiers {
    modName: string,
    label: string;
    min: number;
    value: number;
    max: number;
    step: number;
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
};

export interface NoteEvent {
    name: string;
    startTime: number;
    duration: number;
};

// Audio Output Types
import * as ToneType from "tone";
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

export interface EffectInterface {
    name: string | undefined;
    options: EffectOptions[];
};

interface EffectOptions {
    title: string;
    name: string;
    get: () => number | undefined;
    set: (value: number) => void;
    min: number;
    max: number;
    step: number
};
