// Unit tests for the JUCE independent core, ported from the vitest suites in __tests__.

#include "../Source/core/TapEngine.h"

#include <cmath>
#include <cstdio>
#include <cstdlib>

static int failures = 0;

#define EXPECT_NEAR(actual, expected, tolerance)                                          \
    do {                                                                                  \
        const double a_ = (actual), e_ = (expected);                                      \
        if (std::abs (a_ - e_) > (tolerance)) {                                           \
            std::printf ("FAIL %s:%d  %s = %f, expected %f\n", __FILE__, __LINE__,         \
                         #actual, a_, e_);                                                \
            ++failures;                                                                   \
        }                                                                                 \
    } while (false)

#define EXPECT_EQ(actual, expected) EXPECT_NEAR ((double) (actual), (double) (expected), 0.0)

using namespace tap;

static void testCalculateHertz()
{
    EXPECT_NEAR (calculateHertz (440.0, 0), 440.0, 1e-9);
    EXPECT_NEAR (calculateHertz (440.0, 12), 880.0, 1e-9);
    EXPECT_NEAR (calculateHertz (440.0, -12), 220.0, 1e-9);
    EXPECT_NEAR (calculateHertz (440.0, 2), 493.883, 1e-3);
}

static void testMidiNoteToHertz()
{
    EXPECT_NEAR (midiNoteToHertz (69), 440.0, 1e-9);  // A4
    EXPECT_NEAR (midiNoteToHertz (21), 27.5, 1e-9);   // A0, lowest key on the web keyboard
    EXPECT_NEAR (midiNoteToHertz (108), 4186.009, 1e-3); // C8, highest key on the web keyboard
}

static void testReset()
{
    TapEngine engine;
    engine.setFrequency (60, 1000.0);
    engine.noteReleased (60, {});
    engine.reset();

    EXPECT_NEAR (engine.frequencyForNote (60), midiNoteToHertz (60), 1e-9);
    EXPECT_EQ (engine.getLastReleased(), -1);
}

static void testSwap()
{
    TapEngine engine;
    ModeSettings settings;
    settings.mode = Mode::swap;

    const auto a4 = engine.frequencyForNote (69);
    const auto b4 = engine.frequencyForNote (71);

    // First release has no previous key, so nothing changes.
    engine.noteReleased (69, settings);
    EXPECT_NEAR (engine.frequencyForNote (69), a4, 1e-9);

    engine.noteReleased (71, settings);
    EXPECT_NEAR (engine.frequencyForNote (69), b4, 1e-9);
    EXPECT_NEAR (engine.frequencyForNote (71), a4, 1e-9);

    // Releasing the same key twice does nothing.
    engine.noteReleased (71, settings);
    EXPECT_NEAR (engine.frequencyForNote (71), a4, 1e-9);
}

static void testGravity()
{
    TapEngine engine;
    ModeSettings settings;
    settings.mode = Mode::gravity;
    settings.gravityStrength = 2.0;

    engine.setFrequency (69, 440.0);
    engine.setFrequency (71, 493.88);

    engine.noteReleased (69, settings);
    engine.noteReleased (71, settings);

    // Same expectation as __tests__/lib/data/modes/gravity.test.ts
    EXPECT_NEAR (engine.frequencyForNote (69), 446.735, 1e-3);
    EXPECT_NEAR (engine.frequencyForNote (71), 493.88, 1e-9);
}

static void testGravityFullStrength()
{
    TapEngine engine;
    ModeSettings settings;
    settings.mode = Mode::gravity;
    settings.gravityStrength = ranges::gravityMax;

    engine.noteReleased (69, settings);
    engine.noteReleased (71, settings);

    EXPECT_NEAR (engine.frequencyForNote (69), midiNoteToHertz (71), 1e-9);
    EXPECT_EQ (std::isfinite (engine.frequencyForNote (69)), true);
}

static void testMove()
{
    TapEngine engine;
    ModeSettings settings;
    settings.mode = Mode::move;
    settings.moveSemitones = 1;

    engine.noteReleased (69, settings);
    EXPECT_NEAR (engine.frequencyForNote (69), midiNoteToHertz (70), 1e-9);

    settings.moveSemitones = -2;
    engine.noteReleased (69, settings);
    EXPECT_NEAR (engine.frequencyForNote (69), midiNoteToHertz (68), 1e-9);
}

static void testOutOfRangeNotesAreIgnored()
{
    TapEngine engine;
    engine.noteReleased (-1, {});
    engine.noteReleased (128, {});
    EXPECT_EQ (engine.getLastReleased(), -1);
}

int main()
{
    testCalculateHertz();
    testMidiNoteToHertz();
    testReset();
    testSwap();
    testGravity();
    testGravityFullStrength();
    testMove();
    testOutOfRangeNotesAreIgnored();

    if (failures == 0)
        std::printf ("All TapEngine tests passed\n");

    return failures == 0 ? EXIT_SUCCESS : EXIT_FAILURE;
}
