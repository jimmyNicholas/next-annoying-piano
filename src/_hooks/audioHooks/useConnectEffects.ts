import { useEffect } from "react";
import { ToneType } from "@/_lib/_types/types";
import useSynth from "./useSynth";
import useEffects from "./useEffects";


export function useConnectEffects( tone: typeof ToneType | null) {
    const polySynth = useSynth(tone);
    const {effectsNodes, effectsOptions} = useEffects(tone);

    useEffect(() => { 
        if (polySynth && effectsNodes) {
            effectsNodes.map((node) => {
                if (node) {
                    polySynth.connect(node)
                }
            });
        };
        return () => {
            if (polySynth) {
                polySynth.disconnect();
            }
        };
    }, [polySynth, effectsNodes]);

    return { polySynth, effectsOptions}; 
};