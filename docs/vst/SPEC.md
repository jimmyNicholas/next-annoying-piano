# Spec: The Annoying Piano as a VST

## Goal

Turn The Annoying Piano (TAP) web app into an instrument plugin that loads in Ableton Live. It should keep TAP's core idea: every key you release changes the pitch of keys you play later.

## Background

The web app is Next.js plus Tone.js. The parts that matter for a plugin:

| Web app | Where | Plugin equivalent |
| --- | --- | --- |
| Pitch table, one frequency per key | `src/_utils/hertzHelpers.ts`, `src/_hooks/useKeyboard.ts` | Plain C++ engine with 128 MIDI notes |
| Swap, Gravity, Move modes | `src/_lib/_data/modes/` | Same rules in C++, applied on note off |
| Mode settings (strength, semitones) | Mode `modifiers` | Host-automatable parameters |
| `Tone.PolySynth(Tone.Synth)` | `src/_hooks/audioHooks/useSynth.ts` | Polyphonic triangle synth, same envelope |
| Vibrato, Reverb | `src/_hooks/audioHooks/audioEffectHooks/` | C++ effects, same parameters |
| Mouse keyboard | `src/_components/Keyboard.tsx` | On-screen keyboard in the plugin window |
| QWERTY input, MIDI controller | `useQwertyInput.ts`, `useMidiController.ts` | Not needed: Ableton supplies MIDI |
| MIDI file upload and playback | `useMidiUploader.ts`, `useMidiPlayback.ts` | Not needed: use Ableton MIDI clips |

## Behaviour to keep

1. Every key starts at concert pitch (A4 = 440 Hz, equal temperament).
2. Pressing a key plays the frequency stored for that key. The pitch of a sounding note does not change while it is held.
3. Releasing a key applies the current mode, using the key just released (current) and the key released before it (last):
   - **Swap:** swap the stored pitches of last and current.
   - **Gravity:** `last = last - (last - current) / (10 - strength)`. Strength runs 1 to 10, default 2.
   - **Move:** shift current by N semitones, N from -2 to 2, default 1.
4. On the very first release, last equals current, so Swap and Gravity do nothing.
   - **Sustain pedal:** while the pedal is down, released keys are queued. When the pedal lifts, the mode is applied to each queued key in the order the keys were released.
5. Changing mode resets every key to concert pitch.
6. The synth feeds the vibrato and the reverb side by side and their outputs are added together. There is no separate dry signal.

## Deliberate changes from the web app

- **Gravity at strength 10:** the web formula divides by zero. The plugin pulls the key exactly onto the current key's pitch instead.
- **Reverb pre-delay:** capped at 1 s instead of 10 s, to keep the reverb light on the CPU.
- **Key range:** the full MIDI range of 0 to 127, not just the 88 keys from A0 to C8. The on-screen keyboard still shows the 88 keys.
- **Reset button:** a new way to put every key back to concert pitch without changing mode.
- **Velocity:** notes respond to how hard the key is hit. The web app played every note at full volume.

## Technical approach

- **Framework:** JUCE 8, built with CMake. JUCE is downloaded at configure time.
- **Platform:** macOS first. Windows is out of scope for now.
- **Formats:** VST3 and AU for Ableton, plus a standalone app. All three come from the same build, so the standalone costs nothing extra and is the quickest way to test a stage without opening Ableton.
- **Builds:** a GitHub Actions workflow builds the Mac version on every push, from ticket 01 onwards, so each stage can be downloaded and tested without a local C++ toolchain.
- **Code layout:** the pitch engine has no JUCE dependency, so it can be unit tested on its own. The JUCE layer adds the synth, the effects, the parameters and the editor.
- **Threads:** all pitch state lives on the audio thread. The editor only reads a copy that is published each audio block.
- **Location:** a new `plugin/` folder alongside the web app, which stays as it is.

## Prototype rule

Every ticket ends in a prototype you can run: the standalone app, the plugin loaded in Ableton, or a test you can run from the command line. Each ticket is one commit (or a few small ones) on `claude/codebase-vst-ableton-puxbqz`.

## Decisions

1. **Velocity:** yes, notes respond to velocity.
2. **Platform:** Mac. Builds come from GitHub Actions (set up in ticket 01) so each stage can be tested in Ableton.
3. **Sustain pedal:** a key counts as released when the pedal lifts, not when the finger lifts.
4. **Draft code:** the uncommitted draft in `plugin/` is reused ticket by ticket, but only after each piece has been reviewed.

## Testing each stage

After every ticket, the person testing downloads that push's Mac build from GitHub Actions and checks the ticket's prototype in Ableton or the standalone app before the next ticket starts.

## Tickets

| # | Ticket | Prototype |
| --- | --- | --- |
| 01 | [Scaffold and Mac build](tickets/01-scaffold.md) | Empty plugin shows up in Ableton |
| 02 | [Plain synth](tickets/02-plain-synth.md) | Ordinary in-tune synth |
| 03 | [Pitch engine and Swap](tickets/03-pitch-engine-swap.md) | First annoying behaviour |
| 04 | [Gravity, Move, mode parameter](tickets/04-gravity-move-modes.md) | All three modes, automatable |
| 05 | [Volume and saving](tickets/05-volume-and-state.md) | Settings survive reopening a set |
| 06 | [Vibrato](tickets/06-vibrato.md) | Audible wobble |
| 07 | [Reverb](tickets/07-reverb.md) | Full web app sound |
| 08 | [Plugin window](tickets/08-editor-controls.md) | TAP's own controls |
| 09 | [Keyboard and drift view](tickets/09-keyboard-and-detune-view.md) | Mouse play and visible drift |
| 10 | [CI tests and release](tickets/10-ci-tests-and-release.md) | Tagged Mac release |

## Out of scope for now

- Loading MIDI files inside the plugin.
- Saving the retuned pitch table with the Ableton set. The table resets when a set is reopened.
- Sample-based piano sounds.
- Windows builds.
