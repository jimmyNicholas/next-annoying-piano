// Runs the real processor without a host: plays notes, checks there is sound and
// that releasing keys retunes them.

#include "../Source/PluginProcessor.h"
#include "../Source/Parameters.h"

#include <cstdio>
#include <cstdlib>

static int failures = 0;

static void expect (bool condition, const char* message)
{
    if (! condition)
    {
        std::printf ("FAIL: %s\n", message);
        ++failures;
    }
}

static float renderBlocks (TapAudioProcessor& processor, juce::MidiBuffer midi, int numBlocks)
{
    juce::AudioBuffer<float> buffer (2, 512);
    float peak = 0.0f;

    for (int i = 0; i < numBlocks; ++i)
    {
        buffer.clear();
        processor.processBlock (buffer, midi);
        midi.clear();
        peak = juce::jmax (peak, buffer.getMagnitude (0, buffer.getNumSamples()));
    }

    return peak;
}

static void pressAndRelease (TapAudioProcessor& processor, int note)
{
    juce::MidiBuffer midi;
    midi.addEvent (juce::MidiMessage::noteOn (1, note, (juce::uint8) 100), 0);
    midi.addEvent (juce::MidiMessage::noteOff (1, note), 256);
    renderBlocks (processor, midi, 1);
}

int main()
{
    juce::ScopedJuceInitialiser_GUI juceInit;

    TapAudioProcessor processor;
    processor.prepareToPlay (48000.0, 512);

    // Sound comes out.
    {
        juce::MidiBuffer midi;
        midi.addEvent (juce::MidiMessage::noteOn (1, 60, (juce::uint8) 100), 0);
        const auto peak = renderBlocks (processor, midi, 20);
        std::printf ("Peak level while holding C4: %f\n", peak);
        expect (peak > 0.001f, "playing a note produces sound");
        expect (peak < 4.0f, "output level is sane");

        midi.addEvent (juce::MidiMessage::noteOff (1, 60), 0);
        renderBlocks (processor, midi, 1);
    }

    // Swap mode (default): A4 then B4 swaps their pitches.
    processor.requestReset();
    renderBlocks (processor, {}, 1);
    pressAndRelease (processor, 69);
    pressAndRelease (processor, 71);
    expect (std::abs (processor.getCentsOffset (69) - 200.0f) < 0.01f, "swap moves A4 up to B4");
    expect (std::abs (processor.getCentsOffset (71) + 200.0f) < 0.01f, "swap moves B4 down to A4");

    // Changing mode resets the table, then Move shifts the released key.
    auto* modeParam = processor.apvts.getParameter (params::mode);
    modeParam->setValueNotifyingHost (modeParam->convertTo0to1 (2.0f));
    renderBlocks (processor, {}, 1);
    expect (std::abs (processor.getCentsOffset (71)) < 0.01f, "changing mode resets pitches");

    pressAndRelease (processor, 60);
    expect (std::abs (processor.getCentsOffset (60) - 100.0f) < 0.01f, "move shifts the released key a semitone");

    // State round trip.
    juce::MemoryBlock state;
    processor.getStateInformation (state);
    TapAudioProcessor restored;
    restored.setStateInformation (state.getData(), (int) state.getSize());
    expect (juce::exactlyEqual (restored.apvts.getRawParameterValue (params::mode)->load(), 2.0f), "mode is saved and restored");

    processor.releaseResources();

    if (failures == 0)
        std::printf ("All plugin smoke tests passed\n");

    return failures == 0 ? EXIT_SUCCESS : EXIT_FAILURE;
}
