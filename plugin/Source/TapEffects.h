#pragma once

#include <juce_dsp/juce_dsp.h>

/**
    Port of Tone.Vibrato: a short delay line whose delay time is swept by a sine LFO.
    Depth scales the sweep up to a maximum of 5 ms, as Tone.js does.
*/
class TapVibrato
{
public:
    void prepare (const juce::dsp::ProcessSpec& spec);
    void reset();

    void setFrequency (float hertz) { frequency = hertz; }
    void setDepth (float newDepth)  { depth = newDepth; }
    void setWet (float newWet)      { wet = newWet; }

    /** Writes the effect of input into output (sizes must match). */
    void process (const juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output);

private:
    static constexpr float maxDelaySeconds = 0.005f;

    juce::dsp::DelayLine<float, juce::dsp::DelayLineInterpolationTypes::Linear> delay { 4096 };
    double sampleRate = 44100.0;
    double lfoPhase = 0.0;
    float frequency = 5.0f, depth = 0.1f, wet = 1.0f;
};

/**
    Port of Tone.Reverb: convolution with a generated impulse response of decaying
    stereo noise, preceded by a short silence for the pre-delay.

    setDecay and setPreDelay rebuild the impulse response, so call them from the
    message thread. process is called from the audio thread.
*/
class TapReverb
{
public:
    void prepare (const juce::dsp::ProcessSpec& spec);
    void reset();

    /** Rebuilds the impulse response if the decay or pre-delay changed. */
    void setDecayAndPreDelay (float decaySeconds, float preDelaySeconds);
    void setWet (float newWet) { wet = newWet; }

    void process (const juce::AudioBuffer<float>& input, juce::AudioBuffer<float>& output);

private:
    void rebuildImpulseResponse();

    juce::dsp::Convolution convolution;
    juce::AudioBuffer<float> scratch;
    double sampleRate = 44100.0;
    float decay = 5.0f, preDelay = 0.01f, wet = 1.0f;
    float builtDecay = -1.0f, builtPreDelay = -1.0f;
    bool isPrepared = false;
};
