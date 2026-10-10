#include "MpeRouter.h"

int MpeRouter::pitchBendForCents (double cents)
{
    const auto offset = cents / (bendRangeSemitones * 100.0) * 8192.0;
    return juce::jlimit (0, 16383, 8192 + juce::roundToInt (offset));
}

void MpeRouter::reset()
{
    voices = {};
    counter = 0;
}

int MpeRouter::getNumActiveNotes() const
{
    int count = 0;
    for (const auto& voice : voices)
        if (voice.note >= 0)
            ++count;
    return count;
}

void MpeRouter::handle (const juce::MidiMessage& message, int samplePosition, double cents)
{
    if (message.isNoteOn())
    {
        noteOn (message, samplePosition, cents);
    }
    else if (message.isNoteOff())
    {
        noteOff (message.getChannel(), message.getNoteNumber(), message.getVelocity(), samplePosition);
    }
    else if (message.isAftertouch())
    {
        // Polyphonic pressure belongs to one note, so follow that note to its channel.
        for (size_t i = 0; i < voices.size(); ++i)
            if (voices[i].note == message.getNoteNumber() && voices[i].inputChannel == message.getChannel())
                output.addEvent (juce::MidiMessage::aftertouchChange (firstMemberChannel + (int) i,
                                                                      message.getNoteNumber(),
                                                                      message.getAfterTouchValue()), samplePosition);
    }
    else if (message.isAllNotesOff() || message.isAllSoundOff())
    {
        allNotesOff (samplePosition);
        output.addEvent (juce::MidiMessage::allNotesOff (masterChannel), samplePosition);
    }
    else if (message.getChannel() > 0)
    {
        // Pedal, controllers, pitch wheel, pressure and program changes apply to every note.
        auto copy = message;
        copy.setChannel (masterChannel);
        output.addEvent (copy, samplePosition);
    }
    else
    {
        output.addEvent (message, samplePosition);
    }
}

void MpeRouter::noteOn (const juce::MidiMessage& message, int samplePosition, double cents)
{
    const auto channel = chooseChannel (samplePosition);
    auto& voice = voices[(size_t) (channel - firstMemberChannel)];

    voice.inputChannel = message.getChannel();
    voice.note = message.getNoteNumber();
    voice.order = ++counter;

    output.addEvent (juce::MidiMessage::pitchWheel (channel, pitchBendForCents (cents)), samplePosition);
    output.addEvent (juce::MidiMessage::noteOn (channel, voice.note, message.getVelocity()), samplePosition);
}

void MpeRouter::noteOff (int inputChannel, int note, juce::uint8 velocity, int samplePosition)
{
    // If the same key is held more than once, release the oldest.
    Voice* match = nullptr;
    int matchChannel = 0;

    for (size_t i = 0; i < voices.size(); ++i)
    {
        auto& voice = voices[i];
        if (voice.note == note && voice.inputChannel == inputChannel && (match == nullptr || voice.order < match->order))
        {
            match = &voice;
            matchChannel = firstMemberChannel + (int) i;
        }
    }

    // No match means the note was stolen earlier and has already been stopped.
    if (match == nullptr)
        return;

    output.addEvent (juce::MidiMessage::noteOff (matchChannel, note, velocity), samplePosition);
    match->note = -1;
    match->order = ++counter;
}

void MpeRouter::allNotesOff (int samplePosition)
{
    for (size_t i = 0; i < voices.size(); ++i)
    {
        if (voices[i].note >= 0)
        {
            output.addEvent (juce::MidiMessage::noteOff (firstMemberChannel + (int) i, voices[i].note), samplePosition);
            voices[i].note = -1;
            voices[i].order = ++counter;
        }
    }
}

int MpeRouter::chooseChannel (int samplePosition)
{
    // Prefer the channel that has been free the longest, so a previous note's
    // release tail is least likely to jump to the new note's pitch.
    int best = -1;
    for (size_t i = 0; i < voices.size(); ++i)
        if (voices[i].note < 0 && (best < 0 || voices[i].order < voices[(size_t) best].order))
            best = (int) i;

    if (best < 0)
    {
        // Every channel is busy: stop the oldest note and reuse its channel.
        best = 0;
        for (size_t i = 1; i < voices.size(); ++i)
            if (voices[i].order < voices[(size_t) best].order)
                best = (int) i;

        auto& oldest = voices[(size_t) best];
        output.addEvent (juce::MidiMessage::noteOff (firstMemberChannel + best, oldest.note), samplePosition);
        oldest.note = -1;
    }

    return firstMemberChannel + best;
}
