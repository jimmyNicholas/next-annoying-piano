#pragma once

#include <juce_audio_processors/juce_audio_processors.h>
#include <juce_audio_utils/juce_audio_utils.h>

#include "TapEffects.h"
#include "TapEngine.h"
#include "TapSynth.h"

#include <array>
#include <atomic>

class TapAudioProcessor : public juce::AudioProcessor,
                          private juce::Timer
{
public:
    TapAudioProcessor();
    ~TapAudioProcessor() override;

    void prepareToPlay (double sampleRate, int samplesPerBlock) override;
    void releaseResources() override {}
    bool isBusesLayoutSupported (const BusesLayout& layouts) const override;
    void processBlock (juce::AudioBuffer<float>&, juce::MidiBuffer&) override;
    using AudioProcessor::processBlock;

    juce::AudioProcessorEditor* createEditor() override;
    bool hasEditor() const override { return true; }

    const juce::String getName() const override { return JucePlugin_Name; }
    bool acceptsMidi() const override  { return true; }
    bool producesMidi() const override { return false; }
    bool isMidiEffect() const override { return false; }
    double getTailLengthSeconds() const override;

    int getNumPrograms() override                         { return 1; }
    int getCurrentProgram() override                      { return 0; }
    void setCurrentProgram (int) override                 {}
    const juce::String getProgramName (int) override      { return {}; }
    void changeProgramName (int, const juce::String&) override {}

    void getStateInformation (juce::MemoryBlock& destData) override;
    void setStateInformation (const void* data, int sizeInBytes) override;

    /** Restores every key to concert pitch on the next audio block. */
    void requestReset() { resetRequested = true; }

    /** Detune of each key from concert pitch in cents, updated every block for the editor. */
    float getCentsOffset (int midiNote) const { return centsOffsets[(size_t) midiNote].load (std::memory_order_relaxed); }

    juce::AudioProcessorValueTreeState apvts;
    juce::MidiKeyboardState keyboardState;

private:
    void timerCallback() override;
    tap::ModeSettings readModeSettings() const;
    void publishCentsOffsets();

    tap::TapEngine engine;
    TapSynth synth { engine };
    TapVibrato vibrato;
    TapReverb reverb;

    juce::AudioBuffer<float> synthBuffer, vibratoBuffer, reverbBuffer;

    std::atomic<bool> resetRequested { false };
    tap::Mode lastMode = tap::Mode::swap;
    std::array<std::atomic<float>, tap::TapEngine::numNotes> centsOffsets {};

    std::atomic<float>* modeParam = nullptr;
    std::atomic<float>* gravityParam = nullptr;
    std::atomic<float>* moveParam = nullptr;
    std::atomic<float>* volumeParam = nullptr;
    std::atomic<float>* vibratoFrequencyParam = nullptr;
    std::atomic<float>* vibratoDepthParam = nullptr;
    std::atomic<float>* vibratoWetParam = nullptr;
    std::atomic<float>* reverbDecayParam = nullptr;
    std::atomic<float>* reverbPreDelayParam = nullptr;
    std::atomic<float>* reverbWetParam = nullptr;

    juce::SmoothedValue<float> outputGain;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (TapAudioProcessor)
};
