import { log } from "console";
import * as Tone from "tone";

export async function setupAudio() {
    await Tone.start();
}

const synth = new Tone.PolySynth(Tone.Synth).toDestination();
const now = Tone.now();

interface Note {
    keyName: string;
    hertz: number;
};

let playingNotes: Note[] = [];

export function playHertz(keyName: string, hertz: number) {
    synth.triggerAttack(hertz, now);
    playingNotes.push({keyName, hertz});
};

export function stopHertz(keyName: string) {
    const currentNote = playingNotes.find((playingNote) => {return playingNote.keyName === keyName });
    if (typeof currentNote === 'undefined') {return};
    synth.triggerRelease(currentNote.hertz, now);
    playingNotes = playingNotes.filter(playingNote => playingNote !== currentNote);
};
