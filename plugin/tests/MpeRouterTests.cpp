// Unit tests for MpeRouter. Run with ctest, or directly as TapTests.

#include "../Source/MpeRouter.h"

#include <cstdio>
#include <cstdlib>
#include <vector>

static int failures = 0;

#define EXPECT(condition)                                                        \
    do {                                                                         \
        if (! (condition)) {                                                     \
            std::printf ("FAIL %s:%d  %s\n", __FILE__, __LINE__, #condition);    \
            ++failures;                                                          \
        }                                                                        \
    } while (false)

static std::vector<juce::MidiMessage> run (MpeRouter& router, std::initializer_list<juce::MidiMessage> input, double cents = 0.0)
{
    juce::MidiBuffer midi;
    int position = 0;
    for (const auto& message : input)
        midi.addEvent (message, position++);

    router.process (midi, [cents] (int) { return cents; });

    std::vector<juce::MidiMessage> result;
    for (const auto metadata : midi)
        result.push_back (metadata.getMessage());
    return result;
}

static void testPitchBendForCents()
{
    EXPECT (MpeRouter::pitchBendForCents (0.0) == 8192);
    EXPECT (MpeRouter::pitchBendForCents (4800.0) == 16383);   // top of the range, clamped
    EXPECT (MpeRouter::pitchBendForCents (-4800.0) == 0);
    EXPECT (MpeRouter::pitchBendForCents (50.0) == 8192 + 85); // a quarter tone: 50 / 4800 * 8192 = 85.3
    EXPECT (MpeRouter::pitchBendForCents (-100.0) == 8192 - 171);
}

static void testNoteGetsOwnChannelWithBendFirst()
{
    MpeRouter router;
    const auto out = run (router, { juce::MidiMessage::noteOn (1, 60, (juce::uint8) 100) }, 50.0);

    EXPECT (out.size() == 2);
    EXPECT (out[0].isPitchWheel() && out[0].getChannel() == 2 && out[0].getPitchWheelValue() == 8192 + 85);
    EXPECT (out[1].isNoteOn() && out[1].getChannel() == 2 && out[1].getNoteNumber() == 60 && out[1].getVelocity() == 100);
}

static void testChordUsesSeparateChannelsAndNoteOffMatches()
{
    MpeRouter router;
    const auto on = run (router, { juce::MidiMessage::noteOn (1, 60, (juce::uint8) 100),
                                   juce::MidiMessage::noteOn (1, 64, (juce::uint8) 100) });
    EXPECT (on[1].getChannel() != on[3].getChannel());

    const auto off = run (router, { juce::MidiMessage::noteOff (1, 64) });
    EXPECT (off.size() == 1);
    EXPECT (off[0].isNoteOff() && off[0].getNoteNumber() == 64 && off[0].getChannel() == on[3].getChannel());
    EXPECT (router.getNumActiveNotes() == 1);
}

static void testVelocityZeroCountsAsNoteOff()
{
    MpeRouter router;
    run (router, { juce::MidiMessage::noteOn (1, 60, (juce::uint8) 100) });
    const auto off = run (router, { juce::MidiMessage::noteOn (1, 60, (juce::uint8) 0) });
    EXPECT (off.size() == 1 && off[0].isNoteOff() && off[0].getChannel() == 2);
    EXPECT (router.getNumActiveNotes() == 0);
}

static void testSharedMessagesGoToMasterChannel()
{
    MpeRouter router;
    const auto out = run (router, { juce::MidiMessage::controllerEvent (1, 64, 127),
                                    juce::MidiMessage::pitchWheel (1, 10000),
                                    juce::MidiMessage::channelPressureChange (3, 50) });
    EXPECT (out.size() == 3);
    for (const auto& message : out)
        EXPECT (message.getChannel() == MpeRouter::masterChannel);
    EXPECT (out[0].isSustainPedalOn());
}

static void testSixteenthNoteStealsOldest()
{
    MpeRouter router;
    for (int note = 0; note < MpeRouter::numMemberChannels; ++note)
        run (router, { juce::MidiMessage::noteOn (1, 40 + note, (juce::uint8) 100) });
    EXPECT (router.getNumActiveNotes() == 15);

    const auto out = run (router, { juce::MidiMessage::noteOn (1, 80, (juce::uint8) 100) });
    EXPECT (out.size() == 3);
    EXPECT (out[0].isNoteOff() && out[0].getNoteNumber() == 40 && out[0].getChannel() == 2);
    EXPECT (out[2].isNoteOn() && out[2].getNoteNumber() == 80 && out[2].getChannel() == 2);

    // The stolen note's own note off is dropped, since it already stopped.
    EXPECT (run (router, { juce::MidiMessage::noteOff (1, 40) }).empty());
}

static void testFreedChannelIsReusedLast()
{
    MpeRouter router;
    run (router, { juce::MidiMessage::noteOn (1, 60, (juce::uint8) 100) }); // channel 2
    run (router, { juce::MidiMessage::noteOff (1, 60) });
    const auto out = run (router, { juce::MidiMessage::noteOn (1, 62, (juce::uint8) 100) });
    EXPECT (out[1].getChannel() == 3); // channel 2 still has a release tail, so it waits
}

static void testAllNotesOffStopsEverything()
{
    MpeRouter router;
    run (router, { juce::MidiMessage::noteOn (1, 60, (juce::uint8) 100),
                   juce::MidiMessage::noteOn (1, 64, (juce::uint8) 100) });
    const auto out = run (router, { juce::MidiMessage::allNotesOff (1) });
    EXPECT (router.getNumActiveNotes() == 0);
    EXPECT (out.size() == 3);
}

int main()
{
    testPitchBendForCents();
    testNoteGetsOwnChannelWithBendFirst();
    testChordUsesSeparateChannelsAndNoteOffMatches();
    testVelocityZeroCountsAsNoteOff();
    testSharedMessagesGoToMasterChannel();
    testSixteenthNoteStealsOldest();
    testFreedChannelIsReusedLast();
    testAllNotesOffStopsEverything();

    if (failures == 0)
        std::printf ("All MpeRouter tests passed\n");

    return failures == 0 ? EXIT_SUCCESS : EXIT_FAILURE;
}
