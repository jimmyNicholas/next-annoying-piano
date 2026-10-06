cmake_minimum_required(VERSION 3.22)

project(TheAnnoyingPiano VERSION 0.1.0 LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

option(TAP_BUILD_PLUGIN "Build the JUCE plugin (downloads JUCE)" ON)
option(TAP_BUILD_TESTS "Build the core unit tests" ON)

# Portable core: pitch table and modes, no JUCE dependency.
add_library(tap_core STATIC Source/core/TapEngine.cpp)
target_include_directories(tap_core PUBLIC Source/core)
set_target_properties(tap_core PROPERTIES POSITION_INDEPENDENT_CODE ON)

if(TAP_BUILD_TESTS)
    enable_testing()
    add_executable(tap_core_tests tests/TapEngineTests.cpp)
    target_link_libraries(tap_core_tests PRIVATE tap_core)
    add_test(NAME tap_core_tests COMMAND tap_core_tests)
endif()

if(NOT TAP_BUILD_PLUGIN)
    return()
endif()

include(FetchContent)
FetchContent_Declare(
    JUCE
    GIT_REPOSITORY https://github.com/juce-framework/JUCE.git
    GIT_TAG 8.0.9
    GIT_SHALLOW ON
)
FetchContent_MakeAvailable(JUCE)

juce_add_plugin(TheAnnoyingPiano
    COMPANY_NAME "Jimmy Nicholas"
    PLUGIN_MANUFACTURER_CODE Jnic
    PLUGIN_CODE Tapn
    BUNDLE_ID com.jimmynicholas.theannoyingpiano
    PRODUCT_NAME "The Annoying Piano"
    IS_SYNTH TRUE
    NEEDS_MIDI_INPUT TRUE
    NEEDS_MIDI_OUTPUT FALSE
    IS_MIDI_EFFECT FALSE
    EDITOR_WANTS_KEYBOARD_FOCUS FALSE
    COPY_PLUGIN_AFTER_BUILD FALSE
    VST3_CATEGORIES Instrument Synth
    AU_MAIN_TYPE kAudioUnitType_MusicDevice
    FORMATS VST3 AU Standalone)

target_sources(TheAnnoyingPiano PRIVATE
    Source/PluginProcessor.cpp
    Source/PluginEditor.cpp
    Source/TapSynth.cpp
    Source/TapEffects.cpp)

target_compile_definitions(TheAnnoyingPiano PUBLIC
    JUCE_WEB_BROWSER=0
    JUCE_USE_CURL=0
    JUCE_VST3_CAN_REPLACE_VST2=0)

target_link_libraries(TheAnnoyingPiano
    PRIVATE
        tap_core
        juce::juce_audio_utils
        juce::juce_dsp
    PUBLIC
        juce::juce_recommended_config_flags
        juce::juce_recommended_lto_flags
        juce::juce_recommended_warning_flags)

if(TAP_BUILD_TESTS)
    # Drives the real processor without a host.
    add_executable(tap_plugin_smoke_test tests/PluginSmokeTest.cpp)
    target_link_libraries(tap_plugin_smoke_test PRIVATE TheAnnoyingPiano)
    target_include_directories(tap_plugin_smoke_test PRIVATE
        $<TARGET_PROPERTY:TheAnnoyingPiano,INCLUDE_DIRECTORIES>)
    target_compile_definitions(tap_plugin_smoke_test PRIVATE
        $<TARGET_PROPERTY:TheAnnoyingPiano,COMPILE_DEFINITIONS>)
    add_test(NAME tap_plugin_smoke_test COMMAND tap_plugin_smoke_test)
endif()
