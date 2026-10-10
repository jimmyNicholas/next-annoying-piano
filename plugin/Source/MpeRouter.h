#pragma once

#include <juce_audio_basics/juce_audio_basics.h>

#include <array>
#include <vector>

/**
    Turns ordinary MIDI into MPE (lower zone) so every note can have its own pitch.

    - Each note on gets its own member channel (2 to 16) and a pitch bend sent just
      before it. The bend comes from a per-note offset in cents.
    - Note off goes out on the same channel as its note on.
    - Everything that applies to all notes (sustain pedal, mod wheel, pitch wheel,
      channel pressure, program change) goes out on the master channel (1).
    - When all 15 channels are busy, the oldest note is stopped to make room.

    The bend range is the MPE default of 48 semitones, which Ableton assumes for
    MPE input.

    Call everything from the audio thread.
*/
class MpeRouter
{
public:
    static constexpr int masterChannel = 1;
    static constexpr int firstMemberChannel = 2;
    static constexpr int lastMemberChannel = 16;
    static constexpr int numMemberChannels = lastMemberChannel - firstMemberChannel + 1;
    static constexpr double bendRangeSemitones = 48.0;

    /** 14-bit pitch bend value for an offset in cents (8192 is no bend). */
    static int pitchBendForCents (double cents);

    /** Forgets every note. Call when playback is reset. */
    void reset();

    /**
        Rewrites the MIDI in a block. centsForNote returns the pitch offset to
        apply to a note on, given its MIDI note number.
    */
    template <typename CentsForNote>
    void process (juce::MidiBuffer& midi, CentsForNote&& centsForNote)
    {
        output.clear();

        for (const auto metadata : midi)
        {
            const auto message = metadata.getMessage();
            const auto cents = message.isNoteOn() ? centsForNote (message.getNoteNumber()) : 0.0;
            handle (message, metadata.samplePosition, cents);
        }

        midi.swapWith (output);
    }

    /** Number of notes currently holding a channel, for tests. */
    int getNumActiveNotes() const;

private:
    struct Voice
    {
        int inputChannel = 0;
        int note = -1;          // -1 when the channel is free
        juce::uint64 order = 0; // when the note started, or when the channel was freed
    };

    void handle (const juce::MidiMessage&, int samplePosition, double cents);
    void noteOn (const juce::MidiMessage&, int samplePosition, double cents);
    void noteOff (int inputChannel, int note, juce::uint8 velocity, int samplePosition);
    void allNotesOff (int samplePosition);
    int chooseChannel (int samplePosition);

    std::array<Voice, numMemberChannels> voices {};
    juce::uint64 counter = 0;
    juce::MidiBuffer output;
};
