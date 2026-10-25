# 08: Automated tests in CI and a release build

**Goal:** confidence that each push still works, and a tidy build to keep.

## Tasks
- Run the unit tests and a headless test (send notes in, check the MIDI that comes out) in the macOS GitHub Actions workflow.
- Produce a universal (Apple silicon and Intel) release build.
- Look into code signing and notarisation so macOS stops blocking the plugin. This needs an Apple Developer account, so it may stay manual.

## Prototype
A tagged release on GitHub with a Mac download that installs without extra steps (or with documented ones if unsigned).

## Done when
- CI runs the tests and is green.
- The README install steps work on your Mac.
