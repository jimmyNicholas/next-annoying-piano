#pragma once

#include <juce_audio_processors/juce_audio_processors.h>
#include <juce_audio_utils/juce_audio_utils.h>

#include "PluginProcessor.h"

/** Shows how far each key has drifted from concert pitch, lined up with the keyboard. */
class DetuneDisplay : public juce::Component
{
public:
    DetuneDisplay (const TapAudioProcessor&, const juce::MidiKeyboardComponent&);
    void paint (juce::Graphics&) override;

private:
    const TapAudioProcessor& processor;
    const juce::MidiKeyboardComponent& keyboard;
};

/** A rotary slider with a caption, attached to one parameter. */
struct LabelledKnob
{
    LabelledKnob (juce::AudioProcessorValueTreeState&, const juce::String& paramId, const juce::String& caption);

    juce::Slider slider { juce::Slider::RotaryHorizontalVerticalDrag, juce::Slider::TextBoxBelow };
    juce::Label label;
    juce::AudioProcessorValueTreeState::SliderAttachment attachment;
};

class TapAudioProcessorEditor : public juce::AudioProcessorEditor,
                                private juce::Timer
{
public:
    explicit TapAudioProcessorEditor (TapAudioProcessor&);
    ~TapAudioProcessorEditor() override;

    void paint (juce::Graphics&) override;
    void resized() override;

private:
    void timerCallback() override;
    void updateModeControls();

    TapAudioProcessor& processor;

    juce::Label title;
    juce::ComboBox modeBox;
    std::unique_ptr<juce::AudioProcessorValueTreeState::ComboBoxAttachment> modeAttachment;
    juce::Label modeDescription;
    juce::TextButton resetButton { "Reset pitches" };

    LabelledKnob gravity, move, volume;
    LabelledKnob vibratoFrequency, vibratoDepth, vibratoWet;
    LabelledKnob reverbDecay, reverbPreDelay, reverbWet;

    juce::MidiKeyboardComponent keyboard;
    DetuneDisplay detuneDisplay;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (TapAudioProcessorEditor)
};
