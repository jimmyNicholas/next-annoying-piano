// Options Panel Types
export interface OptionsPanelProps {
    globalProps: GlobalProps;
    inputProps: InputProps;
    modeProps: ModeProps;
    outputProps: OutputProps;
};

export interface GlobalProps {

};

export interface InputProps {
    isQwertyEnabled: boolean;
    toggleIsQwertyEnabled: () => void;
    midiPlaybackProps: MidiPlaybackProps;
};

export interface MidiPlaybackProps {
    midiFileText: string | null;
    handleMidiUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    play: () => void; 
    pause: () => void;
    stop: () => void;
    playbackState:  'stopped' | 'playing' | 'paused';
};

export interface ModeProps {
    getModeRef: () => Mode;
    setModeRef: (newMode: Mode) => void;
    updateModifier: (newValue: number, index: number) => void;
    modes: Mode[];
    onReset: () => void;
};

export interface OutputProps {
    polySynthInterface: EffectInterface;
    effectsInterfaces: {
        reverbInterface: EffectInterface;
        vibratoInterface: EffectInterface;
    };
};

// Mode Types
export interface Mode {
    id: string;
    name: string;
    description: string;
    modifiers?: ModeModifiers[];
    modify: (hertzModifiers: HertzModifiers, hertzTable: HertzTable) => void;
}

export interface ModeModifiers {
    id: string,
    name: string;
    min: number;
    value: number;
    max: number;
    step: number;
}

//Keyboard Types
export interface KeyboardProps {
    keys: Key[],
    keyEmitter: ToneType.Emitter | null,
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

export type MidiPlaybackState = 'stopped' | 'playing' | 'paused';

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

// Audio Event Types
export type Emitter = ToneType.Emitter;

// Audio Synth Types
export type PolySynth = ToneType.PolySynth;

// Audio Effects Types
export type InputNode = ToneType.InputNode;
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
