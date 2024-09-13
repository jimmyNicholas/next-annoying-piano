import { notePitches } from "@/_lib/_data/noteNames";

export function getKeys(startPitch: string, startOctave: number, endPitch: string, endOctave: number) {
    const startPitchIndex = notePitches.indexOf(startPitch);
    const endPitchIndex = notePitches.indexOf(endPitch);
    const midiNumberStart = 24 + startOctave * 12 + startPitchIndex;
    const midiNumberEnd = 24 + endOctave * 12 + endPitchIndex;

    if (midiNumberStart > midiNumberEnd) {
        throw new Error(`Invalid input: start note ${startPitch + startOctave} is higher that end note ${endPitch + endOctave}`);
    }

    const keysArray = [];
    let octave = startOctave;
    const numberOfKeys = midiNumberEnd - midiNumberStart;
    for(let i = 0; i <= numberOfKeys; i++) {
        const pitch = notePitches[i % 12 + startPitchIndex];
        if (i !== 0 && pitch === 'C') {
            octave++;
        }

        keysArray.push(
            {
                midiNumber: midiNumberStart + i,
                name: pitch + octave,
                pitch,
                octave,
            }
        )
    }

    return keysArray;
};
