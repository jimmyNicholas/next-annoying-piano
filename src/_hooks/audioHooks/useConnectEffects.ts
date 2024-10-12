import { useEffect } from "react";
import { ToneType } from "@/_lib/_types/types";
import useSynth from "./useSynth";
import useEffects from "./useEffects";


export function useConnectEffects( tone: typeof ToneType | null) {
    const polySynth = useSynth(tone);
    const effects = useEffects(tone);

    useEffect(() => { 
        if (polySynth && effects) {
            effects.map((effect) => {
                if (effect.node) {
                    polySynth.connect(effect.node)
                }
            });
        };
        return () => {
            if (polySynth) {
                polySynth.disconnect();
            }
        };
    }, [polySynth, effects]);

    return { polySynth, effects}; 
};