# 04: Gravity and Move, plus the mode parameter

**Goal:** all three modes, switchable from Ableton.

## Tasks
- Implement Gravity (with the strength 10 fix) and Move in `TapEngine`, with ported unit tests.
- Add parameters: Mode (Swap, Gravity, Move), Gravity Strength (1 to 10), Move Semitones (-2 to 2).
- Reset the pitch table when the mode changes.

## Prototype
In Ableton's generic device view you can switch modes and automate strength and semitones while playing. Gravity's in-between pitches are audible.

## Done when
- Tests pass for all three modes.
- Changing mode resets the pitches.
