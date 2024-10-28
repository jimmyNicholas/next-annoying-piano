import { useCallback, useContext, useEffect, useRef } from "react";
import { Note, ToneType } from "@/_lib/_types/types";
import { ToneContext } from "@/_components/MainApp";

const useHertzPlayback = (polySynth: ToneType.PolySynth | null) => {
    const tone = useContext(ToneContext);
    const playingNotes = useRef<Note[]>([]);
    const keyEmitter = useRef<ToneType.Emitter | null>(null);
    
    useEffect(() => {
        if (!tone) return;
        keyEmitter.current = new tone.Emitter();
    }, [tone]);

    const emitKey = (event: string, keyName: string) => {
        if (!keyEmitter.current) return;
        keyEmitter.current.emit(event, {keyName});        
    };

    const playHertz = useCallback((keyName: string, hertz: number): void => {
        if (!tone || !polySynth) return;
        polySynth.triggerAttack(hertz, tone.now());
        playingNotes.current.push({keyName, hertz});
        emitKey('keyDown', keyName);
    }, [tone, polySynth]);

    const stopHertz = useCallback((keyName: string): void => {
        if (!tone || !polySynth) return;
        const currentNote = playingNotes.current.find((playingNote) => {return playingNote.keyName === keyName });
        if (typeof currentNote === 'undefined') return;
        polySynth.triggerRelease(currentNote.hertz, tone.now());

        playingNotes.current = playingNotes.current.filter(
            playingNote => playingNote !== currentNote
        );
        emitKey('keyUp', keyName);      
    }, [tone, polySynth]);

    return { hertzPlayback: {playHertz, stopHertz}, keyEmitter: keyEmitter.current};
};

export default useHertzPlayback;
