#pragma once

#include <juce_audio_basics/juce_audio_basics.h>

#include "TapEngine.h"

#include <atomic>

/** Marker sound: every voice can play every note. */
struct TapSound : public juce::SynthesiserSound
{
    bool appliesToNote (int) override    { return true; }
    bool appliesToChannel (int) override { return true; }
};

/**
    Replaces Tone.PolySynth(Tone.Synth): a triangle oscillator with Tone.Synth's
    default envelope (attack 0.005, decay 0.1, sustain 0.3, release 1).

    The voice plays whatever frequency TapEngine holds for the key at the time it
    is pressed, rather than the note's concert pitch.
*/
class TapVoice : public juce::SynthesiserVoice
{
public:
    explicit TapVoice (const tap::TapEngine& engine);

    bool canPlaySound (juce::SynthesiserSound*) override;
    void startNote (int midiNoteNumber, float velocity, juce::SynthesiserSound*, int currentPitchWheelPosition) override;
    void stopNote (float velocity, bool allowTailOff) override;
    void pitchWheelMoved (int) override {}
    void controllerMoved (int, int) override {}
    void renderNextBlock (juce::AudioBuffer<float>&, int startSample, int numSamples) override;
    void setCurrentPlaybackSampleRate (double newRate) override;

private:
    const tap::TapEngine& engine;
    juce::ADSR envelope;
    double phase = 0.0;
    double phaseDelta = 0.0;
    float level = 0.0f;
};

/**
    Synthesiser that tells TapEngine about every key release, in the same order as
    the incoming MIDI, so the mode is applied exactly where useKeyboard.ts applied it.
*/
class TapSynth : public juce::Synthesiser
{
public:
    explicit TapSynth (tap::TapEngine& engine);

    void noteOff (int midiChannel, int midiNoteNumber, float velocity, bool allowTailOff) override;

    /** Called from the audio thread before rendering each block. */
    void setModeSettings (const tap::ModeSettings& newSettings) { settings = newSettings; }

private:
    tap::TapEngine& engine;
    tap::ModeSettings settings;
};
