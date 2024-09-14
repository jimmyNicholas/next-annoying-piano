import * as Tone from "tone";

export async function setupAudio() {
    await Tone.start();
}

const synth = new Tone.PolySynth(Tone.Synth).toDestination();
const now = Tone.now();

export function playHertz(hertz: number) {
    synth.triggerAttack(hertz, now);
}

export function stopHertz(hertz: number) {
    synth.triggerRelease(hertz, now)
}
