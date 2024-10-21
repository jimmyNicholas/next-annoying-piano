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

    return {
        reverbNode: reverbNode.current,
        reverbInterface: {
            name: reverbNode.current?.name,
            options: [
                {
                    title: 'Decay',
                    name: 'decay',
                    get: () => reverbNode.current?.get().decay,
                    set: (value: number) => reverbNode.current?.set({decay: value}),
                    min: 0.01,
                    max: 10,
                    step: 0.01,
                },
                {
                    title: 'Pre-Delay',
                    name: 'preDelay',
                    get: () => reverbNode.current?.get().preDelay,
                    set: (value: number) => reverbNode.current?.set({preDelay: value}),
                    min: 0.01,
                    max: 10,
                    step: 0.01,
                },
                {
                    title: 'Wet', 
                    name: 'wet',
                    get: () => reverbNode.current?.get().wet,
                    set: (value: number) => reverbNode.current?.set({wet: value}),
                    min: 0,
                    max: 1,
                    step: 0.01,
                },
            ]
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
            options: [
                {
                    title: 'Frequency', 
                    name: 'frequency',
                    get: () => vibratoNode.current?.get().frequency,
                    set: (value: number) => vibratoNode.current?.set({frequency: value}),
                    min: 1,
                    max: 100,
                    step: 1,
                },
                {
                    title: 'Depth', 
                    name: 'depth',
                    get: () => vibratoNode.current?.get().depth,
                    set: (value: number) => vibratoNode.current?.set({depth: value}),
                    min: 0,
                    max: 1,
                    step: 0.01,
                },
                {
                    title: 'Wet', 
                    name: 'wet',
                    get: () => vibratoNode.current?.get().wet,
                    set: (value: number) => vibratoNode.current?.set({wet: value}),
                    min: 0,
                    max: 1,
                    step: 0.01,
                },
            ],
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
