import { useCallback, useEffect, useState } from "react";
import { ToneType } from "@/_lib/_types/types";

const useGainEffect = (tone: typeof ToneType | null) => {
    const [gainNode, setGainNode] = useState<ToneType.Gain | null>(null);

    useEffect(() => { 
        if (!tone) return;
        const newGain = new tone.Gain(0).toDestination();
        setGainNode(newGain);

        return () => {
            newGain.dispose();
        };
    }, [tone]);

    const setGain = useCallback((value: number) => {
        if (gainNode) {
          gainNode.gain.rampTo(value, 0.1);
        }
    }, [gainNode]);

    return { gainNode, setGain };
};   

const useReverbEffect = (tone: typeof ToneType | null) => {
    const [reverbNode, setReverbNode] = useState<ToneType.Reverb | null>(null);

    useEffect(() => { 
        if (!tone) return;
        const newReverb = new tone.Reverb(5).toDestination();
        setReverbNode(newReverb);

        return () => {
            newReverb.dispose();
        };
    }, [tone]);

    const setDecay = useCallback((time: number) => {
        if (reverbNode) {
          reverbNode.decay = time;
        }
    }, [reverbNode]);

    return { reverbNode, setDecay };
};   

const useVibratoEffect = (tone: typeof ToneType | null) => {
    const [vibratoNode, setVibratoNode] = useState<ToneType.Vibrato | null>(null);

    useEffect(() => { 
        if (!tone) return;
        const newVibrato = new tone.Vibrato().toDestination();
        setVibratoNode(newVibrato);

        return () => {
            newVibrato.dispose();
        };
    }, [tone]);

    return { vibratoNode };
};

const useEffects = (tone: typeof ToneType | null) => {
    const { gainNode, setGain } = useGainEffect(tone);
    const { reverbNode, setDecay } = useReverbEffect(tone);
    const { vibratoNode } = useVibratoEffect(tone);

    const effects = [
        {
            node: vibratoNode,
            title: vibratoNode?.name,
        },
        {
            node: reverbNode,
            title: reverbNode?.name,
            decayValue: reverbNode?.decay,
            setDecay,
            minDecay: 0,
            maxDecay: 5,
        },
        {
            node: gainNode,
            title: gainNode?.name,
            gainValue: gainNode?.get().gain,
            setGain,
            minGain: 0,
            maxGain: 5,
        }
    ];
    return effects;
};

export default useEffects;
