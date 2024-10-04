import { KeyHandlers } from "@/_lib/_types/types";
import { Midi } from "@tonejs/midi";
import { useCallback, useEffect, useRef, useState } from "react";

// interface MidiPlaybackState {
//     fileName: string;
//     tracks: {
//         name: string;
//         muted: boolean;
//         noteEvents: NoteEvent[];
//     }[],
// }

interface NoteEvent {
    name: string;
    startTime: number;
    duration: number;
};

export function useMidiPlayback(parsedMidiData: Midi | null, {onKeyDown, onKeyUp}: KeyHandlers) {
    const [playbackState, setPlaybackState] = useState<'stopped' | 'playing' | 'paused'>('stopped');
    const startTimeRef = useRef<number | null>(null);
    const pauseTimeRef = useRef<number | null>(null);
    const scheduledEvents = useRef<number[]>([]);
    const activeNotes = useRef<Map<string, number>>(new Map());
    const audioContextRef = useRef<AudioContext | null>(null);

    const scheduleNote = (note: NoteEvent, audioContextTime: number, timeOffset: number = 0) => {
        if (!audioContextRef.current) return;
        
        const noteOnTime = audioContextTime + (note.startTime - timeOffset);
        const noteOffTime = noteOnTime + note.duration;
  
        const noteOnTimeout = window.setTimeout(() => {
            onKeyDown(note.name);
            const currentCount = activeNotes.current.get(note.name) || 0;
            activeNotes.current.set(note.name, currentCount + 1);
        }, (noteOnTime - audioContextRef.current.currentTime) * 1000);

        const noteOffTimeout = window.setTimeout(() => {
            const currentCount = activeNotes.current.get(note.name) || 0;
            if (currentCount > 1) {
                activeNotes.current.set(note.name, currentCount - 1);
            } else {
                activeNotes.current.delete(note.name);
            }
            onKeyUp(note.name);
        }, (noteOffTime - audioContextRef.current.currentTime) * 1000);

        scheduledEvents.current.push(noteOnTimeout, noteOffTimeout);
    };

    const play = () => {
        if (playbackState === 'playing') return;
        
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext)
        } else if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        };
        
        const timeOffset = pauseTimeRef.current !== null ? pauseTimeRef.current : 0;
        const currentTime = audioContextRef.current.currentTime;
        startTimeRef.current = currentTime - timeOffset;

        if (!parsedMidiData) return;
        const noteEvents = parsedMidiData.tracks[0].notes.map((note) => ({
                name: note.name, 
                startTime: note.time,
                duration: note.duration,
        }));
        
        noteEvents.forEach(note => {
            const adjustedStartTime = note.startTime - timeOffset;
            const adjustedEndTime = adjustedStartTime + note.duration;
            
            if (adjustedEndTime > 0) {  
                scheduleNote(note, currentTime, timeOffset);    
            };
        });
      
        setPlaybackState('playing');
        pauseTimeRef.current = null;
    };

    const releaseAllNotes = useCallback(() => {
        activeNotes.current.forEach((count, noteName) => {
          onKeyUp(noteName);
        });
        activeNotes.current.clear();
      }, [onKeyUp]);

    const pause = () => {
        if (playbackState !== 'playing') return;
        
        scheduledEvents.current.forEach(clearTimeout);
        scheduledEvents.current = [];

        releaseAllNotes();

        if (startTimeRef.current !== null && audioContextRef.current) {
            pauseTimeRef.current = (audioContextRef.current.currentTime - startTimeRef.current);
        } else {
            pauseTimeRef.current = null;
        }

        setPlaybackState('paused');

        if (audioContextRef.current) {
            audioContextRef.current.suspend();
        }
    };

    const stop = () => {
        if (playbackState === 'stopped') return;

        scheduledEvents.current.forEach(clearTimeout);
        scheduledEvents.current = [];

        releaseAllNotes();

        startTimeRef.current = null;
        pauseTimeRef.current = null;

        setPlaybackState('stopped');
        if (audioContextRef.current) {
            audioContextRef.current.suspend();
        }  
    };

    useEffect(() => {
        return () => {
            scheduledEvents.current.forEach(clearTimeout);
            releaseAllNotes();
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, [releaseAllNotes]);

    return {
        play,
        pause,
        stop,
        playbackState
    };
};
