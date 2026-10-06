# How the current web build works

This summarises the Next.js and Tone.js web app as it stands, so the Ableton version can copy what matters and leave out what Ableton already does. File paths are relative to the repo root.

## In one paragraph

Every input (mouse, computer keyboard, MIDI controller, MIDI file) is turned into a note name such as `"C4"` and sent to one of two functions: `onKeyDown` and `onKeyUp` in `src/_hooks/useKeyboard.ts`. Pressing a key plays whatever frequency the pitch table currently holds for that key. Releasing a key applies the current mode, which rewrites one entry of the pitch table. So the sound of a key depends on the order of every key released before it. The output is audio only: one synth feeding a reverb and a vibrato. No MIDI is sent anywhere.

```
 mouse ─┐
 QWERTY ─┤                     ┌── onKeyDown(name) ── read table[name] ── synth.triggerAttack(Hz)
 MIDI in ─┼─► note name ──────┤
 MIDI file┘                    └── onKeyUp(name) ──── synth.triggerRelease(stored Hz)
                                                      └─ mode.modify(last, current, table)
                                                         last = current
```

## Inputs

All four sources end in `onKeyDown(name)` and `onKeyUp(name)`. None of them pass velocity.

| Source | Code | What is read | Notes |
| --- | --- | --- | --- |
| On-screen keys | `src/_components/Keyboard.tsx` | Pointer down, up, cancel, leave | 88 keys, A0 to C8, in two rows. Only one pointer is tracked, so multi-touch can leave a note stuck. |
| Computer keyboard | `src/_hooks/useQwertyInput.ts`, `src/_lib/_data/qwertyMap.ts` | `keydown` and `keyup` | Off by default. `a w s e d f t g y h u j k o l p ;` play C to E an octave and a bit. `z` and `x` change octave (0 to 8, starting at 2). |
| MIDI controller | `src/_hooks/useMidiController.ts` | Note number and on/off only | Velocity, sustain pedal (CC64), pitch bend and other CCs are ignored. |
| MIDI file | `src/_hooks/useMidiUploader.ts`, `src/_hooks/useMidiPlayback.ts` | Note name, start time, duration of track 0 | Only the first track plays. Pause and Stop release every sounding note, which also runs the mode on each one. |

**MIDI controller octave bug.** `getKeys` numbers keys as `24 + octave * 12 + pitch` (`src/_utils/keys/keyboardSetup.ts:78`), which makes C4 = 72 instead of the standard 60. A hardware key therefore plays the app key one octave lower, the bottom octave of a real piano (MIDI 21 to 32) does nothing, and the top octave of the app cannot be reached. MIDI file playback uses standard names, so it is in the right octave.

## Outputs

### Sound

| Part | Code | Settings |
| --- | --- | --- |
| Synth | `src/_hooks/audioHooks/useSynth.ts` | `Tone.PolySynth(Tone.Synth)` with Tone's defaults: triangle wave, envelope 0.005 / 0.1 / 0.3 / 1, up to 32 voices. Every note at full velocity. |
| Reverb | `src/_hooks/audioHooks/audioEffectHooks/useReverbEffect.ts` | Decay 5 s, pre-delay 0.01 s, wet 1 |
| Vibrato | `src/_hooks/audioHooks/audioEffectHooks/useVibratoEffect.ts` | Frequency 5 Hz, depth 0.1, wet shown as 0 |
| Routing | `src/_hooks/audioHooks/useConnectEffects.ts` | The synth feeds the reverb and the vibrato side by side and both go to the speakers. |

In practice the default sound is the dry synth (through the vibrato at wet 0) plus a fully wet reverb. The vibrato only becomes audible when its Wet control is raised.

### How a note's pitch is chosen

1. `onKeyDown(name)` reads `table[name]` and calls `triggerAttack(Hz)`.
2. The frequency is stored with the note (`src/_hooks/audioHooks/useHertzPlayback.ts`).
3. `onKeyUp(name)` releases that stored frequency, not the table's current value.

So a note that is already sounding never changes pitch. Only the next press of a key hears the new value.

### Visuals and MIDI

- The keys light up while they sound. There is no display of how far each key has drifted.
- No MIDI is sent anywhere.

## State and how it changes over time

### What is held

| State | Where | Starts as | Changed by |
| --- | --- | --- | --- |
| Pitch table: 88 frequencies, keyed `"A0"` to `"C8"` | `useKeyboard.ts:48` | Equal temperament, A4 = 440 Hz | Each release (via the mode), Reset, changing mode |
| Last released key | `useKeyboard.ts:51` | Empty | Each release. Never cleared, not even by Reset. |
| Current mode | `src/_hooks/useMode.ts:42` | Swap | Mode picker |
| Mode settings (Gravity strength, Move semitones) | Shared objects in `src/_lib/_data/modes/index.ts` | 2 and 1 | Their knobs. Kept when you switch mode and back. |
| Sounding notes | `useHertzPlayback.ts:76` | Empty | Press and release |

Nothing is saved. Reloading the page starts again from concert pitch.

### What happens on each release

Modes only act on release. Pressing a key never changes the table.

```
onKeyUp(current):
    release the sound of current
    if last is empty: last = current      // first release ever
    mode.modify(last, current, table)
    last = current
```

The mode runs even if the note was not actually sounding, for example before audio has started or when a MIDI file is paused.

### The three modes

`last` is the key released before this one, and `current` is the key just released.

| Mode | Rule | Setting |
| --- | --- | --- |
| Swap (`swap.ts`) | If last differs from current, swap `table[last]` and `table[current]`. | None |
| Gravity (`gravity.ts`) | If last differs from current, `table[last] = table[last] - (table[last] - table[current]) / (10 - strength)`. The previous key is pulled towards the one just released. | Strength 1 to 10, step 0.1, default 2 |
| Move (`move.ts`) | `table[current] = table[current] * 2^(semitones / 12)`. Ignores last, so it also acts on the first release. | Semitones -2 to 2, step 1, default 1 |

Edge cases:

- **Gravity** moves 1/9 of the gap at strength 1 and 1/8 at the default of 2. At 9 it lands exactly on the current key. Above 9 it overshoots, and at 10 it divides by zero, giving infinity or NaN. The knob can reach 10.
- **Move** has no limit. Releasing the same key again and again keeps pushing it further, past the top of hearing or down towards 0 Hz.
- **Out-of-range keys** (computer keyboard at octave 0 or 8, MIDI file notes outside A0 to C8) look up an undefined frequency, and Swap or Gravity can copy that into real keys.

### Worked examples

Starting from concert pitch each time, playing and releasing one key at a time:

**Swap**
1. Release A4. First release, nothing changes.
2. Release C5. Swap A4 and C5: A4 = 523.25 Hz, C5 = 440 Hz.
3. Press A4: it sounds at 523.25 Hz (a C). Release it: last is C5, so they swap back.

**Gravity, strength 2**
1. Release A4. Nothing changes.
2. Release C5 (523.25). A4 = 440 - (440 - 523.25) / 8 = 450.41 Hz.
3. Release A4 (now 450.41). C5 = 523.25 - (523.25 - 450.41) / 8 = 514.15 Hz.

**Move, +1 semitone**
1. Release A4. A4 = 466.16 Hz (B flat).
2. Release A4 again. A4 = 493.88 Hz (B).

### Reset and changing mode

- Choosing a mode resets the table to concert pitch.
- The Reset button resets the table without changing mode.
- Neither clears the last released key, the mode settings or any sounding notes. So the first release after a reset can already Swap or Gravity against a key from before the reset.

## Options in the window

| Panel | Control | Range | Default |
| --- | --- | --- | --- |
| Inputs | Computer keyboard on/off | | Off |
| Inputs | MIDI controller | Connected devices | None |
| MIDI | Upload, Play, Pause, Stop | | Stopped |
| Modes | Mode | Swap, Gravity, Move | Swap |
| Modes | Reset | | |
| Modes | Gravity Strength | 1 to 10, step 0.1 | 2 |
| Modes | Move Semitones | -2 to 2, step 1 | 1 |
| Reverb | Decay | 0.01 to 10 s | 5 |
| Reverb | Pre-Delay | 0.01 to 10 s | 0.01 |
| Reverb | Wet | 0 to 1 | 1 |
| Vibrato | Frequency | 1 to 100 Hz | 5 |
| Vibrato | Depth | 0 to 1 | 0.1 |
| Vibrato | Wet | 0 to 1 | 0 |
| Synth | Volume | -60 to 0 dB | 0 |

## Other bugs found while reading

These matter less for Ableton but are worth knowing:

- The last MIDI controller event can fire again when the page re-renders for unrelated reasons (for example toggling the computer keyboard). That can stack a duplicate note or apply Move twice.
- After Pause, playback restarts from the beginning. Stop resets the position but never stops Tone's transport, so playback may start again.
- Changing octave with `z` or `x` while holding a computer key releases a different note, leaving the first one stuck.
- Every control pushes its value into Tone again on each re-render, so the reverb's impulse response is rebuilt more often than needed.

## What Ableton already provides

| Web app part | In Ableton |
| --- | --- |
| On-screen keys, computer keyboard, MIDI controller input | Ableton's MIDI tracks, Computer MIDI Keyboard and controller setup |
| MIDI file upload and playback | MIDI clips and the arrangement |
| Synth | Any instrument the user picks |
| Reverb, vibrato, volume | Ableton's audio effects and mixer |
| **Pitch table, modes and release rules** | **Nothing. This is what the plugin has to add.** |
