import { EffectInterface, Emitter, HertzPlayback } from '@/_lib/_types/types';
import { useConnectEffects } from './audioHooks/useConnectEffects';
import useHertzPlayback from './audioHooks/useHertzPlayback';

interface UseAudioHooks {
    hertzPlayback: HertzPlayback;
    keyEmitter: Emitter | null;
    polySynthInterface: EffectInterface;
    effectsInterfaces: {
        reverbInterface: EffectInterface;
        vibratoInterface: EffectInterface;
    };
};

/**
 * Custom hook that combines audio synthesis and effects functionality
 * Provides a unified interface for audio playback, key events, and effect controls.
 * 
 * This hook manages the complete audio pipeline by:
 * 1. Setting up the polyphonic synthesizer with effects chain
 * 2. Initializing frequency-based playback controls
 * 3. Creating an event system for keyboard interaction
 * 
 * @example
 * const { 
 *  hertzPlayback, 
 *  keyEmitter, 
 *  polySynthInterface, 
 *  effectsInterfaces 
 * } = useAudio();
 * 
 * // Control frequency playback
 * hertzPlayback.onKeyDown(440); // Play A4
 * hertzPlayback.onKeyUp(440);   // Release A4 
 * 
 * // Listen to keyboard events
 * keyEmitter.on('keyDown', (note) => {
 *   console.log(`Note pressed: ${note}`);
 * });
 * 
 * @returns {UseAudioHooks} An object containing:
 *  - hertzPlayback: Controls for playing and releasing frequencies
 *  - keyEmitter: Event emitter for keyboard events
 *  - polySynthInterface: Interface for controlling the polyphonic synthesizer
 *  - effectsInterfaces: Interfaces for controlling audio effects
 */

const useAudio = (): UseAudioHooks => {
    // Initialise synth and effects chain
    const { 
        polySynth, 
        polySynthInterface, 
        effectsInterfaces 
    } = useConnectEffects();

    // Setup playback and key event handling 
    const { 
        hertzPlayback, 
        keyEmitter 
    } = useHertzPlayback(polySynth);
    
    return { 
        hertzPlayback, 
        keyEmitter, 
        polySynthInterface, 
        effectsInterfaces
    }
};

export default useAudio;
