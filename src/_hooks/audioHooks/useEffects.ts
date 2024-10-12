import { useEffect, useRef } from "react";
import { ToneType, Gain, Reverb, Vibrato } from "@/_lib/_types/types";

const useGainEffect = (tone: typeof ToneType | null) => {
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

const useReverbEffect = (tone: typeof ToneType | null) => {
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

const useVibratoEffect = (tone: typeof ToneType | null) => {
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

const useEffects = (tone: typeof ToneType | null) => {
    const gainNode = useGainEffect(tone);
    const reverbNode = useReverbEffect(tone);
    const vibratoNode = useVibratoEffect(tone);

    return { gainNode, reverbNode, vibratoNode };
};

export default useEffects;
