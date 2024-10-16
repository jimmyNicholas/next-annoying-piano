import { useEffect } from "react";
import useSynth from "./useSynth";
import useEffects from "./useEffects";

export function useConnectEffects() {
    const polySynth = useSynth();
    const effectsNodes = useEffects();

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
