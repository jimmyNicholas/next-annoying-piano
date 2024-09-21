// Options Panel Types
export interface OptionsPanelProps {
    globalProps: GlobalProps;
    modeProps: ModeProps;
};

export interface GlobalProps {
    enableAudio: () => void;
    audioIsLoaded: boolean;
    onReset: () => void;
};

export interface ModeProps {
    mode: string;
    updateMode: (mode: string) => void;
};

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
    hertzModifyers: HertzModifyers;
    hertzTable: HertzTable;
};

export interface HertzModifyers {
    lastKey: string;
    currentKey: string;
    modifyerOne: number; 
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
    isQwertyEnabled: boolean; 
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

// Audio Output Types
export interface Note {
    keyName: string;
    hertz: number;
};

export interface AudioModule {
    setupAudio: () => void;
    playHertz: (keyName: string, hertz:number) => void;
    stopHertz: (keyName: string) => void;
};
