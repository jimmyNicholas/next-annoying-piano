# The Annoying Piano: Ableton plugin

A VST3 plugin for Ableton Live 11 or later on a Mac. TAP makes no sound of its own: it retunes the notes you play and sends them on to any Ableton instrument. See [`docs/vst/SPEC.md`](../docs/vst/SPEC.md) for the plan.

At this stage (ticket 01) TAP passes notes through unchanged. It exists to prove the build and the Ableton routing work.

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

## Build it yourself

You need Xcode's command line tools and CMake (`brew install cmake`).

```
cmake -S plugin -B plugin/build -DCMAKE_BUILD_TYPE=Release
cmake --build plugin/build --config Release
```

The plugin ends up in `plugin/build/TheAnnoyingPiano_artefacts/Release/VST3/`. The first configure downloads JUCE, which takes a minute.
