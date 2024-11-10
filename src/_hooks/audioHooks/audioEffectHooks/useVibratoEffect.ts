import { useContext, useEffect, useRef } from "react";
import { EffectInterface, Vibrato } from "@/_lib/_types/types";
import { ToneContext } from "@/_components/MainApp"; 

/**
 * Interface for effect hook returns
 */
interface EffectHookReturn<T> {
    vibratoNode: T | null;
    vibratoInterface: EffectInterface;
};

/**
 * Custom hook that creates and manages a vibrato effect node.
 * Provides both the node instance and a parameter control interface.
 * 
 * The vibrato effect creates periodic pitch modulation with configurable:
 * - Frequency (speed of vibrato)
 * - Depth (intensity of pitch variation)
 * - Wet/dry mix
 *
 * @example
 * const { vibratoNode, vibratoInterface } = useVibratoEffect();
 * 
 * // Connect to audio chain
 * if (vibratoNode) {
 *   inputNode.connect(vibratoNode);
 * }
 * 
 * // Adjust vibrato parameters
 * vibratoInterface.options.find(opt => opt.name === 'frequency')?.set(6);
 * vibratoInterface.options.find(opt => opt.name === 'depth')?.set(0.3);
 *
 * @returns {EffectHookReturn<Vibrato>} Object containing:
 *   - vibratoNode: The vibrato effect node (null before initialization)
 *   - vibratoInterface: Control interface for vibrato parameters
 */
const useVibratoEffect = (): EffectHookReturn<Vibrato> => {
    const tone = useContext(ToneContext);
    const vibratoNode = useRef<Vibrato | null>(null);

    useEffect(() => { 
        if (!tone) return;

        vibratoNode.current = new tone.Vibrato().toDestination();
        
        return () => {
            vibratoNode.current?.dispose();
            vibratoNode.current = null;
        };
    }, [tone]);

    const vibratoInterface: EffectInterface = {
        name: vibratoNode.current?.name ?? 'Vibrato',
        options: [
            {
                title: 'Frequency', 
                name: 'frequency',
                get: () => vibratoNode.current?.get().frequency as number ?? 5,
                set: (value: number) => vibratoNode.current?.set({frequency: value}),
                min: 1,
                max: 100,
                step: 1,
            },
            {
                title: 'Depth', 
                name: 'depth',
                get: () => vibratoNode.current?.get().depth ?? 0.1,
                set: (value: number) => vibratoNode.current?.set({depth: value}),
                min: 0,
                max: 1,
                step: 0.01,
            },
            {
                title: 'Wet', 
                name: 'wet',
                get: () => vibratoNode.current?.get().wet ?? 0,
                set: (value: number) => vibratoNode.current?.set({wet: value}),
                min: 0,
                max: 1,
                step: 0.01,
            },
        ],
    }

    return {
        vibratoNode: vibratoNode.current,
        vibratoInterface
    };
};

export default useVibratoEffect;
