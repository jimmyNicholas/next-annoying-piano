import { useContext, useEffect, useState } from "react";
import { PolySynth } from "@/_lib/_types/types";
import { ToneContext } from "@/_components/MainApp";

const useSynth = () => {
    const tone = useContext(ToneContext);
    const [ polySynth, setPolySynth] = useState<PolySynth | null>(null);

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
