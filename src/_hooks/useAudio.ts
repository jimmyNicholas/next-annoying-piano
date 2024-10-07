import { useCallback, useEffect, useRef, useState } from 'react';
import * as ToneType from 'tone';
import { Note } from '@/_lib/_types/types'

const useAudio = () => {
    // setup audio with Tonejs
    const [audioIsLoaded, setAudioIsLoaded] = useState<boolean>(false);
    const [ tone, setTone ] = useState<typeof ToneType | null>(null);
    
    const startAudio = useCallback(async () => {
        if (!audioIsLoaded) {
            const Tone = await import('tone') as typeof ToneType;
            setTone(Tone);
            await Tone.start()
                .then(() => {
                    setAudioIsLoaded(true)
                });
        };
    }, [audioIsLoaded]);

    useEffect(() => {
        function setupAudio() {
            window.addEventListener('click', startAudio);
            window.addEventListener('keydown', startAudio);
            return () => {
                window.removeEventListener('click', () => setAudioIsLoaded(false));
                window.removeEventListener('keydown', () => setAudioIsLoaded(false))
            };
        };
        setupAudio();
    }, [startAudio]);    

    const [ now, setNow ] = useState<number | null>(null);
    const [ polySynth, setPolySynth] = useState<ToneType.PolySynth | null>(null);
    const playingNotes = useRef<Note[]>([]);

    useEffect(() => { 
        if (!audioIsLoaded || !tone) return;
        setNow(tone.now());
        const polySynth = new tone.PolySynth(tone.Synth).toDestination();
        setPolySynth(polySynth);
    }, [audioIsLoaded])

    const playHertz = useCallback((keyName: string, hertz: number): void => {
        if (!audioIsLoaded || !now || !polySynth) return;
        polySynth.triggerAttack(hertz, now);
        playingNotes.current.push({keyName, hertz})
    }, [audioIsLoaded, now, polySynth]);

    const stopHertz = useCallback((keyName: string): void => {
        if (!audioIsLoaded || !now || !polySynth) return;
        const currentNote = playingNotes.current.find((playingNote) => {return playingNote.keyName === keyName });
        if (typeof currentNote === 'undefined') return;
        polySynth.triggerRelease(currentNote.hertz, now);

        playingNotes.current = playingNotes.current.filter(
            playingNote => playingNote !== currentNote
        );
        
    }, [audioIsLoaded, now, polySynth]);

    const audioService = { playHertz, stopHertz};

    return { audioIsLoaded, audioService};
}   

export default useAudio;