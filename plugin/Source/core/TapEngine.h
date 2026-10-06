#pragma once

#include <array>

namespace tap
{

/** The three pitch altering modes from the web version (src/_lib/_data/modes). */
enum class Mode
{
    swap = 0,
    gravity,
    move
};

/** Settings that the modes read when a key is released. */
struct ModeSettings
{
    Mode mode = Mode::swap;

    /** Gravity strength, 1 to 10. Higher values pull harder. */
    double gravityStrength = 2.0;

    /** Move interval in semitones, -2 to 2. */
    int moveSemitones = 1;
};

/** Ranges matching the modifiers defined in the web version. */
namespace ranges
{
    constexpr double gravityMin = 1.0;
    constexpr double gravityMax = 10.0;
    constexpr int moveMin = -2;
    constexpr int moveMax = 2;
}

/** Equal temperament: baseHertz shifted by a number of semitones. */
double calculateHertz (double baseHertz, int semitones);

/** Concert pitch frequency of a MIDI note number (A4 = note 69 = 440 Hz). */
double midiNoteToHertz (int midiNote);

/**
    Plain C++ port of the pitch logic in useKeyboard.ts and the Mode classes.

    Holds one frequency per MIDI note. Pressing a key reads the table, releasing a
    key applies the current mode to the table, so the next press of an affected
    key sounds at its new pitch. It has no JUCE dependency so it can be unit
    tested on its own.

    Not thread safe: call everything from the audio thread.
*/
class TapEngine
{
public:
    static constexpr int numNotes = 128;

    TapEngine();

    /** Restores every key to concert pitch and forgets the last released key. */
    void reset();

    /** Frequency to play for a key press. */
    double frequencyForNote (int midiNote) const;

    /** Applies the current mode after a key is released (onKeyUp in useKeyboard.ts). */
    void noteReleased (int midiNote, const ModeSettings& settings);

    /** Direct access, mainly for tests and the editor. */
    const std::array<double, numNotes>& getTable() const noexcept { return table; }
    void setFrequency (int midiNote, double hertz);
    int getLastReleased() const noexcept { return lastReleased; }

private:
    void applySwap (int lastKey, int currentKey);
    void applyGravity (int lastKey, int currentKey, double strength);
    void applyMove (int currentKey, int semitones);

    std::array<double, numNotes> table {};
    int lastReleased = -1;
};

} // namespace tap
