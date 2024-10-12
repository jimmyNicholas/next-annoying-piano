import { useCallback, useEffect, useRef, useState } from 'react';
import { Note, ToneType } from '@/_lib/_types/types';

// load tone
export function useLoadAudio() {
    const [audioIsLoaded, setAudioIsLoaded] = useState<boolean>(false);
    const [ tone, setTone ] = useState<typeof ToneType | null>(null);
    
    const startAudio = useCallback(async () => {
        if (audioIsLoaded) return;
        const Tone = await import('tone') as typeof ToneType;
        setTone(Tone);
        await Tone.start()
            .then(() => setAudioIsLoaded(true))
            .catch((err) => console.error('Failed to start audio: ', err));
    }, [audioIsLoaded]);

    useEffect(() => {
        if (audioIsLoaded) return;

        const handleInteraction = () => {
            startAudio();
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction); 
            
        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, [audioIsLoaded, startAudio]);

    return { audioIsLoaded, tone };
};

// declare synth
export function useSynth(audioIsLoaded: boolean, tone: typeof ToneType | null) {
    const [ polySynth, setPolySynth] = useState<ToneType.PolySynth | null>(null);

    useEffect(() => { 
        if (!audioIsLoaded || !tone) return;
        const newPolySynth = new tone.PolySynth(tone.Synth);
        setPolySynth(newPolySynth);

        return () => {
            newPolySynth.dispose();
        };
    }, [audioIsLoaded, tone]);

    return polySynth;
};

// declare effects
const useGainEffect = (audioIsLoaded: boolean, tone: typeof ToneType | null) => {
    const [gainNode, setGainNode] = useState<ToneType.Gain | null>(null);

    useEffect(() => { 
        if (!audioIsLoaded || !tone) return;
        const newGain = new tone.Gain(0).toDestination();
        setGainNode(newGain);

        return () => {
            newGain.dispose();
        };
    }, [audioIsLoaded, tone]);

    const setGain = useCallback((value: number) => {
        if (gainNode) {
          gainNode.gain.rampTo(value, 0.1);
        }
    }, [gainNode]);

    return { gainNode, setGain };
};   

const useReverbEffect = (audioIsLoaded: boolean, tone: typeof ToneType | null) => {
    const [reverbNode, setReverbNode] = useState<ToneType.Reverb | null>(null);

    useEffect(() => { 
        if (!audioIsLoaded || !tone) return;
        const newReverb = new tone.Reverb(5).toDestination();
        setReverbNode(newReverb);

        return () => {
            newReverb.dispose();
        };
    }, [audioIsLoaded, tone]);

    const setDecay = useCallback((time: number) => {
        if (reverbNode) {
          reverbNode.decay = time;
        }
    }, [reverbNode]);

    return { reverbNode, setDecay };
};   

const useVibratoEffect = (audioIsLoaded: boolean, tone: typeof ToneType | null) => {
    const [vibratoNode, setVibratoNode] = useState<ToneType.Vibrato | null>(null);

    useEffect(() => { 
        if (!audioIsLoaded || !tone) return;
        const newVibrato = new tone.Vibrato().toDestination();
        setVibratoNode(newVibrato);

        return () => {
            newVibrato.dispose();
        };
    }, [audioIsLoaded, tone]);

    return { vibratoNode };
};

// chain the effects together
export function useConnectEffects(audioIsLoaded: boolean, tone: typeof ToneType | null) {
    const polySynth = useSynth(audioIsLoaded, tone);
    const { gainNode, setGain } = useGainEffect(audioIsLoaded, tone);
    const { reverbNode, setDecay } = useReverbEffect(audioIsLoaded, tone);
    const { vibratoNode } = useVibratoEffect(audioIsLoaded, tone);

    useEffect(() => { 
        if (polySynth && gainNode && reverbNode && vibratoNode) {
            polySynth
                .connect(vibratoNode)
                .connect(reverbNode)
                .connect(gainNode)    
        };
        return () => {
            if (polySynth) {
                polySynth.disconnect();
            }
        };
    }, [polySynth, gainNode, reverbNode]);

    const effects = [
        {
            title: vibratoNode?.name,
        },
        {
            title: reverbNode?.name,
            decayValue: reverbNode?.decay,
            setDecay,
            minDecay: 0,
            maxDecay: 5,
        },
        {
            title: gainNode?.name,
            gainValue: gainNode?.get().gain,
            setGain,
            minGain: 0,
            maxGain: 5,
        }
    ];
    return { polySynth, effects}; 
};

// add playback functions
export function useHertzPlayback(audioIsLoaded: boolean, tone: typeof ToneType | null, polySynth: ToneType.PolySynth | null) {
    const playingNotes = useRef<Note[]>([]);

    const playHertz = useCallback((keyName: string, hertz: number): void => {
        if (!audioIsLoaded || !tone || !polySynth) return;
        polySynth.triggerAttack(hertz, tone.now());
        playingNotes.current.push({keyName, hertz})
    }, [audioIsLoaded, tone, polySynth]);

    const stopHertz = useCallback((keyName: string): void => {
        if (!audioIsLoaded || !tone || !polySynth) return;
        const currentNote = playingNotes.current.find((playingNote) => {return playingNote.keyName === keyName });
        if (typeof currentNote === 'undefined') return;
        polySynth.triggerRelease(currentNote.hertz, tone.now());

        playingNotes.current = playingNotes.current.filter(
            playingNote => playingNote !== currentNote
        );
        
    }, [audioIsLoaded, tone, polySynth]);

    return { hertzPlayback: {playHertz, stopHertz}};
};

export function useAudio() {
    const { audioIsLoaded, tone } = useLoadAudio();
    const { polySynth, effects } = useConnectEffects(audioIsLoaded, tone);
    const { hertzPlayback } = useHertzPlayback(audioIsLoaded, tone, polySynth);
    return { audioIsLoaded, tone, hertzPlayback, effects}
};
