# 07: Reverb

**Goal:** match Tone.Reverb and the web app's side-by-side routing.

## Tasks
- Add a convolution reverb using a generated impulse response (decaying noise after a pre-delay).
- Add parameters: Decay (0.01 to 10 s, default 5), Pre-Delay (0.01 to 1 s), Wet (0 to 1, default 1).
- Rebuild the impulse response on the message thread, never the audio thread.
- Route the synth into vibrato and reverb side by side and add their outputs together.

## Prototype
The full sound of the web app, playable in Ableton.

## Done when
- Changing Decay while playing does not glitch or spike the CPU.
- Ableton keeps the reverb tail after notes stop (tail length reported).
