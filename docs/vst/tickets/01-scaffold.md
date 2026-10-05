# 01: Scaffold an empty instrument plugin

**Goal:** a JUCE plugin that builds and loads, with no sound yet.

## Tasks
- Add `plugin/CMakeLists.txt`, which downloads JUCE 8 and builds VST3, AU and a standalone app.
- Make a processor that outputs silence and accepts MIDI.
- Show JUCE's default (generic) editor window.
- Add `plugin/build/` to `.gitignore`.
- Add a GitHub Actions workflow that builds on macOS and uploads the VST3, AU and standalone app as a downloadable artifact.
- Add `plugin/README.md` with build steps, where to copy each format on a Mac, how to clear the quarantine flag on an unsigned build (`xattr -dr com.apple.quarantine`), and how to rescan plugins in Ableton.

## Prototype
Download the Mac build from GitHub Actions. The standalone app opens, and Ableton lists "The Annoying Piano" as an instrument.

## Done when
- `cmake --build` succeeds with no warnings from our code.
- The macOS GitHub Actions build is green and produces a download.
- The plugin loads in Ableton or the standalone app without crashing.
