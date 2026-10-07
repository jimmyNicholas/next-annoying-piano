# Spec: The Annoying Piano as a VST

## Goal

Turn The Annoying Piano (TAP) web app into a plugin for Ableton Live 12 (Suite, on a Mac) that retunes notes as you play and sends them on to any Ableton instrument. It should keep TAP's core idea: every key you release changes the pitch of keys you play later.

TAP makes no sound itself. Ableton's instruments and effects (Grand Piano, Wavetable, Drift, Reverb and so on) provide the sound.

## Background

The web app is Next.js plus Tone.js. The parts that matter for a plugin:

| Web app | Where | Plugin equivalent |
| --- | --- | --- |
| Pitch table, one frequency per key | `src/_utils/hertzHelpers.ts`, `src/_hooks/useKeyboard.ts` | Plain C++ engine with 128 MIDI notes |
| Swap, Gravity, Move modes | `src/_lib/_data/modes/` | Same rules in C++, applied on note off |
| Mode settings (strength, semitones) | Mode `modifiers` | Host-automatable parameters |
| `Tone.PolySynth(Tone.Synth)` | `src/_hooks/audioHooks/useSynth.ts` | Any Ableton instrument, fed by TAP's MIDI output |
| Vibrato, Reverb | `src/_hooks/audioHooks/audioEffectHooks/` | Ableton's own effects |
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
## How pitch reaches Ableton

A MIDI note can only be a whole semitone, but Gravity creates pitches in between. TAP uses **MPE** (MIDI Polyphonic Expression) to send them:

- Each note gets its own MIDI channel (channels 2 to 16, so up to 15 notes at once; channel 1 carries pedal and other shared messages).
- TAP sends the nearest whole note plus a pitch bend on that note's channel to reach the exact frequency. The bend range is 48 semitones, the MPE default.
- In Live 12 every Ableton instrument supports MPE.

A second **semitone mode** sends plain MIDI on one channel with each pitch rounded to the nearest semitone, for instruments without MPE. Swap and Move are exact in this mode; Gravity is rounded.

### Routing in Ableton

Ableton does not let third-party plugins sit in the MIDI effect slot, so TAP is set up like this:

1. **Track 1:** TAP. Your MIDI keyboard or MIDI clips go here.
2. **Track 2:** the Ableton instrument. Set "MIDI From" to Track 1, then "The Annoying Piano", and arm or monitor the track. For MPE, turn on MPE for that input.

Whether MPE survives this track to track routing is the biggest unknown, so ticket 02 proves it before anything else is built. If it fails, the fallbacks are semitone mode or a Max for Live version (you have Suite).

## Deliberate changes from the web app

- **Gravity at strength 10:** the web formula divides by zero. The plugin pulls the key exactly onto the current key's pitch instead.
- **Key range:** the full MIDI range of 0 to 127, not just the 88 keys from A0 to C8. The on-screen keyboard still shows the 88 keys.
- **Reset button:** a new way to put every key back to concert pitch without changing mode.
- **Velocity:** passed through to the instrument. The web app played every note at full volume.
- **Sound:** comes from Ableton, so the web app's synth, vibrato and reverb are not rebuilt.

## Technical approach

- **Framework:** JUCE 8, built with CMake. JUCE is downloaded at configure time.
- **Platform:** macOS. Windows is out of scope for now.
- **Formats:** VST3 and AU, registered as an instrument with MIDI output so Ableton can route from it. It outputs silent audio.
- **Builds:** a GitHub Actions workflow builds the Mac version on every push, from ticket 01 onwards, so each stage can be downloaded and tested without a local C++ toolchain.
- **Code layout:** the pitch engine has no JUCE dependency, so it can be unit tested on its own. The JUCE layer turns incoming MIDI into retuned MPE output and adds the parameters and the editor.
- **Threads:** all pitch state lives on the audio thread. The editor only reads a copy that is published each audio block.
- **Location:** a new `plugin/` folder alongside the web app, which stays as it is.

## Prototype rule

Every ticket ends in a prototype you can try in Ableton, or a test you can run from the command line. Each ticket is one commit (or a few small ones) on `claude/codebase-vst-ableton-puxbqz`.

## Decisions

1. **Output:** TAP sends retuned MIDI (MPE) to Ableton instruments instead of having its own synth (option B).
2. **Velocity:** passed through.
3. **Platform:** Ableton Live 12 Suite on a Mac. Builds come from GitHub Actions (set up in ticket 01).
4. **Sustain pedal:** a key counts as released when the pedal lifts, not when the finger lifts.
5. **Draft code:** the uncommitted draft in `plugin/` is reused ticket by ticket, but only after each piece has been reviewed. Its synth and effects code is parked.

## Testing each stage

After every ticket, the person testing downloads that push's Mac build from GitHub Actions and checks the ticket's prototype in Ableton before the next ticket starts.

## Tickets

| # | Ticket | Prototype |
| --- | --- | --- |
| 01 | [Scaffold, Mac build, MIDI pass-through](tickets/01-scaffold-and-routing.md) | Play through TAP into an Ableton instrument |
| 02 | [MPE output spike](tickets/02-mpe-spike.md) | Detuned notes heard in Wavetable or Drift |
| 03 | [Pitch engine and Swap](tickets/03-pitch-engine-swap.md) | First annoying behaviour |
| 04 | [Gravity, Move, mode parameter](tickets/04-gravity-move-modes.md) | All three modes, automatable |
| 05 | [Semitone mode and saving](tickets/05-semitone-mode-and-state.md) | Works with non-MPE instruments; settings survive reopening |
| 06 | [Plugin window](tickets/06-editor-controls.md) | TAP's own controls |
| 07 | [Keyboard and drift view](tickets/07-keyboard-and-detune-view.md) | Mouse play and visible drift |
| 08 | [CI tests and release](tickets/08-ci-tests-and-release.md) | Tagged Mac release |

## Out of scope for now

- A built-in synth and effects for using TAP without Ableton instruments (the draft code for these is parked).
- Loading MIDI files inside the plugin.
- Saving the retuned pitch table with the Ableton set. The table resets when a set is reopened.
- Windows builds.
