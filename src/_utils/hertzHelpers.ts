import { notePitches } from "@/_lib/_data/noteNames";
import { KeyboardRange, HertzTable } from "@/_lib/_types/types";

function calculateHertz(baseHertz: number, interval: number) {
    if (interval === 0) {
        return baseHertz;
    }
    const ratio = Math.pow(2, 1 / 12);
    return Math.round(baseHertz * Math.pow(ratio, interval));
}

function getInterval(targetName: string, targetOctave: number, baseName: string, baseOctave: number) {
    const baseIndex = notePitches.indexOf(baseName);
    const targetIndex = notePitches.indexOf(targetName);
    if (baseOctave === targetOctave) {
        return targetIndex - baseIndex;
    }
    const octaveInterval = (targetOctave - baseOctave) * 12;
    return targetIndex - baseIndex + octaveInterval;
}

function convertPitchToHertz(targetName: string, targetOctave: number) {
    const baseName: string = 'A';
    const baseOctave: number = 4;
    const baseHertz: number = 440;
    const interval = getInterval(targetName, targetOctave, baseName, baseOctave);
    return calculateHertz(baseHertz, interval);
};

export const getHertzTable = ({ startPitch, startOctave, endPitch, endOctave}: KeyboardRange): HertzTable => {
    const startPitchIndex = notePitches.indexOf(startPitch);
    const numberOfKeys = getInterval(endPitch, endOctave, startPitch, startOctave);
    if (numberOfKeys < 0) { throw new Error(`Invalid input: start note ${startPitch + startOctave} is higher that end note ${endPitch + endOctave}`)};
    
    const hertzTable: {[key: string]: number} = {};
    let octave = startOctave;
    for (let i = 0; i <= numberOfKeys; i++) {
        const pitch = notePitches[i % 12 + startPitchIndex];
        if (i !== 0 && pitch === 'C') {
            octave++;
        }
        const hertz = convertPitchToHertz(pitch, octave);
        const keyName = pitch + octave;
        hertzTable[keyName] = hertz;
    }

    return hertzTable;
};
