import { EffectInterface, Reverb, Vibrato } from "@/_lib/_types/types";
import useReverbEffect from "./audioEffectHooks/useReverbEffect";
import useVibratoEffect from "./audioEffectHooks/useVibratoEffect";

interface EffectsReturn {
    effectsNodes: {
        reverbNode: Reverb | null;
        vibratoNode: Vibrato | null;
    };
    effectsInterfaces: {
        reverbInterface: EffectInterface;
        vibratoInterface: EffectInterface;
    };
};

/**
 * Custom hook that aggregates multiple audio effect hooks into a single interface.
 * 
 * @description
 * This hook serves as a central manager for audio effects by:
 * 1. Initializing individual effect hooks (reverb and vibrato)
 * 2. Organizing effect nodes and their control interfaces
 * 3. Providing a unified interface for accessing all effects
 * 
 * Each effect hook manages its own Web Audio nodes and parameter controls,
 * while this hook combines them into a structured format for easier consumption
 * by parent components.
 * 
 * @returns {EffectsReturn} An object containing:
 * - effectsNodes: Audio processing nodes for each effect
 *   - reverbNode: Web Audio node for reverb processing
 *   - vibratoNode: Web Audio node for vibrato processing
 * - effectsInterfaces: Control interfaces for modifying effect parameters
 *   - reverbInterface: Controls for reverb parameters
 *   - vibratoInterface: Controls for vibrato parameters
 * 
 * @example
 * ```tsx
 * function AudioProcessor() {
 *   const { effectsNodes, effectsInterfaces } = useEffects();
 *   
 *   // Connect audio source to effects
 *   audioSource.connect(effectsNodes.reverbNode);
 *   audioSource.connect(effectsNodes.vibratoNode);
 *   
 *   // Adjust effect parameters
 *   reverbInterface.options.find(opt => opt.name === 'decay')?.set(3.5);
 *   vibratoInterface.options.find(opt => opt.name === 'frequency')?.set(6);
 *   
 *   return <div>Audio Effects Controls</div>;
 * }
 * ```
*/
const useEffects = (): EffectsReturn => {
    // Initialize reverb effect and its interface
    const {reverbNode, reverbInterface} = useReverbEffect();

    // Initialize vibrato effect and its interface
    const {vibratoNode, vibratoInterface} = useVibratoEffect();
    
    return { 
        effectsNodes: { 
            reverbNode,
            vibratoNode,
        },
        effectsInterfaces: {
            reverbInterface,
            vibratoInterface,
        } 
    };
};

export default useEffects;
