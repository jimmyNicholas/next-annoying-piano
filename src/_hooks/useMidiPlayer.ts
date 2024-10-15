import { KeyHandlers, ToneType } from "@/_lib/_types/types";
import { Midi } from "@tonejs/midi";
import { useCallback, useEffect, useRef, useState } from "react";

export function useMidiPlayback(parsedMidiData: Midi | null, {onKeyDown, onKeyUp}: KeyHandlers, tone: typeof ToneType | null) {
    const [playbackState, setPlaybackState] = useState<'stopped' | 'playing' | 'paused'>('stopped');
    const activeNotes = useRef<Set<string>>(new Set());

    const releaseAllNotes = useCallback(() => {
        const releaseDelayMs = 50;
        setTimeout(() => {
            activeNotes.current.forEach((note) => {
                onKeyUp(note);
            });
            activeNotes.current.clear();
        }, releaseDelayMs);
    }, [onKeyUp]);

    useEffect(() => {
        if (!tone || !parsedMidiData) return;

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
    }, [tone, parsedMidiData, onKeyDown, onKeyUp, releaseAllNotes]);

    const play = useCallback(async() => {
        if (!tone) return;
        tone.getTransport().start();
        setPlaybackState('playing');
    }, [tone]);

    const pause = useCallback(() => {
        if (!tone) return;
        tone.getTransport().pause();
        releaseAllNotes();
        setPlaybackState('paused');
    }, [tone, releaseAllNotes]);

    const stop = useCallback(() => {
        if (!tone) return;
        tone.getTransport().stop();
        tone.getTransport().position = 0;
        releaseAllNotes();
        setPlaybackState('stopped');
    }, [tone, releaseAllNotes]);

    return {
        play,
        pause,
        stop,
        playbackState
    };
};
