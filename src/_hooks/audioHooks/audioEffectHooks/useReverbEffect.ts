import { useContext, useEffect, useRef } from "react";
import { EffectInterface, Reverb } from "@/_lib/_types/types";
import { ToneContext } from "@/_components/MainApp"; 

/**
 * Interface for effect hook returns
 */
interface EffectHookReturn<T> {
    reverbNode: T | null;
    reverbInterface: EffectInterface;
};

/**
 * Custom hook that creates and manages a reverb effect node.
 * Provides both the node instance and a parameter control interface.
 * 
 * The reverb effect adds space and depth to the sound with configurable:
 * - Decay time (echo length)
 * - Pre-delay (initial delay before reverb)
 * - Wet/dry mix
 *
 * @example
 * const {reverbNode, reverbInterface} = useReverbEffect();
 * 
 * // Connect to audio chain
 * if (reverbNode) {
 *   inputNode.connect(reverbNode);
 * }
 * 
 * // Adjust reverb parameters
 * reverbInterface.options.find(opt => opt.name === 'decay')?.set(3.5);
 * reverbInterface.options.find(opt => opt.name === 'wet')?.set(0.5);
 *
 * @returns {EffectHookReturn<Reverb>} Object containing:
 *   - reverbNode: The reverb effect node (null before initialization)
 *   - reverbInterface: Control interface for reverb parameters
 */
const useReverbEffect = (): EffectHookReturn<Reverb> => {
    const tone = useContext(ToneContext);
    const reverbNode = useRef<Reverb | null>(null);

    // Initialise new effect and handle cleanup
    useEffect(() => { 
        if (!tone) return;

        reverbNode.current = new tone.Reverb(5).toDestination();

        return () => {
            reverbNode.current?.dispose();
            reverbNode.current = null;
        };
    }, [tone]);

    // Define effect parameter interface
    const reverbInterface: EffectInterface = {
        name: reverbNode.current?.name ?? 'Reverb',
        options: [
            {
                title: 'Decay',
                name: 'decay',
                get: () => reverbNode.current?.get().decay ?? 5,
                set: (value: number) => reverbNode.current?.set({decay: value}),
                min: 0.01,
                max: 10,
                step: 0.01,
            },
            {
                title: 'Pre-Delay',
                name: 'preDelay',
                get: () => reverbNode.current?.get().preDelay ?? 0.01,
                set: (value: number) => reverbNode.current?.set({preDelay: value}),
                min: 0.01,
                max: 10,
                step: 0.01,
            },
            {
                title: 'Wet', 
                name: 'wet',
                get: () => reverbNode.current?.get().wet ?? 1,
                set: (value: number) => reverbNode.current?.set({wet: value}),
                min: 0,
                max: 1,
                step: 0.01,
            },
        ]
    };

    return {
        reverbNode: reverbNode.current,
        reverbInterface
    };
}; 

export default useReverbEffect;
