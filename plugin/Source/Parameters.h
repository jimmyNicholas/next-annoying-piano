#pragma once

#include <juce_audio_processors/juce_audio_processors.h>

/** Parameter IDs. Ranges and defaults mirror the web version's modes and effects. */
namespace params
{
    inline constexpr auto mode            = "mode";
    inline constexpr auto gravityStrength = "gravityStrength";
    inline constexpr auto moveSemitones   = "moveSemitones";

    inline constexpr auto volume          = "volume";

    inline constexpr auto vibratoFrequency = "vibratoFrequency";
    inline constexpr auto vibratoDepth     = "vibratoDepth";
    inline constexpr auto vibratoWet       = "vibratoWet";

    inline constexpr auto reverbDecay    = "reverbDecay";
    inline constexpr auto reverbPreDelay = "reverbPreDelay";
    inline constexpr auto reverbWet      = "reverbWet";

    inline const juce::StringArray modeNames { "Swap", "Gravity", "Move" };

    inline const juce::StringArray modeDescriptions {
        "Swaps pitch of the last released key with the previous key.",
        "Pulls the pitch of the previous key toward the last released key.",
        "Last released key moves up or down a specified number of semitones."
    };

    juce::AudioProcessorValueTreeState::ParameterLayout createLayout();
}
