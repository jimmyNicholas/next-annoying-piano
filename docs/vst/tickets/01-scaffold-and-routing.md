# 01: Scaffold, Mac build and MIDI pass-through

**Goal:** a plugin that loads in Ableton and passes MIDI on unchanged, proving the routing works.

## Tasks
- Add `plugin/CMakeLists.txt`, which downloads JUCE 8 and builds VST3 and AU.
- Register it as an instrument with MIDI input and output, outputting silent audio.
- Pass incoming MIDI straight to the output.
- Add a GitHub Actions workflow that builds on macOS and uploads the VST3 and AU as a downloadable artifact.
- Add `plugin/build/` to `.gitignore`.
- Add `plugin/README.md` with where to copy each format, how to clear the quarantine flag on an unsigned build (`xattr -dr com.apple.quarantine`), how to rescan plugins, and the two-track routing setup.

## Prototype
Download the Mac build. Put TAP on Track 1 and an Ableton instrument on Track 2 with "MIDI From" set to TAP. Playing Track 1 sounds through Track 2.

## Done when
- The macOS GitHub Actions build is green and produces a download.
- The routing works in Ableton with no stuck notes.
