import { useEffect } from "react";
import useSynth from "./useSynth";
import useEffects from "./useEffects";
import { EffectInterface, PolySynth } from "@/_lib/_types/types";

interface ConnectEffectsReturn {
    polySynth: PolySynth | null, 
    polySynthInterface: EffectInterface, 
    effectsInterfaces: {
        reverbInterface: EffectInterface;
        vibratoInterface: EffectInterface;
    };
};

/**
 * Custom hook that initialises and connects the synth and effects.
 * Provides a unified interface for synth and effect controls.
 * 
 * @description
 * This hook manages the complete audio processing pipeline by:
 * 1. Creating a polyphonic synthesizer instance
 * 2. Initializing reverb and vibrato effect nodes
 * 3. Connecting the synth output to the effects chain
 * 4. Providing interfaces to control synth and effect parameters
 * 
 * The hook handles proper cleanup of audio nodes on unmount to prevent memory leaks
 * and ensure proper Web Audio API resource management.
 * 
 * @example
 * const { 
 *  polySynth, 
 *  polySynthInterface,     
 *  effectsInterfaces 
 * } = useConnectEffects();
 * 
 * 
 * @returns {ConnectEffectsReturn} An object containing:
 * - polySynth: A polyphonic synthesizer instance (null before initialization)
 * - polySynthInterface: Controls for synthesizer parameters
 * - effectsInterfaces: Control interfaces for effect parameters:
 *      - reverbInterface: Controls for reverb delay, mix, etc.
 *      - vibratoInterface: Controls for vibrato rate, depth, etc.
 */
const useConnectEffects = (): ConnectEffectsReturn => {
    // Initialise synth and synth interface
    const { polySynth, polySynthInterface } = useSynth();

    // Initialise effects and effect interface
    const { effectsNodes, effectsInterfaces } = useEffects();

    useEffect(() => { 
        if (!polySynth) return;

        const { reverbNode, vibratoNode } = effectsNodes;

        // Connect available effect nodes
        if (reverbNode) { polySynth.connect(reverbNode) };
        if (vibratoNode) { polySynth.connect(vibratoNode) };
       
        // Cleanup: disconnect nodes when component unmounts
        return () => {
            if (polySynth) {
                polySynth.disconnect();
            }
        };
    }, [polySynth, effectsNodes]);
    
    return { 
        polySynth, 
        polySynthInterface, 
        effectsInterfaces 
    }; 
};

export default useConnectEffects;
