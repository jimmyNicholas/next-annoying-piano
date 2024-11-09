# The Annoying Piano
A web based piano that changes pitch as you play it.

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://annoying-piano.vercel.app/)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## Overview
TAP is an experimental digital piano that dynamically alters pitch during performance, creating emergent compositions through real-time note manipulation. This instrument challenges traditional piano paradigms by introducing controlled unpredictability into the playing experience, enabling musicians and sound artists to explore new territories of non-idiomatic improvisation and algorithmic composition.

### Key Features
- Supports mouse, keyboard and external MIDI controller inputs
- Supports MIDI file upload and playback
- Has a choice of dynamic ways to alter the pitch
    - Swap
    - Gravity
    - Move
- Provides a range of modifiable effects 

### Built With
- Frontend: React, TailwindCSS
- Backend: Next.JS
- Web Audio framework: Tone.js
- Other Tools:
    - Midi File Parsing: tonejs/midi
    - Midi Controller: react-midi/hooks
    - Icons: Hero Icons, React Icons