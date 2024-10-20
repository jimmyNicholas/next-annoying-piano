import { useCallback, useContext, useEffect, useRef } from "react";
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

    const getVolume = useCallback(() => {
        return gainNode.current?.get().gain;
    }, [gainNode]);

    const setVolume = useCallback((volume: number) => {
        gainNode.current?.set({gain: volume});
    }, [gainNode]);

    return {
        gainNode: gainNode.current,
        gainInterface: {
            name: gainNode.current?.name,
            getVolume,
            setVolume,
            minVolume: 0,
            maxVolume: 5,
        }
    };
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

    const get = useCallback(() => {
        return reverbNode.current?.get();
    }, [reverbNode])

    // Tone.js doens't have an exportable ReverbOptions Type as yet
    const set = useCallback((prop: 'decay' | 'preDelay' | 'wet', value: number) => {
        try {
            switch (prop) {
                case 'decay':
                    reverbNode.current?.set({decay: value});
                    return true;
                case 'preDelay':
                    reverbNode.current?.set({preDelay: value});
                    return true;
                case 'wet':
                    reverbNode.current?.set({wet: value});
                    return true;
                default:
                    return false;
            }
        } catch (error) {
            console.error(error);
            return false;   
        }
    }, [reverbNode]);

    return {
        reverbNode: reverbNode.current,
        reverbInterface: {
            name: reverbNode.current?.name,
            get,
            set,
        }
    }; 
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

    const getWet = useCallback(() => {
        return vibratoNode.current?.get().wet;
    }, [vibratoNode]);

    const setWet = useCallback((value: number) => {
        if (value < 0 || value > 1) return;
        vibratoNode.current?.set({wet: value});
    },[vibratoNode]);

    return {
        vibratoNode: vibratoNode.current,
        vibratoInterface: {
            name: vibratoNode.current?.name,
            getWet,
            setWet,
            minWet: 0,
            maxWet: 1,
        }
    };
};

const useEffects = () => {
    const {gainNode, gainInterface} = useGainEffect();
    const {reverbNode, reverbInterface} = useReverbEffect();
    const {vibratoNode, vibratoInterface} = useVibratoEffect();

    return { 
        effectsNodes: { 
            gainNode, 
            reverbNode, 
            vibratoNode
        },
        effectsInterfaces: {
            gainInterface,
            reverbInterface,
            vibratoInterface
        } 
    };
};

export default useEffects;
