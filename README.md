# The Annoying Piano (TAP)

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/jimmyNicholas/next-annoying-piano)
[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://annoying-piano.vercel.app/)

## Overview

TAP (The Annoying Piano) is an experimental digital piano that dynamically alters pitch during performance, creating emergent compositions through real-time note manipulation. This instrument challenges traditional piano paradigms by introducing controlled unpredictability into the playing experience, enabling musicians and sound artists to explore new territories of non-idiomatic improvisation and algorithmic composition.

## Features

- Multi-input support:
  - Mouse interaction
  - Keyboard controls
  - External MIDI controller compatibility
  - MIDI file upload and playback
- Dynamic pitch alteration modes:
  - Swap: Exchange pitches between consecutive notes
  - Gravity: Apply weighted pitch attraction between notes
  - Move: Shift pitch by defined semitone intervals
- Customizable audio effects
- Real-time pitch manipulation

## Technical Stack

- **Frontend Framework**: React (^18.3.1)
- **Backend Framework**: Next.js (^14.2.13)
- **Styling**: TailwindCSS
- **Audio Engine**: Tone.js (^15.0.4)
- **Additional Dependencies**:
  - @heroicons/react: ^2.1.5
  - @react-midi/hooks: ^2.0.1
  - @tonejs/midi: ^2.0.28
  - react-icons: ^5.3.0

## Installation

1. Clone the repository:
```bash
git clone https://github.com/jimmyNicholas/next-annoying-piano.git
cd next-annoying-piano
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Usage Guide

### Input Methods

#### 1. Mouse Control
- Click and hold piano keys to play
- Release or move mouse to stop the note

#### 2. Keyboard Input
- Click the "Activate Keyboard" button to enable keyboard controls
- [Keyboard mapping image to be added]
- Special modifier keys available [Details to be added with image]

#### 3. MIDI Controller
1. Connect your MIDI controller via USB
2. Allow browser access when prompted
3. Select your MIDI device from the dropdown menu

#### 4. MIDI File Playback
- Supported format: Standard MIDI files (.mid)
- Upload via the file upload button
- Single track playback (first track for multi-track files)
- Basic transport controls (play, pause, stop)
- MIDI parsing handled by tonejs/MIDI library

### Pitch Alteration Modes

#### Swap Mode
Changes the pitch of consecutive notes by exchanging their frequencies.
```
Example:
Initial state: G4 = 392Hz, A4 = 440Hz
1. Play G4 → Last Key = G4
2. Play A4 → Last Key = G4, Current = A4
3. Swap occurs
Result: G4 = 440Hz, A4 = 392Hz
```

#### Gravity Mode
Attracts the pitch of previous notes toward the last played note.
```
Example (Strength = 2):
Initial state: G4 = 392Hz, A4 = 440Hz
1. Play G4 → Last Key = G4
2. Play A4 → Last Key = G4, Current = A4
3. Gravity applied
Result: G4 = 398Hz, A4 = 440Hz
```

#### Move Mode
Shifts the pitch of the last played note by a specified number of semitones.
```
Example (Semitones = 1):
1. Play A4 (440Hz)
2. Move applied
Result: A4 = 466.16Hz
```

## Development Status

Future plans include:
- NPM package distribution
- MIDI file size limits
- Extended browser compatibility testing
- System requirements documentation
- Production deployment guide

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Note**: Browser compatibility, system requirements, and recommended audio setup specifications are currently being documented through testing. Please check back for updates.