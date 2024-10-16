import { useContext, useEffect, useRef } from "react";
import { Gain, Reverb, Vibrato } from "@/_lib/_types/types";
import { ToneContext } from "@/_components/MainApp";

const useGainEffect = () => {
    const tone = useContext(ToneContext);
    const gainNode = useRef<Gain | null>(null);

    useEffect(() => { 
        if (!tone) return;
        gainNode.current = new tone.Gain(0).toDestination();

        return () => {
            gainNode.current?.dispose();
        };
    }, [tone]);

    return gainNode.current;
};   

const useReverbEffect = () => {
    const tone = useContext(ToneContext);
    const reverbNode = useRef<Reverb | null>(null);

    useEffect(() => { 
        if (!tone) return;
        reverbNode.current = new tone.Reverb(5).toDestination();

        return () => {
            reverbNode.current?.dispose();
        };
    }, [tone]);

    return reverbNode.current;
};   

const useVibratoEffect = () => {
    const tone = useContext(ToneContext);
    const vibratoNode = useRef<Vibrato | null>(null);

    useEffect(() => { 
        if (!tone) return;
        vibratoNode.current = new tone.Vibrato().toDestination();

        return () => {
            vibratoNode.current?.dispose();
        };
    }, [tone]);

    return vibratoNode.current;
};

const useEffects = () => {
    const gainNode = useGainEffect();
    const reverbNode = useReverbEffect();
    const vibratoNode = useVibratoEffect();

    return { gainNode, reverbNode, vibratoNode };
};

export default useEffects;
