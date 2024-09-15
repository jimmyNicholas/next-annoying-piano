import { notePitches } from "@/_lib/_data/noteNames";

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

export function convertPitchToHertz(targetName: string, targetOctave: number) {
    const baseName: string = 'A';
    const baseOctave: number = 4;
    const baseHertz: number = 440;
    const interval = getInterval(targetName, targetOctave, baseName, baseOctave);
    return calculateHertz(baseHertz, interval);
};
