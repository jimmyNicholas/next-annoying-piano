#include "TapSynth.h"

TapVoice::TapVoice (const tap::TapEngine& e) : engine (e)
{
    envelope.setParameters ({ 0.005f, 0.1f, 0.3f, 1.0f });
}

bool TapVoice::canPlaySound (juce::SynthesiserSound* sound)
{
    return dynamic_cast<TapSound*> (sound) != nullptr;
}

void TapVoice::setCurrentPlaybackSampleRate (double newRate)
{
    juce::SynthesiserVoice::setCurrentPlaybackSampleRate (newRate);

    if (newRate > 0.0)
        envelope.setSampleRate (newRate);
}

void TapVoice::startNote (int midiNoteNumber, float velocity, juce::SynthesiserSound*, int)
{
    const auto hertz = engine.frequencyForNote (midiNoteNumber);

    phase = 0.0;
    phaseDelta = hertz / getSampleRate();
    level = velocity;

    envelope.reset();
    envelope.noteOn();
}

void TapVoice::stopNote (float, bool allowTailOff)
{
    if (allowTailOff)
    {
        envelope.noteOff();
    }
    else
    {
        envelope.reset();
        clearCurrentNote();
    }
}

void TapVoice::renderNextBlock (juce::AudioBuffer<float>& output, int startSample, int numSamples)
{
    if (! isVoiceActive())
        return;

    for (int i = 0; i < numSamples; ++i)
    {
        // Naive triangle wave from the phase ramp, range -1 to 1.
        const auto triangle = (float) (4.0 * std::abs (phase - 0.5) - 1.0);
        const auto sample = triangle * level * envelope.getNextSample() * 0.25f;

        for (int channel = 0; channel < output.getNumChannels(); ++channel)
            output.addSample (channel, startSample + i, sample);

        phase += phaseDelta;
        phase -= std::floor (phase);

        if (! envelope.isActive())
        {
            clearCurrentNote();
            break;
        }
    }
}

TapSynth::TapSynth (tap::TapEngine& e) : engine (e)
{
}

void TapSynth::noteOff (int midiChannel, int midiNoteNumber, float velocity, bool allowTailOff)
{
    juce::Synthesiser::noteOff (midiChannel, midiNoteNumber, velocity, allowTailOff);
    engine.noteReleased (midiNoteNumber, settings);
}
