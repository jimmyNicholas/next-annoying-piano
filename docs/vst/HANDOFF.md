# Handoff: TAP VST for Ableton

Last updated 2026-10-07. Branch: `claude/codebase-vst-ableton-puxbqz`.

## Goal

Turn The Annoying Piano web app into a VST3 that retunes notes as you play and sends them to Ableton instruments (MPE for in-between pitches). Full plan: [`SPEC.md`](SPEC.md), tickets in [`tickets/`](tickets/).

## Where we are

| Ticket | State |
| --- | --- |
| 01 Scaffold, Mac build, MIDI pass-through | **Built and pushed. Waiting for the user to test in Ableton.** |
| 02 MPE output spike | Next. Do not start until 01 is confirmed. |
| 03 to 08 | Not started |

Latest green Mac build: GitHub Actions run 37565464015, artifact `TheAnnoyingPiano-macOS` (universal, ad hoc signed VST3).

## The user's setup

- Ableton **Live 11 Suite** (not 12) on an **Intel Mac, macOS 13.7.8**. Settings are under Preferences.
- MPE in Live 11: Wavetable, Sampler, Simpler, and from 11.3 also Drift, Analog, Collision, Tension and Electric. Not Operator. Use **Wavetable** for testing.
- Uses Cursor locally. No cmake installed (not needed when using the CI build).
- Their local `main` checkout had an untracked `plugin/` folder and an older Intel-only local build installed. They were told to move it aside, switch to this branch and install the CI build. Confirm `diagnose.sh` (see below) shows `x86_64 arm64` before trusting any test result.

## Decisions (do not reopen without the user)

- Option B: TAP sends MIDI/MPE to Ableton instruments. No built-in synth or effects.
- VST3 only. Live only accepts MIDI output from VST3, not AU.
- Velocity passes through. A key held by the sustain pedal counts as released when the pedal lifts.
- Work in small tickets. Each ends in something testable in Ableton. The user tests after every ticket.
- Draft code is reused only after review. The parked synth draft lives in git history at commit `89272e4` (`plugin/Source/core/TapEngine.*` has the ported modes and tests, worth reusing in ticket 03).

## Open risks

1. **Does Live 11 accept VST3 MIDI output through "MIDI From"?** Researched for Live 12 only. Ticket 01's test answers it. Fallback: Max for Live (the user has Suite).
2. **Does MPE survive the MIDI From routing?** Ticket 02 exists to answer this. Fallback: semitone mode (ticket 05) or Max for Live.

## Known issues, not ours

- **Vercel** fails on every commit on this branch, including docs-only commits. `npm run build` passes locally on Node 22, so it is a Vercel project setting (likely Node version or the Cypress binary download). The user has not shared the Vercel log yet. An optional fix is a `vercel.json` `ignoreCommand` to skip builds when only `plugin/` or `docs/` change. Do not merge to `main` yet: that would redeploy the live web app.
- **PR #57** was opened and closed by an earlier run of this session. There is no open PR. Do not open one unless asked.

## Gotchas for the next session

- **Pushing:** needs the Claude GitHub App to have access to this repo. It was fixed on 2026-10-07. If a push gets a 403, the user must re-grant access at github.com/settings/installations.
- **Checking CI:** use the GitHub MCP tools (`actions_list`, `list_workflow_run_artifacts`). Polling the GitHub API with curl from the container returned nothing.
- **Local build in the container:** `cmake -S plugin -B plugin/build -G Ninja -DCMAKE_BUILD_TYPE=Release`. Linux needs ALSA, X11 and freetype dev packages (`libasound2-dev libx11-dev libxrandr-dev libxinerama-dev libxcursor-dev libxext-dev libfreetype-dev libfontconfig1-dev`).
- **Web app install in the container:** use `CYPRESS_INSTALL_BINARY=0 npm ci`, or the Cypress download fails.
- **Before pushing,** check `git log origin/<branch>..HEAD` so nothing unexpected goes up. Three commits from another run were pushed by accident once.
- **User preferences:** Australian spelling, no em dashes, small reviewable chunks, ask before big changes.

## Diagnostic

The user runs a read-only `diagnose.sh` in Cursor (not committed) that checks branch, tools, the installed VST3, quarantine flag, signature and architectures. Ask for its output when something does not load.

## Next steps

1. Get the user's ticket 01 result: TAP appears under **MIDI From** on Track 2, and playing Track 1 sounds Wavetable on Track 2 with no stuck notes.
2. If it works, start ticket 02 ([`tickets/02-mpe-spike.md`](tickets/02-mpe-spike.md)): per-note channels 2 to 16, a temporary Detune parameter, 48 semitone bend range, note off on the same channel.
3. If MIDI From does not list TAP in Live 11, stop and discuss the Max for Live fallback with the user before writing more C++.
