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

    const polySynthInterface = {
        name: polySynth.current?.name,
        options: [
            {
                title: 'Volume',
                name: 'volume',
                get: () => polySynth.current?.volume.value,
                set: (value: number) => { if(polySynth.current) polySynth.current.volume.value = value},
                min: -60,
                max: 0,
                step: 0.01,
            }
        ]
    }

    return {polySynth: polySynth.current, polySynthInterface};
};

export default useSynth;
