// Options Panel Types
export interface OptionsPanelProps {
    globalProps: GlobalProps;
    modeProps: ModeProps;
};

export interface GlobalProps {
    enableAudio: () => void;
    audioIsLoaded: boolean;
    onReset: () => void,
};

export interface ModeProps {
    mode: string;
    updateMode: (mode: string) => void;
};

// Key State Tyoes
export interface Key {
    midiNumber: number,
    name: string,
    pitch: string,
    octave: number,
};

export interface HertzTable {
    [key: string]: number;
};

// Audio Output Types
export interface AudioModule {
    setupAudio: () => void;
    playHertz: (keyName: string, hertz:number) => void;
    stopHertz: (keyName: string) => void;
};
