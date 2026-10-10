#pragma once

#include <juce_audio_processors/juce_audio_processors.h>

#include "MpeRouter.h"

/**
    TAP makes no sound of its own. It receives MIDI, will retune it in later
    tickets, and sends it on to an Ableton instrument on another track.
    For now it passes MIDI through unchanged.
*/
class TapAudioProcessor : public juce::AudioProcessor
{
public:
    TapAudioProcessor();

    void prepareToPlay (double, int) override;
    void releaseResources() override {}
    bool isBusesLayoutSupported (const BusesLayout& layouts) const override;
    void processBlock (juce::AudioBuffer<float>&, juce::MidiBuffer&) override;
    using AudioProcessor::processBlock;

    juce::AudioProcessorEditor* createEditor() override;
    bool hasEditor() const override { return true; }

    const juce::String getName() const override { return JucePlugin_Name; }
    bool acceptsMidi() const override  { return true; }
    bool producesMidi() const override { return true; }
    bool isMidiEffect() const override { return false; }
    double getTailLengthSeconds() const override { return 0.0; }

    int getNumPrograms() override                              { return 1; }
    int getCurrentProgram() override                           { return 0; }
    void setCurrentProgram (int) override                      {}
    const juce::String getProgramName (int) override           { return {}; }
    void changeProgramName (int, const juce::String&) override {}

    void getStateInformation (juce::MemoryBlock&) override;
    void setStateInformation (const void*, int) override;

    juce::AudioProcessorValueTreeState apvts;

private:
    MpeRouter router;
    std::atomic<float>* detuneParam = nullptr;
    std::atomic<float>* detuneKeysParam = nullptr;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (TapAudioProcessor)
};
