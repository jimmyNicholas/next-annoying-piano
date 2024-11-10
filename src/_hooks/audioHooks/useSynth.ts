import { useContext, useEffect, useRef } from "react";
import { EffectInterface, PolySynth } from "@/_lib/_types/types";
import { ToneContext } from "@/_components/MainApp";

interface UseSynthHooks {
    polySynth: PolySynth | null;
    polySynthInterface: EffectInterface;
}

/**
 * Custom hook that creates and provides a new synth and interface
 * for controlling its parameters
 * 
 * The hook handles:
 * 1. Synth initialization using ToneContext
 * 2. Proper cleanup on unmount
 * 3. Volume parameter control interface
 * 
 * Note: The synth is stored in a ref to persist across renders and
 * prevent unnecessary recreations.
 * 
 * @example
 * const { 
        polySynth, 
        polySynthInterface
    } = useSynth();
 * 
 * // Adjust synth volume
 * polySynthInterface.options[0].set(-20); // Set volume to -20dB
 * 
 * // Get current volume
 * const currentVolume = polySynthInterface.options[0].get();
 * 
 * // Check if synth is available
 * if (polySynth) {
 *   // Use synth directly if needed
 *   polySynth.triggerAttack('C4');
 * }
 * 
 * @returns {UseSynthHooks} Synth and synth control interfaces
 * - polySynth: A polyphonic synthesizer (null before initialization)
 * - polySynthInterface: Polyphonic synthesizer parameter controls
 * - Currently supports volume control (-60dB to 0dB)
 */
const useSynth = (): UseSynthHooks => {
    const tone = useContext(ToneContext);
    const polySynth = useRef<PolySynth | null>(null);

    // Initialise new synth and handle cleanup
    useEffect(() => { 
        if (!tone) return;

        polySynth.current = new tone.PolySynth(tone.Synth);
        
        return () => {
            polySynth.current?.dispose();
        };
    }, [tone]);

    // Define synth parameter interface
    const polySynthInterface = {
        name: polySynth.current?.name,
        options: [
            {
                title: 'Volume',
                name: 'volume',
                get: () => polySynth.current?.volume.value,
                set: (value: number) => { 
                    if(polySynth.current) {
                        polySynth.current.volume.value = value;
                    }
                },
                min: -60,
                max: 0,
                step: 0.01,
            }
        ]
    }

    return {
        polySynth: polySynth.current, 
        polySynthInterface
    };
};

export default useSynth;
