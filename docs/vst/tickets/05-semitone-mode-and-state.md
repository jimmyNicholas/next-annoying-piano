# 05: Semitone mode and saving settings

**Goal:** work with instruments that do not support MPE, and behave like a normal Ableton device.

## Tasks
- Add an Output parameter: MPE or Semitone. Semitone mode sends plain MIDI on one channel with each pitch rounded to the nearest semitone.
- Handle two keys that round to the same note in semitone mode without stuck notes.
- Save and restore all parameters with the Ableton set.

## Prototype
In semitone mode TAP drives an instrument with MPE turned off, or a third-party instrument without MPE. Save, close and reopen a set: the settings are restored.

## Done when
- No stuck notes in either output mode.
- Settings survive saving and reopening.
