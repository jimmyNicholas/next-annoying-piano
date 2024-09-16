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
    onKeyDown: (keyName: string) => void;
    onKeyUp: (keyName: string) => void;
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
export interface HertzTable {
    [key: string]: number;
};

// Audio Output Types
export interface AudioModule {
    setupAudio: () => void;
    playHertz: (keyName: string, hertz:number) => void;
    stopHertz: (keyName: string) => void;
};
