import { KeyHandlers, ToneType } from "@/_lib/_types/types";
import { Midi } from "@tonejs/midi";
import { useCallback, useEffect, useRef, useState } from "react";

export function useMidiPlayback(parsedMidiData: Midi | null, {onKeyDown, onKeyUp}: KeyHandlers, tone: typeof ToneType | null) {
    const [playbackState, setPlaybackState] = useState<'stopped' | 'playing' | 'paused'>('stopped');
    const toneRef = useRef<typeof ToneType | null>(tone);
    const activeNotes = useRef<Set<string>>(new Set());

    const releaseAllNotes = useCallback(() => {    
        function release() {
            activeNotes.current.forEach((note) => {
                onKeyUp(note);
            });
        };
        release();
        activeNotes.current.clear();
    }, [onKeyUp]);

    useEffect(() => {
        console.log('Effect running. Tone:', !!toneRef, 'ParsedMidiData:', !!parsedMidiData);
        if (!toneRef.current || !parsedMidiData) return;
        const tone = toneRef.current;

        const noteEvents = parsedMidiData.tracks[0].notes.map((note) => ({
            time: note.time,
            note: note.name,
            duration: note.duration
        }));

        noteEvents.forEach(event => {
            tone.getTransport().schedule(() => {
              onKeyDown(event.note);
              activeNotes.current.add(event.note);
            }, event.time);
      
            tone.getTransport().schedule(() => {
              onKeyUp(event.note);
              activeNotes.current.delete(event.note);
            }, event.time + event.duration);
        });
        
        return () => {
            tone.getTransport().cancel();
            releaseAllNotes();
        };
    }, [parsedMidiData, onKeyDown, onKeyUp, releaseAllNotes]);

    const play = useCallback(async() => {
        if (!toneRef.current) return;
        toneRef.current.getTransport().start();
        setPlaybackState('playing');
    }, []);

    const pause = useCallback(() => {
        if (!toneRef.current) return;
        toneRef.current.getTransport().pause();
        releaseAllNotes();
        setPlaybackState('paused');
    }, [releaseAllNotes]);

    const stop = useCallback(() => {
        if (!toneRef.current) return;
        toneRef.current.getTransport().stop();
        toneRef.current.getTransport().position = 0;
        releaseAllNotes();
        setPlaybackState('stopped');
    }, [releaseAllNotes]);

    return {
        play,
        pause,
        stop,
        playbackState
    };
};
