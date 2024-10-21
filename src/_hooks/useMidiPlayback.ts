import { KeyHandlers } from "@/_lib/_types/types";
import { Midi } from "@tonejs/midi";
import { useCallback, useContext, useEffect, useRef } from "react";
import { ToneContext } from "@/_components/MainApp";

export function useMidiPlayback(parsedMidiData: Midi | null, {onKeyDown, onKeyUp}: KeyHandlers) {
    const tone = useContext(ToneContext);
    const playbackState = useRef<'stopped' | 'playing' | 'paused'>('stopped');
    const activeNotes = useRef<Set<string>>(new Set());

    const getPlaybackState = useCallback(() => {
        return playbackState.current;
    }, [playbackState]);

    const setPlaybackState = useCallback((state: 'stopped' | 'playing' | 'paused') => {
        playbackState.current = state;
    }, [playbackState]);

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
        if (!tone || getPlaybackState() === 'playing') return;
        tone.getTransport().start();
        setPlaybackState('playing');
    }, [tone, getPlaybackState, setPlaybackState]);

    const pause = useCallback(() => {
        if (!tone || getPlaybackState() === 'paused') return;
        tone.getTransport().pause();
        releaseAllNotes();
        setPlaybackState('paused');
    }, [tone, releaseAllNotes, getPlaybackState, setPlaybackState]);

    const stop = useCallback(() => {
        if (!tone || getPlaybackState() === 'stopped') return;
        tone.getTransport().stop();
        tone.getTransport().position = 0;
        releaseAllNotes();
        setPlaybackState('stopped');
    }, [tone, releaseAllNotes, getPlaybackState, setPlaybackState]);

    return {
        play,
        pause,
        stop,
        getPlaybackState
    };
};
