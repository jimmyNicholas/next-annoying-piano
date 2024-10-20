import { useCallback, useContext, useEffect, useRef } from "react";
import { Gain, Reverb, ToneType, Vibrato } from "@/_lib/_types/types";
import { ToneContext } from "@/_components/MainApp";
import { RecursivePartial } from "tone/build/esm/core/util/Interface";

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

    const set = useCallback((props: RecursivePartial<GainOptions>) => {
        return gainNode.current?.set(props);
    }, [gainNode]);

    return {
        gainNode: gainNode.current,
        gainInterface: {
            name: gainNode.current?.name,
            get: () => gainNode.current?.get(),
            set
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
            get: () => reverbNode.current?.get(),
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

    const set = useCallback((props: RecursivePartial<ToneType.VibratoOptions>) => {
        return vibratoNode.current?.set(props);
    }, [vibratoNode]);

    return {
        vibratoNode: vibratoNode.current,
        vibratoInterface: {
            name: vibratoNode.current?.name,
            get: () => vibratoNode.current?.get(),
            set,
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
