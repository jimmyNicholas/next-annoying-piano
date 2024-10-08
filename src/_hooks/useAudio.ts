import { useCallback, useEffect, useRef, useState } from 'react';
import { Note, ToneType } from '@/_lib/_types/types';

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

export function useSynth(audioIsLoaded: boolean, tone: typeof ToneType | null) {
    const [ polySynth, setPolySynth] = useState<ToneType.PolySynth | null>(null);
    const playingNotes = useRef<Note[]>([]);

    useEffect(() => { 
        if (!audioIsLoaded || !tone) return;
        const newPolySynth = new tone.PolySynth(tone.Synth);
        setPolySynth(newPolySynth);

        return () => {
            newPolySynth.dispose();
        };
    }, [audioIsLoaded, tone]);

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

    return polySynth;
};

const useAudio = (audioIsLoaded: boolean) => {
    // load default synth, now and playing notes hook
    const [ polySynth, setPolySynth] = useState<ToneType.PolySynth | null>(null);
    const playingNotes = useRef<Note[]>([]);

    const [gainNode, setGainNode] = useState<ToneType.Gain | null>(null);

    useEffect(() => { 
        if (!audioIsLoaded || !tone) return;
        const newGainNode = new tone.Gain(0).toDestination();
        const newPolySynth = new tone.PolySynth(tone.Synth)
            .connect(newGainNode)
            .toDestination();
        setPolySynth(newPolySynth);
        setGainNode(newGainNode);

        return () => {
            newPolySynth.dispose();
            newGainNode.dispose();
        };
    }, [audioIsLoaded, tone]);

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

    return { audioIsLoaded, hertzPlayback: {playHertz, stopHertz}};
}   

export default useAudio;