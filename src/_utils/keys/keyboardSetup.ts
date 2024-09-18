import { notePitches } from "@/_lib/_data/noteNames";
import { Key, KeyboardRange } from "@/_lib/_types/types";

export const getKeys = ({ startPitch, startOctave, endPitch, endOctave}: KeyboardRange): Key[] => {
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
