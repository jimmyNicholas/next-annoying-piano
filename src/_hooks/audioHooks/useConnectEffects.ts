import { useEffect } from "react";
import { ToneType } from "@/_lib/_types/types";
import useSynth from "./useSynth";
import useEffects from "./useEffects";


export function useConnectEffects( tone: typeof ToneType | null) {
    const polySynth = useSynth(tone);
    const effectsNodes = useEffects(tone);

    useEffect(() => { 
        if (!polySynth) return;
        const { gainNode, reverbNode, vibratoNode } = effectsNodes;
        if (vibratoNode) { polySynth.connect(vibratoNode) };
        if (reverbNode) { polySynth.connect(reverbNode) };
        if (gainNode) { polySynth.connect(gainNode) };
       
        return () => {
            if (polySynth) {
                polySynth.disconnect();
            }
        };
    }, [polySynth, effectsNodes]);

    return { polySynth, effectsNodes }; 
};