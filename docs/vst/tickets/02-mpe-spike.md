# 02: MPE output spike

**Goal:** prove that in-between pitches reach Ableton instruments through the routing. This is the riskiest assumption, so it comes first.

## Tasks
- Give each incoming note its own channel (2 to 16), with channel 1 for shared messages such as the sustain pedal.
- Add a temporary Detune parameter (-100 to +100 cents) applied to every note through per-note pitch bend, with a 48 semitone bend range.
- Send note off on the same channel as its note on, and free the channel afterwards.

## Prototype
With MPE turned on for Track 2's input, Detune at +50 makes notes a quarter tone sharp in Wavetable and Sampler (and Drift, if your Live 11 is version 11.3 or later). Chords stay in tune with each other.

## Done when
- Detune is audible and accurate in at least two Ableton instruments, including through the MIDI From routing in Live 11.
- If MPE does not survive the routing, write down what happened and choose a fallback (semitone mode first, or Max for Live) before ticket 03.
