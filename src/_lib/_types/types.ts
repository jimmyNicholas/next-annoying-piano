export interface Key {
    midiNumber: number,
    name: string,
    pitch: string,
    octave: number,
};

export interface HertzTable {
    [key: string]: number;
};

export interface AudioModule {
    setupAudio: () => void;
    playHertz: (keyName: string, hertz:number) => void;
    stopHertz: (keyName: string) => void;
};
