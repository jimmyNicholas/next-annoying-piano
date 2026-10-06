# 03: Pitch engine with Swap mode

**Goal:** the first "annoying" behaviour.

## Tasks
- Add `TapEngine` in plain C++: 128 frequencies, `reset`, `frequencyForNote`, `noteReleased`.
- Implement Swap, including the first-release rule.
- Add unit tests ported from `__tests__/lib/data/modes/swap.test.ts` and the hertz helper tests.
- Connect it to the synth: note on reads the table, note off calls `noteReleased`.
- Handle the sustain pedal: while it is down, queue released keys, and when it lifts call `noteReleased` for each in release order.

## Prototype
Play A then B and release both. Playing A again sounds at B's pitch. With the pedal held, nothing changes until the pedal lifts. The unit tests run with `ctest`.

## Done when
- Tests pass.
- Swap behaves the same as the web app for the same key sequence.
