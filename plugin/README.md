# The Annoying Piano: Ableton plugin

A VST3 plugin for Ableton Live 11 or later on a Mac. TAP makes no sound of its own: it retunes the notes you play and sends them on to any Ableton instrument. See [`docs/vst/SPEC.md`](../docs/vst/SPEC.md) for the plan.

At this stage (ticket 02) TAP sends every note on its own MIDI channel with its own pitch bend (MPE), and a temporary **Detune** control shifts the black keys. It exists to prove that per-note pitch reaches Ableton's instruments.

## Get a build

1. On GitHub, open **Actions**, then **Plugin (macOS)**, then the latest run for this branch.
2. Download **TheAnnoyingPiano-macOS** from the bottom of the run page and unzip it, then unzip `The Annoying Piano VST3.zip` inside it.

## Install

1. Copy `The Annoying Piano.vst3` to `~/Library/Audio/Plug-Ins/VST3/`. (In Finder, press Cmd+Shift+G and paste that path.)
2. The build is not signed by an Apple developer, so macOS blocks it until you clear the download flag. In Terminal:
   ```
   xattr -dr com.apple.quarantine ~/Library/Audio/Plug-Ins/VST3/"The Annoying Piano.vst3"
   ```
3. In Ableton, open **Preferences** (Cmd+comma; called **Settings** in Live 12), then **Plug-Ins**. Turn on **Use VST3 Plug-In System Folders** and click **Rescan**.

## Set up in Ableton

TAP goes on one track and your instrument on another, because Ableton does not let third-party plugins sit in the MIDI effect slot.

1. **Track 1:** drag **The Annoying Piano** (under Plug-Ins, VST3) onto a new MIDI track. Arm it so it receives your MIDI keyboard or computer keyboard.
2. **Track 2:** a new MIDI track with any Ableton instrument, for example Wavetable.
3. On Track 2, set **MIDI From** to **1-MIDI** (Track 1's name), and in the box under it choose **The Annoying Piano**.
4. Set Track 2's **Monitor** to **In**.

Play on Track 1 and you should hear Track 2's instrument.

If you cannot see the MIDI From section, turn on **View**, then **In/Out**.

## Test the MPE route (ticket 02)

Use an instrument that supports MPE in Live 11: **Wavetable** or **Sampler**.

1. Set up the two tracks as above, with Wavetable on Track 2.
2. If Track 2's input or Wavetable offers an **MPE** option, turn it on. In Live 11 it may be in the device's right-click menu or next to the MIDI From choice.
3. Open TAP's window on Track 1. Set **Detune Keys** to **Black keys only** and **Detune** to **+50** cents.
4. Play a white key: it should be in tune.
5. Play a black key: it should be a quarter tone sharp.
6. **The real test:** hold a white key, then add a black key. The white key must stay in tune. If it jumps in pitch when the black key starts, each note is not getting its own pitch.
7. Also try a big chord of more than 15 notes with the sustain pedal, then let go. No notes should stay stuck.

Note what happens with MPE turned on and off on Track 2, if that option exists.

## Build it yourself

You need Xcode's command line tools and CMake (`brew install cmake`).

```
cmake -S plugin -B plugin/build -DCMAKE_BUILD_TYPE=Release
cmake --build plugin/build --config Release
```

The plugin ends up in `plugin/build/TheAnnoyingPiano_artefacts/Release/VST3/`. The first configure downloads JUCE, which takes a minute.
