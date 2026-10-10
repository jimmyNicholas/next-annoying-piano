#include "PluginProcessor.h"

namespace
{
    juce::AudioProcessorValueTreeState::ParameterLayout createLayout()
    {
        juce::AudioProcessorValueTreeState::ParameterLayout layout;

        // Temporary, for the ticket 02 MPE test. Replaced by the pitch table in ticket 03.
        layout.add (std::make_unique<juce::AudioParameterFloat> (juce::ParameterID { "detune", 1 }, "Detune",
                                                                 juce::NormalisableRange<float> (-100.0f, 100.0f, 1.0f), 0.0f,
                                                                 juce::AudioParameterFloatAttributes().withLabel ("cents")));

        // Detuning only the black keys proves each note gets its own pitch: a held
        // white key must stay in tune when a detuned black key is added.
        layout.add (std::make_unique<juce::AudioParameterChoice> (juce::ParameterID { "detuneKeys", 1 }, "Detune Keys",
                                                                  juce::StringArray { "Black keys only", "All keys" }, 0));
        return layout;
    }

    bool isBlackKey (int note)
    {
        switch (note % 12)
        {
            case 1: case 3: case 6: case 8: case 10: return true;
            default: return false;
        }
    }
}

TapAudioProcessor::TapAudioProcessor()
    : AudioProcessor (BusesProperties().withOutput ("Output", juce::AudioChannelSet::stereo(), true)),
      apvts (*this, nullptr, "TapState", createLayout())
{
    detuneParam = apvts.getRawParameterValue ("detune");
    detuneKeysParam = apvts.getRawParameterValue ("detuneKeys");
}

bool TapAudioProcessor::isBusesLayoutSupported (const BusesLayout& layouts) const
{
    const auto out = layouts.getMainOutputChannelSet();
    return out == juce::AudioChannelSet::stereo() || out == juce::AudioChannelSet::mono();
}

void TapAudioProcessor::prepareToPlay (double, int)
{
    router.reset();
}

void TapAudioProcessor::processBlock (juce::AudioBuffer<float>& buffer, juce::MidiBuffer& midi)
{
    buffer.clear();

    const auto detune = (double) detuneParam->load();
    const auto allKeys = detuneKeysParam->load() >= 0.5f;

    router.process (midi, [detune, allKeys] (int note)
    {
        return allKeys || isBlackKey (note) ? detune : 0.0;
    });
}

juce::AudioProcessorEditor* TapAudioProcessor::createEditor()
{
    return new juce::GenericAudioProcessorEditor (*this);
}

void TapAudioProcessor::getStateInformation (juce::MemoryBlock& destData)
{
    if (auto xml = apvts.copyState().createXml())
        copyXmlToBinary (*xml, destData);
}

void TapAudioProcessor::setStateInformation (const void* data, int sizeInBytes)
{
    if (auto xml = getXmlFromBinary (data, sizeInBytes))
        if (xml->hasTagName (apvts.state.getType()))
            apvts.replaceState (juce::ValueTree::fromXml (*xml));
}

juce::AudioProcessor* JUCE_CALLTYPE createPluginFilter()
{
    return new TapAudioProcessor();
}
