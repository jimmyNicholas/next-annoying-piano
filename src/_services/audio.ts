import * as Tone from "tone";
import { Note } from '@/_lib/_types/types'

export async function setupAudio() {
    await Tone.start();
}

const synth = new Tone.PolySynth(Tone.Synth).toDestination();
const now = Tone.now();

let playingNotes: Note[] = [];

export function playHertz(keyName: string, hertz: number): void {
    synth.triggerAttack(hertz, now);
    playingNotes.push({keyName, hertz});
};

export function stopHertz(keyName: string): void {
    const currentNote = playingNotes.find((playingNote) => {return playingNote.keyName === keyName });
    if (typeof currentNote === 'undefined') {return};
    synth.triggerRelease(currentNote.hertz, now);
    playingNotes = playingNotes.filter(playingNote => playingNote !== currentNote);
};

export const audioModule = {
    setupAudio,
    playHertz,
    stopHertz,
};
