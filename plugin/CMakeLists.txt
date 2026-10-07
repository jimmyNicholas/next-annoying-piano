cmake_minimum_required(VERSION 3.22)

project(TheAnnoyingPiano VERSION 0.1.0 LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
    JUCE
    GIT_REPOSITORY https://github.com/juce-framework/JUCE.git
    GIT_TAG 8.0.9
    GIT_SHALLOW ON
)
FetchContent_MakeAvailable(JUCE)

# Built as an instrument that outputs MIDI. Ableton cannot load third-party
# MIDI effects, and only VST3 plugins can send MIDI out, so TAP sits on its own
# track and the instrument's track listens to it with "MIDI From".
juce_add_plugin(TheAnnoyingPiano
    COMPANY_NAME "Jimmy Nicholas"
    BUNDLE_ID com.jimmynicholas.theannoyingpiano
    PLUGIN_MANUFACTURER_CODE Jnic
    PLUGIN_CODE Tapn
    PRODUCT_NAME "The Annoying Piano"
    IS_SYNTH TRUE
    NEEDS_MIDI_INPUT TRUE
    NEEDS_MIDI_OUTPUT TRUE
    IS_MIDI_EFFECT FALSE
    EDITOR_WANTS_KEYBOARD_FOCUS FALSE
    COPY_PLUGIN_AFTER_BUILD FALSE
    VST3_CATEGORIES Instrument
    FORMATS VST3)

target_sources(TheAnnoyingPiano PRIVATE
    Source/PluginProcessor.cpp)

target_compile_definitions(TheAnnoyingPiano PUBLIC
    JUCE_WEB_BROWSER=0
    JUCE_USE_CURL=0
    JUCE_VST3_CAN_REPLACE_VST2=0)

target_link_libraries(TheAnnoyingPiano
    PRIVATE
        juce::juce_audio_utils
    PUBLIC
        juce::juce_recommended_config_flags
        juce::juce_recommended_lto_flags
        juce::juce_recommended_warning_flags)
