# 07: On-screen keyboard and pitch drift view

**Goal:** play with the mouse and see how far each key has drifted.

## Tasks
- Add an 88-key on-screen keyboard (A0 to C8) that feeds notes into TAP.
- Add a strip above the keys showing each key's drift from concert pitch in cents (up is sharp, down is flat).
- Publish the drift values from the audio thread safely (atomics).

## Prototype
Clicking keys plays the Ableton instrument on Track 2, and the strip shows pitches moving as you release keys.

## Done when
- The strip updates smoothly without affecting timing.
