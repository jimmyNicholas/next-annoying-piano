import { useContext, useEffect, useRef } from "react";
import { PolySynth } from "@/_lib/_types/types";
import { ToneContext } from "@/_components/MainApp";

const useSynth = () => {
    const tone = useContext(ToneContext);
    const polySynth = useRef<PolySynth | null>(null);

    useEffect(() => { 
        if (!tone) return;
        polySynth.current = new tone.PolySynth(tone.Synth);

        return () => {
            polySynth.current?.dispose();
        };
    }, [tone]);

    return polySynth.current;
};

export default useSynth;
