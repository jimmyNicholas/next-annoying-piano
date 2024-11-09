import { useEffect } from "react";
import useSynth from "./useSynth";
import useEffects from "./useEffects";

export function useConnectEffects() {
    const {polySynth, polySynthInterface} = useSynth();
    const {effectsNodes, effectsInterfaces} = useEffects();

    useEffect(() => { 
        if (!polySynth) return;
        const { reverbNode, vibratoNode } = effectsNodes;
        if (reverbNode) { polySynth.connect(reverbNode) };
        if (vibratoNode) { polySynth.connect(vibratoNode) };
       
        return () => {
            if (polySynth) {
                polySynth.disconnect();
            }
        };
    }, [polySynth, effectsNodes]);
    
    return { polySynth, polySynthInterface, effectsInterfaces }; 
};
