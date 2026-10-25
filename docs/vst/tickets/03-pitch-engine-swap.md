# 03: Pitch engine with Swap mode

**Goal:** the first "annoying" behaviour.

## Tasks
- Add `TapEngine` in plain C++: 128 frequencies, `reset`, `frequencyForNote`, `noteReleased`.
- Implement Swap, including the first-release rule.
- Add unit tests ported from `__tests__/lib/data/modes/swap.test.ts` and the hertz helper tests.
- Replace the Detune spike: each note on is sent at the frequency stored in the table, using the MPE output from ticket 02.
- Handle the sustain pedal: while it is down, queue released keys, and when it lifts call `noteReleased` for each in release order. Pass the pedal on to the instrument.

## Prototype
Play A then B and release both. Playing A again sounds at B's pitch. With the pedal held, nothing changes until the pedal lifts. The unit tests run with `ctest`.

## Done when
- Tests pass.
- Swap behaves the same as the web app for the same key sequence.
