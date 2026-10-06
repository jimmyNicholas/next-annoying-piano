#include "PluginProcessor.h"
#include "PluginEditor.h"
#include "Parameters.h"

namespace
{
    constexpr int numVoices = 32; // Tone.PolySynth's default maximum polyphony
}

juce::AudioProcessorValueTreeState::ParameterLayout params::createLayout()
{
    using namespace juce;
    AudioProcessorValueTreeState::ParameterLayout layout;

    layout.add (std::make_unique<AudioParameterChoice> (ParameterID { mode, 1 }, "Mode", modeNames, 0));
    layout.add (std::make_unique<AudioParameterFloat> (ParameterID { gravityStrength, 1 }, "Gravity Strength",
                                                       NormalisableRange<float> ((float) tap::ranges::gravityMin, (float) tap::ranges::gravityMax, 0.1f), 2.0f));
    layout.add (std::make_unique<AudioParameterInt> (ParameterID { moveSemitones, 1 }, "Move Semitones",
                                                     tap::ranges::moveMin, tap::ranges::moveMax, 1));

    layout.add (std::make_unique<AudioParameterFloat> (ParameterID { volume, 1 }, "Volume",
                                                       NormalisableRange<float> (-60.0f, 0.0f, 0.01f), 0.0f,
                                                       AudioParameterFloatAttributes().withLabel ("dB")));

    layout.add (std::make_unique<AudioParameterFloat> (ParameterID { vibratoFrequency, 1 }, "Vibrato Frequency",
                                                       NormalisableRange<float> (1.0f, 100.0f, 1.0f), 5.0f,
                                                       AudioParameterFloatAttributes().withLabel ("Hz")));
    layout.add (std::make_unique<AudioParameterFloat> (ParameterID { vibratoDepth, 1 }, "Vibrato Depth",
                                                       NormalisableRange<float> (0.0f, 1.0f, 0.01f), 0.1f));
    layout.add (std::make_unique<AudioParameterFloat> (ParameterID { vibratoWet, 1 }, "Vibrato Wet",
                                                       NormalisableRange<float> (0.0f, 1.0f, 0.01f), 1.0f));

    layout.add (std::make_unique<AudioParameterFloat> (ParameterID { reverbDecay, 1 }, "Reverb Decay",
                                                       NormalisableRange<float> (0.01f, 10.0f, 0.01f), 5.0f,
                                                       AudioParameterFloatAttributes().withLabel ("s")));
    // The web version allowed up to 10 s of pre-delay. That makes a very long
    // impulse response, so the plugin caps it at 1 s.
    layout.add (std::make_unique<AudioParameterFloat> (ParameterID { reverbPreDelay, 1 }, "Reverb Pre-Delay",
                                                       NormalisableRange<float> (0.01f, 1.0f, 0.01f), 0.01f,
                                                       AudioParameterFloatAttributes().withLabel ("s")));
    layout.add (std::make_unique<AudioParameterFloat> (ParameterID { reverbWet, 1 }, "Reverb Wet",
                                                       NormalisableRange<float> (0.0f, 1.0f, 0.01f), 1.0f));

    return layout;
}

//==============================================================================
TapAudioProcessor::TapAudioProcessor()
    : AudioProcessor (BusesProperties().withOutput ("Output", juce::AudioChannelSet::stereo(), true)),
      apvts (*this, nullptr, "TapState", params::createLayout())
{
    modeParam             = apvts.getRawParameterValue (params::mode);
    gravityParam          = apvts.getRawParameterValue (params::gravityStrength);
    moveParam             = apvts.getRawParameterValue (params::moveSemitones);
    volumeParam           = apvts.getRawParameterValue (params::volume);
    vibratoFrequencyParam = apvts.getRawParameterValue (params::vibratoFrequency);
    vibratoDepthParam     = apvts.getRawParameterValue (params::vibratoDepth);
    vibratoWetParam       = apvts.getRawParameterValue (params::vibratoWet);
    reverbDecayParam      = apvts.getRawParameterValue (params::reverbDecay);
    reverbPreDelayParam   = apvts.getRawParameterValue (params::reverbPreDelay);
    reverbWetParam        = apvts.getRawParameterValue (params::reverbWet);

    for (int i = 0; i < numVoices; ++i)
        synth.addVoice (new TapVoice (engine));

    synth.addSound (new TapSound());

    publishCentsOffsets();
}

TapAudioProcessor::~TapAudioProcessor()
{
    stopTimer();
}

bool TapAudioProcessor::isBusesLayoutSupported (const BusesLayout& layouts) const
{
    const auto out = layouts.getMainOutputChannelSet();
    return out == juce::AudioChannelSet::stereo() || out == juce::AudioChannelSet::mono();
}

void TapAudioProcessor::prepareToPlay (double sampleRate, int samplesPerBlock)
{
    stopTimer();
    synth.setCurrentPlaybackSampleRate (sampleRate);

    const auto numChannels = (juce::uint32) juce::jmax (1, getTotalNumOutputChannels());
    const juce::dsp::ProcessSpec spec { sampleRate, (juce::uint32) samplesPerBlock, numChannels };

    vibrato.prepare (spec);
    reverb.setDecayAndPreDelay (reverbDecayParam->load(), reverbPreDelayParam->load());
    reverb.prepare (spec);

    synthBuffer.setSize ((int) numChannels, samplesPerBlock);
    vibratoBuffer.setSize ((int) numChannels, samplesPerBlock);
    reverbBuffer.setSize ((int) numChannels, samplesPerBlock);

    outputGain.reset (sampleRate, 0.02);
    outputGain.setCurrentAndTargetValue (juce::Decibels::decibelsToGain (volumeParam->load(), -60.0f));

    keyboardState.reset();

    // Reverb impulse responses are rebuilt on the message thread.
    startTimerHz (10);
}

double TapAudioProcessor::getTailLengthSeconds() const
{
    return 1.0 + (double) reverbDecayParam->load() + (double) reverbPreDelayParam->load();
}

tap::ModeSettings TapAudioProcessor::readModeSettings() const
{
    tap::ModeSettings settings;
    settings.mode = (tap::Mode) juce::jlimit (0, 2, (int) modeParam->load());
    settings.gravityStrength = (double) gravityParam->load();
    settings.moveSemitones = (int) std::lround (moveParam->load());
    return settings;
}

void TapAudioProcessor::publishCentsOffsets()
{
    for (int note = 0; note < tap::TapEngine::numNotes; ++note)
    {
        const auto ratio = engine.frequencyForNote (note) / tap::midiNoteToHertz (note);
        centsOffsets[(size_t) note].store ((float) (1200.0 * std::log2 (ratio)), std::memory_order_relaxed);
    }
}

void TapAudioProcessor::processBlock (juce::AudioBuffer<float>& buffer, juce::MidiBuffer& midi)
{
    juce::ScopedNoDenormals noDenormals;

    const auto numSamples = buffer.getNumSamples();
    const auto numChannels = buffer.getNumChannels();

    // Notes played on the editor's on-screen keyboard.
    keyboardState.processNextMidiBuffer (midi, 0, numSamples, true);

    const auto settings = readModeSettings();

    // Changing mode resets the pitch table, as useMode.ts does.
    if (resetRequested.exchange (false) || settings.mode != lastMode)
        engine.reset();

    lastMode = settings.mode;
    synth.setModeSettings (settings);

    // Hosts may send a bigger block than promised in prepareToPlay.
    if (synthBuffer.getNumSamples() < numSamples || synthBuffer.getNumChannels() < numChannels)
    {
        synthBuffer.setSize (numChannels, numSamples, false, false, true);
        vibratoBuffer.setSize (numChannels, numSamples, false, false, true);
        reverbBuffer.setSize (numChannels, numSamples, false, false, true);
    }

    juce::AudioBuffer<float> synthView (synthBuffer.getArrayOfWritePointers(), numChannels, numSamples);
    juce::AudioBuffer<float> vibratoView (vibratoBuffer.getArrayOfWritePointers(), numChannels, numSamples);
    juce::AudioBuffer<float> reverbView (reverbBuffer.getArrayOfWritePointers(), numChannels, numSamples);

    synthView.clear();
    synth.renderNextBlock (synthView, midi, 0, numSamples);

    outputGain.setTargetValue (juce::Decibels::decibelsToGain (volumeParam->load(), -60.0f));
    outputGain.applyGain (synthView, numSamples);

    // Like the web version, the synth feeds the vibrato and the reverb in parallel
    // and their outputs are summed. There is no separate dry path.
    vibrato.setFrequency (vibratoFrequencyParam->load());
    vibrato.setDepth (vibratoDepthParam->load());
    vibrato.setWet (vibratoWetParam->load());
    vibrato.process (synthView, vibratoView);

    reverb.setWet (reverbWetParam->load());
    reverb.process (synthView, reverbView);

    buffer.clear();
    for (int channel = 0; channel < numChannels; ++channel)
    {
        buffer.addFrom (channel, 0, vibratoView, channel, 0, numSamples);
        buffer.addFrom (channel, 0, reverbView, channel, 0, numSamples);
    }

    publishCentsOffsets();
}

void TapAudioProcessor::timerCallback()
{
    reverb.setDecayAndPreDelay (reverbDecayParam->load(), reverbPreDelayParam->load());
}

juce::AudioProcessorEditor* TapAudioProcessor::createEditor()
{
    return new TapAudioProcessorEditor (*this);
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
