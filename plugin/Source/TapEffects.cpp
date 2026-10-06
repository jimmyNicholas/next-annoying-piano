#include "TapEffects.h"

//==============================================================================
void TapVibrato::prepare (const juce::dsp::ProcessSpec& spec)
{
    sampleRate = spec.sampleRate;
    delay.setMaximumDelayInSamples ((int) std::ceil (maxDelaySeconds * sampleRate) + 2);
    delay.prepare (spec);
    reset();
}

void TapVibrato::reset()
{
    delay.reset();
    lfoPhase = 0.0;
}

void TapVibrato::process (const juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output)
{
    const auto numChannels = juce::jmin (input.getNumChannels(), output.getNumChannels());
    const auto numSamples = input.getNumSamples();
    const auto phaseDelta = frequency / sampleRate;
    const auto maxDelaySamples = maxDelaySeconds * (float) sampleRate;

    for (int i = 0; i < numSamples; ++i)
    {
        // Sine LFO mapped to 0..1, like Tone's LFO with min 0.
        const auto lfo = 0.5f + 0.5f * (float) std::sin (juce::MathConstants<double>::twoPi * lfoPhase);
        const auto delaySamples = juce::jmax (0.0f, lfo * depth * maxDelaySamples);

        for (int channel = 0; channel < numChannels; ++channel)
        {
            const auto dry = input.getSample (channel, i);
            delay.pushSample (channel, dry);
            const auto wetSample = delay.popSample (channel, delaySamples);
            output.setSample (channel, i, dry * (1.0f - wet) + wetSample * wet);
        }

        lfoPhase += phaseDelta;
        lfoPhase -= std::floor (lfoPhase);
    }
}

//==============================================================================
void TapReverb::prepare (const juce::dsp::ProcessSpec& spec)
{
    sampleRate = spec.sampleRate;
    scratch.setSize ((int) spec.numChannels, (int) spec.maximumBlockSize);
    convolution.prepare (spec);
    isPrepared = true;
    builtDecay = builtPreDelay = -1.0f;
    rebuildImpulseResponse();
}

void TapReverb::reset()
{
    convolution.reset();
}

void TapReverb::setDecayAndPreDelay (float decaySeconds, float preDelaySeconds)
{
    decay = decaySeconds;
    preDelay = preDelaySeconds;

    if (isPrepared && ! (juce::exactlyEqual (decay, builtDecay) && juce::exactlyEqual (preDelay, builtPreDelay)))
        rebuildImpulseResponse();
}

void TapReverb::rebuildImpulseResponse()
{
    builtDecay = decay;
    builtPreDelay = preDelay;

    const auto preDelaySamples = (int) (preDelay * sampleRate);
    const auto decaySamples = juce::jmax (1, (int) (decay * sampleRate));
    juce::AudioBuffer<float> impulse (2, preDelaySamples + decaySamples);
    impulse.clear();

    juce::Random random;

    for (int channel = 0; channel < impulse.getNumChannels(); ++channel)
    {
        for (int i = 0; i < decaySamples; ++i)
        {
            // Exponential fade to roughly -60 dB across the decay time.
            const auto envelope = std::exp (-6.9f * (float) i / (float) decaySamples);
            impulse.setSample (channel, preDelaySamples + i, (random.nextFloat() * 2.0f - 1.0f) * envelope);
        }
    }

    convolution.loadImpulseResponse (std::move (impulse), sampleRate,
                                     juce::dsp::Convolution::Stereo::yes,
                                     juce::dsp::Convolution::Trim::no,
                                     juce::dsp::Convolution::Normalise::yes);
}

void TapReverb::process (const juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output)
{
    const auto numChannels = juce::jmin (input.getNumChannels(), output.getNumChannels(), scratch.getNumChannels());
    const auto numSamples = input.getNumSamples();

    for (int channel = 0; channel < numChannels; ++channel)
        scratch.copyFrom (channel, 0, input, channel, 0, numSamples);

    juce::dsp::AudioBlock<float> block (scratch.getArrayOfWritePointers(), (size_t) numChannels, (size_t) numSamples);
    convolution.process (juce::dsp::ProcessContextReplacing<float> (block));

    for (int channel = 0; channel < numChannels; ++channel)
    {
        output.copyFrom (channel, 0, input, channel, 0, numSamples);
        output.applyGain (channel, 0, numSamples, 1.0f - wet);
        output.addFrom (channel, 0, scratch, channel, 0, numSamples, wet);
    }
}
