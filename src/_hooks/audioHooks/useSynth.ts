import { useEffect, useState } from "react";
import { ToneType } from "@/_lib/_types/types";

const useSynth = (tone: typeof ToneType | null) => {
    const [ polySynth, setPolySynth] = useState<ToneType.PolySynth | null>(null);

    useEffect(() => { 
        if (!tone) return;
        const newPolySynth = new tone.PolySynth(tone.Synth);
        setPolySynth(newPolySynth);

        return () => {
            newPolySynth.dispose();
        };
    }, [tone]);

    return polySynth;
};

export default useSynth;
