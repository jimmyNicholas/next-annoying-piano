# Research: plugins, MIDI and tuning in Ableton Live 12

Researched October 2026. Some Ableton, ODDSound and Cycling '74 pages could only be read as search excerpts, so claims marked **(unconfirmed)** should be checked in Ableton before we rely on them.

## The question

Ableton already handles MIDI input, recording, playback, instruments and effects. So the plugin only needs to do one thing: make each key sound at the pitch the TAP pitch table holds for it, on whatever instrument the user has chosen. Those pitches are arbitrary frequencies (not semitones) that change as you play.

That splits into two problems:

1. **Where can our code sit** so it sees the notes before the instrument does?
2. **How do we tell the instrument the exact pitch** of each note?

## 1. Where the code can sit

| Option | Same track as the instrument? | Works with | Catch |
| --- | --- | --- | --- |
| Third-party MIDI effect plugin (VST3 or AU) in the MIDI effect slot | n/a | Nothing | **Ableton does not support this.** Live will not load AU MIDI processors, VST3 has no real MIDI effect type, and a JUCE "MIDI effect" build either fails to load or cannot sit before an instrument. |
| **Max for Live MIDI effect** | Yes | Any instrument, Ableton's own or third-party | Needs Live Suite, or Standard with the Max for Live add-on. |
| **VST3 plugin built as an instrument that outputs MIDI** | No. It goes on its own track, and the instrument's track uses "MIDI From" to listen to it. | Any instrument | Two tracks per instrument and a manual routing step. Only VST3 (not AU) can send MIDI out in Live. Some reports of timing quirks **(unconfirmed)**. |
| Our plugin hosts the user's plugin inside itself | Yes | Third-party plugins only | Cannot host Ableton's own instruments, and building a plugin host is a large job. |

## 2. How to give the instrument an exact pitch

| Method | How it works | Accuracy | Instruments | Verdict |
| --- | --- | --- | --- | --- |
| **MPE** | Each note gets its own MIDI channel, so each note can have its own pitch bend. We send the bend for that key just before its note on. | About 0.6 cents with a ±48 semitone bend range. Plenty. | **Every Ableton 12 instrument** (Wavetable, Drift, Meld, Simpler, Sampler, Analog, Electric and more), plus third-party plugins with MPE switched on. | **Best general route.** |
| **MTS-ESP** (ODDSound) | One "master" plugin publishes a table of 128 frequencies. Every supporting synth in the set reads it. | Exact | Surge XT, Serum, u-he, Arturia (V Collection, Pigments), TAL and others. **Not** Ableton's own instruments. | Ideal for synths that support it. Matches TAP's 128-frequency table exactly. |
| Ableton 12 Tuning Systems | Live retunes its instruments from a loaded tuning file. | Cents | Ableton's own instruments, plus MPE plugins | Not suitable. Built around repeating scales, and reports say setting it from code fails. |
| MIDI Tuning Standard (SysEx) | Sends a tuning table as SysEx | Exact | None in Live | Not possible. Live filters SysEx out. |
| Plain pitch bend on one channel | One bend for the whole instrument | | | Not possible for chords. Every note would move together. |

### MPE details that matter for TAP

- **15 notes at once.** MPE gives each sounding note its own channel, and there are 15. A 16th note has to steal a channel. With the sustain pedal held, notes pile up fast.
- **Release tails.** A note keeps sounding after its key lifts (its release). If its channel is reused for a new note with a different bend, the tail jumps in pitch. Reusing the channel that has been free the longest makes this rare.
- **Held notes keep their pitch.** This matches the web app: the bend is set once at note on and not changed while the note sounds.
- **Setup for third-party instruments.** The user must switch MPE on for that plugin in Ableton and set its pitch bend range to 48 semitones. Ableton's own instruments need no setup.
- **Sustain pedal.** In MPE, CC64 goes on the main channel and covers every note. We pass it through, and we also track it ourselves for TAP's release rules.

### MTS-ESP details that matter for TAP

- Free to use (ISC-style licence). We would include ODDSound's small master library.
- Needs `libMTS.dylib` installed in `/Library/Application Support/MTS-ESP`. ODDSound provides an installer.
- Only one master per Live set.
- No voice limit and no pitch bend setup. Supporting synths follow the table on their own.
- Use MTS-ESP **or** MPE on a given synth, never both, or the pitch is shifted twice.

## 3. Things Ableton gives us for free

| Need | Provided by Ableton |
| --- | --- |
| Playing notes | MIDI controllers, the Computer MIDI Keyboard, the piano roll |
| Playback | MIDI clips and the arrangement |
| Sound | Any instrument |
| Reverb, vibrato, volume | Ableton's audio effects and mixer |
| Saving settings | Device parameters are saved with the Live set |
| Automation | Device parameters can be automated |

So the old tickets 02 (synth), 06 (vibrato) and 07 (reverb), the volume half of 05, and the on-screen keyboard in 09 are no longer needed.

## 4. New things to think about

- **Playback is not repeatable by default.** TAP's pitches depend on every key released before. Playing the same clip twice gives different pitches unless the table is reset first. An option to reset when the transport starts would make playback repeatable.
- **Our code must forward everything else.** Sustain pedal, mod wheel, aftertouch and so on have to pass through to the instrument.
- **Velocity comes for free.** We pass it through, and the instrument handles it.

## 5. Options for the build

| | A. Max for Live device | B. JUCE VST3 with MIDI From | C. Both, sharing one engine |
| --- | --- | --- | --- |
| Setup in Ableton | Drop it before any instrument | Two tracks and a routing step | Either |
| Needs | Live Suite, or the Max for Live add-on | Any Live edition | |
| Ableton's instruments | Yes, through MPE | Yes, through MPE | Yes |
| MTS-ESP | Needs a custom Max external **(unconfirmed)** | Straightforward | Through the VST3 |
| Other DAWs | No | Yes | Yes |
| Existing code | Engine written again in JavaScript, which can copy the web app's mode code | Reuses the draft `plugin/` engine, but the synth and effects are dropped | Engine in two languages, or one C++ engine with a Max wrapper |
| Testing without Ableton | Hard | Standalone app and unit tests | |

## Sources

- Using AU and VST plugins on macOS: https://help.ableton.com/hc/en-us/articles/209068929-Using-AU-and-VST-plug-ins-on-macOS
- MIDI output of a VST plugin: https://help.ableton.com/hc/en-us/articles/209070189-Accessing-the-MIDI-output-of-a-VST-plug-in
- MPE in Live FAQ: https://help.ableton.com/hc/en-us/articles/360019144999-MPE-in-Live-FAQ
- Live 11 release notes (plugin MPE output): https://www.ableton.com/en/release-notes/live-11/
- Live 12 release notes: https://www.ableton.com/en/release-notes/live-12/
- Tuning Systems: https://www.ableton.com/en/live-manual/12/using-tuning-systems/ and https://help.ableton.com/hc/en-us/articles/11535414344476-Tuning-Systems-FAQ
- SysEx support: https://help.ableton.com/hc/en-us/articles/360003148640-SysEx-support
- Max for Live editions: https://help.ableton.com/hc/en-us/articles/206407124
- Max for Live MPE devices: https://www.ableton.com/en/live-manual/11/max-for-live-devices/
- MTS-ESP library and licence: https://github.com/ODDSound/MTS-ESP
- MTS-ESP supporting synths: https://oddsound.com/usingmtsesp.php
- MTS-ESP MIDI Client manual (Live cannot put a MIDI plugin before an instrument): https://oddsound.com/dl/ODDSound_MTS_ESP_Suite_MIDI_Client_Manual.pdf
- JUCE VST3 MIDI effects in Live: https://forum.juce.com/t/vst3-midi-plugins-wont-load-in-ableton-live/36323
- JUCE MPE output: `modules/juce_audio_basics/mpe/juce_MPEMessages.h` and `juce_MPEUtils.h` in the JUCE repo
- Tuning System API setters failing: https://github.com/user1303836/kumi/issues/206
