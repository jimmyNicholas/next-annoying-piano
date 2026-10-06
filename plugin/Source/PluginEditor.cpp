#include "PluginEditor.h"
#include "Parameters.h"

namespace
{
    const auto background = juce::Colour (0xff1e1e24);
    const auto panel      = juce::Colour (0xff2a2a33);
    const auto accent     = juce::Colour (0xffff7a59);
    const auto cool       = juce::Colour (0xff59c3ff);

    // Same range as the web keyboard: A0 to C8.
    constexpr int lowestKey = 21;
    constexpr int highestKey = 108;
}

//==============================================================================
DetuneDisplay::DetuneDisplay (const TapAudioProcessor& p, const juce::MidiKeyboardComponent& k)
    : processor (p), keyboard (k)
{
    setInterceptsMouseClicks (false, false);
}

void DetuneDisplay::paint (juce::Graphics& g)
{
    g.fillAll (panel);

    const auto bounds = getLocalBounds().toFloat();
    const auto centreY = bounds.getCentreY();
    const auto halfHeight = bounds.getHeight() * 0.5f - 1.0f;

    g.setColour (juce::Colours::white.withAlpha (0.2f));
    g.drawHorizontalLine ((int) centreY, bounds.getX(), bounds.getRight());

    for (int note = lowestKey; note <= highestKey; ++note)
    {
        const auto cents = processor.getCentsOffset (note);
        if (std::abs (cents) < 0.5f)
            continue;

        const auto keyArea = keyboard.getRectangleForKey (note);
        const auto x = keyArea.getCentreX() + (float) (keyboard.getX() - getX());
        // A full octave of drift fills the display.
        const auto length = juce::jlimit (-1.0f, 1.0f, cents / 1200.0f) * halfHeight;

        g.setColour (cents > 0.0f ? accent : cool);
        g.fillRect (juce::Rectangle<float> (x - 2.0f, juce::jmin (centreY, centreY - length), 4.0f, std::abs (length)));
    }
}

//==============================================================================
LabelledKnob::LabelledKnob (juce::AudioProcessorValueTreeState& state, const juce::String& paramId, const juce::String& caption)
    : attachment (state, paramId, slider)
{
    slider.setTextBoxStyle (juce::Slider::TextBoxBelow, false, 70, 18);
    label.setText (caption, juce::dontSendNotification);
    label.setJustificationType (juce::Justification::centred);
}

//==============================================================================
TapAudioProcessorEditor::TapAudioProcessorEditor (TapAudioProcessor& p)
    : AudioProcessorEditor (&p),
      processor (p),
      gravity (p.apvts, params::gravityStrength, "Strength"),
      move (p.apvts, params::moveSemitones, "Semitones"),
      volume (p.apvts, params::volume, "Volume"),
      vibratoFrequency (p.apvts, params::vibratoFrequency, "Frequency"),
      vibratoDepth (p.apvts, params::vibratoDepth, "Depth"),
      vibratoWet (p.apvts, params::vibratoWet, "Wet"),
      reverbDecay (p.apvts, params::reverbDecay, "Decay"),
      reverbPreDelay (p.apvts, params::reverbPreDelay, "Pre-Delay"),
      reverbWet (p.apvts, params::reverbWet, "Wet"),
      keyboard (p.keyboardState, juce::MidiKeyboardComponent::horizontalKeyboard),
      detuneDisplay (p, keyboard)
{
    title.setText ("The Annoying Piano", juce::dontSendNotification);
    title.setFont (juce::FontOptions (22.0f, juce::Font::bold));
    addAndMakeVisible (title);

    // Items must exist before the attachment is made so it can select the current mode.
    modeBox.addItemList (params::modeNames, 1);
    modeAttachment = std::make_unique<juce::AudioProcessorValueTreeState::ComboBoxAttachment> (p.apvts, params::mode, modeBox);
    modeBox.onChange = [this] { updateModeControls(); };
    addAndMakeVisible (modeBox);

    modeDescription.setJustificationType (juce::Justification::centredLeft);
    modeDescription.setColour (juce::Label::textColourId, juce::Colours::white.withAlpha (0.7f));
    addAndMakeVisible (modeDescription);

    resetButton.onClick = [this] { processor.requestReset(); };
    addAndMakeVisible (resetButton);

    for (auto* knob : { &gravity, &move, &volume, &vibratoFrequency, &vibratoDepth, &vibratoWet,
                        &reverbDecay, &reverbPreDelay, &reverbWet })
    {
        knob->slider.setColour (juce::Slider::rotarySliderFillColourId, accent);
        addAndMakeVisible (knob->slider);
        addAndMakeVisible (knob->label);
    }

    keyboard.setAvailableRange (lowestKey, highestKey);
    keyboard.setScrollButtonsVisible (false);
    addAndMakeVisible (keyboard);
    addAndMakeVisible (detuneDisplay);

    updateModeControls();
    setSize (1000, 460);
    startTimerHz (30);
}

TapAudioProcessorEditor::~TapAudioProcessorEditor()
{
    stopTimer();
}

void TapAudioProcessorEditor::updateModeControls()
{
    const auto index = juce::jmax (0, modeBox.getSelectedItemIndex());
    modeDescription.setText (params::modeDescriptions[index], juce::dontSendNotification);

    gravity.slider.setVisible (index == 1);
    gravity.label.setVisible (index == 1);
    move.slider.setVisible (index == 2);
    move.label.setVisible (index == 2);
}

void TapAudioProcessorEditor::timerCallback()
{
    detuneDisplay.repaint();
}

void TapAudioProcessorEditor::paint (juce::Graphics& g)
{
    g.fillAll (background);

    g.setColour (juce::Colours::white.withAlpha (0.6f));
    g.setFont (juce::FontOptions (14.0f));

    auto drawHeading = [&g] (const juce::String& text, juce::Rectangle<int> area)
    {
        g.drawText (text, area.removeFromTop (20), juce::Justification::centredLeft);
    };

    auto area = getLocalBounds().reduced (16);
    area.removeFromTop (80);
    auto controls = area.removeFromTop (150);
    const auto columnWidth = controls.getWidth() / 4;

    drawHeading ("MODE", controls.removeFromLeft (columnWidth));
    drawHeading ("SYNTH", controls.removeFromLeft (columnWidth));
    drawHeading ("VIBRATO", controls.removeFromLeft (columnWidth));
    drawHeading ("REVERB", controls);
}

void TapAudioProcessorEditor::resized()
{
    auto area = getLocalBounds().reduced (16);

    auto header = area.removeFromTop (36);
    title.setBounds (header.removeFromLeft (260));
    resetButton.setBounds (header.removeFromRight (130).reduced (0, 4));
    header.removeFromRight (8);
    modeBox.setBounds (header.removeFromRight (160).reduced (0, 4));

    modeDescription.setBounds (area.removeFromTop (36));
    area.removeFromTop (8);

    auto controls = area.removeFromTop (150);
    const auto columnWidth = controls.getWidth() / 4;

    auto placeKnob = [] (LabelledKnob& knob, juce::Rectangle<int> slot)
    {
        knob.label.setBounds (slot.removeFromTop (20));
        knob.slider.setBounds (slot);
    };

    auto layoutColumn = [&] (juce::Rectangle<int> column, std::initializer_list<LabelledKnob*> knobs)
    {
        column.removeFromTop (20);
        const auto slotWidth = column.getWidth() / 3;
        for (auto* knob : knobs)
            placeKnob (*knob, column.removeFromLeft (slotWidth).reduced (2));
    };

    auto modeColumn = controls.removeFromLeft (columnWidth);
    modeColumn.removeFromTop (20);
    placeKnob (gravity, modeColumn.withWidth (modeColumn.getWidth() / 3).reduced (2));
    placeKnob (move, modeColumn.withWidth (modeColumn.getWidth() / 3).reduced (2));

    layoutColumn (controls.removeFromLeft (columnWidth), { &volume });
    layoutColumn (controls.removeFromLeft (columnWidth), { &vibratoFrequency, &vibratoDepth, &vibratoWet });
    layoutColumn (controls, { &reverbDecay, &reverbPreDelay, &reverbWet });

    area.removeFromTop (12);
    detuneDisplay.setBounds (area.removeFromTop (60));
    area.removeFromTop (4);
    keyboard.setBounds (area);

    // Fit all 88 keys across the window.
    const auto numWhiteKeys = 52.0f;
    keyboard.setKeyWidth ((float) keyboard.getWidth() / numWhiteKeys);
}
