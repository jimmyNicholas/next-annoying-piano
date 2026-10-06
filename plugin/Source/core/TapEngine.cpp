#include "TapEngine.h"

#include <algorithm>
#include <cmath>

namespace tap
{

double calculateHertz (double baseHertz, int semitones)
{
    if (semitones == 0)
        return baseHertz;

    return baseHertz * std::pow (2.0, semitones / 12.0);
}

double midiNoteToHertz (int midiNote)
{
    return calculateHertz (440.0, midiNote - 69);
}

TapEngine::TapEngine()
{
    reset();
}

void TapEngine::reset()
{
    for (int note = 0; note < numNotes; ++note)
        table[(size_t) note] = midiNoteToHertz (note);

    lastReleased = -1;
}

double TapEngine::frequencyForNote (int midiNote) const
{
    if (midiNote < 0 || midiNote >= numNotes)
        return midiNoteToHertz (midiNote);

    return table[(size_t) midiNote];
}

void TapEngine::setFrequency (int midiNote, double hertz)
{
    if (midiNote >= 0 && midiNote < numNotes)
        table[(size_t) midiNote] = hertz;
}

void TapEngine::noteReleased (int midiNote, const ModeSettings& settings)
{
    if (midiNote < 0 || midiNote >= numNotes)
        return;

    // Matches useKeyboard.ts: on the very first release the last key is the current key.
    if (lastReleased < 0)
        lastReleased = midiNote;

    switch (settings.mode)
    {
        case Mode::swap:    applySwap (lastReleased, midiNote); break;
        case Mode::gravity: applyGravity (lastReleased, midiNote, settings.gravityStrength); break;
        case Mode::move:    applyMove (midiNote, settings.moveSemitones); break;
    }

    lastReleased = midiNote;
}

void TapEngine::applySwap (int lastKey, int currentKey)
{
    if (lastKey == currentKey)
        return;

    std::swap (table[(size_t) lastKey], table[(size_t) currentKey]);
}

void TapEngine::applyGravity (int lastKey, int currentKey, double strength)
{
    if (lastKey == currentKey)
        return;

    const auto lastHertz = table[(size_t) lastKey];
    const auto currentHertz = table[(size_t) currentKey];

    // Same formula as gravity.ts, including the overshoot above a strength of 9.
    // At full strength the divisor is zero, which gave Infinity on the web, so the
    // key is pulled exactly onto the current key's pitch instead.
    const auto divisor = ranges::gravityMax - std::clamp (strength, ranges::gravityMin, ranges::gravityMax);

    table[(size_t) lastKey] = divisor <= 0.0 ? currentHertz
                                             : lastHertz - (lastHertz - currentHertz) / divisor;
}

void TapEngine::applyMove (int currentKey, int semitones)
{
    const auto clamped = std::clamp (semitones, ranges::moveMin, ranges::moveMax);
    table[(size_t) currentKey] = calculateHertz (table[(size_t) currentKey], clamped);
}

} // namespace tap
