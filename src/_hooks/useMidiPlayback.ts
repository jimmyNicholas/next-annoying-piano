import { KeyHandlers, MidiPlaybackState } from "@/_lib/_types/types";
import { Midi } from "@tonejs/midi";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ToneContext } from "@/_components/MainApp";

interface MidiPlaybackControl {
    play: () => Promise<void>;
    pause: () => void;
    stop: () => void;
    playbackState: MidiPlaybackState;
}

interface NoteEvent {
    time: number;
    note: string;
    duration: number;
  }

/**
 * A custom React hook that manages MIDI file playback with transport controls and note scheduling.
 * This hook handles the scheduling of MIDI events, manages playback state, and ensures proper
 * cleanup of active notes during playback interruptions.
 * 
 * @param {Midi | null} parsedMidiData - Parsed MIDI file data from @tonejs/midi library.
 *                                       Pass null to reset/clear the current MIDI data.
 * @param {KeyHandlers} keyHandlers - Object containing key event handlers
 * @param {Function} keyHandlers.onKeyDown - Callback function for note-on events
 * @param {Function} keyHandlers.onKeyUp - Callback function for note-off events
 * 
 * @returns {MidiPlaybackControl} Object containing playback controls and state
 * 
 * Features:
 * - Automatic scheduling of all MIDI notes using Tone.js transport
 * - Maintains playback state (stopped/playing/paused)
 * - Handles cleanup of active notes during interruptions
 * - Manages transport position reset on stop
 * - Provides play/pause/stop controls
 * 
 * @example
 * // Basic usage with MIDI file
 * function MidiPlayer() {
 *   const [midiData, setMidiData] = useState<Midi | null>(null);
 *   const keyHandlers = {
 *     onKeyDown: (note: string) => console.log(`Note On: ${note}`),
 *     onKeyUp: (note: string) => console.log(`Note Off: ${note}`)
 *   };
 * 
 *   const { play, pause, stop, playbackState } = useMidiPlayback(midiData, keyHandlers);
 * 
 *   return (
 *     <div>
 *       <button onClick={play} disabled={playbackState === 'playing'}>Play</button>
 *       <button onClick={pause} disabled={playbackState !== 'playing'}>Pause</button>
 *       <button onClick={stop} disabled={playbackState === 'stopped'}>Stop</button>
 *     </div>
 *   );
 * }
 * 
 * @throws Will not throw errors but will safely handle various edge cases:
 * - Missing Tone.js context
 * - Null MIDI data
 * - Multiple rapid transport control calls
 * - Component unmounting during playback
 * 
 * Implementation details:
 * - Uses a small delay when releasing notes to prevent audio artifacts
 * - Automatically cleans up scheduled events when MIDI data changes
 * - Maintains active note tracking to ensure proper cleanup
 * - Resets transport position to 0 on stop
 * 
 * @requires @tonejs/midi
 * @requires tone
 * @requires react
 */
const useMidiPlayback = (
    parsedMidiData: Midi | null, 
    {onKeyDown, onKeyUp}: KeyHandlers
): MidiPlaybackControl => {
    const tone = useContext(ToneContext);
    const loadedMidiDataRef = useRef<Midi | null>(parsedMidiData);
    const [playbackState, setPlaybackState] = useState<MidiPlaybackState>('stopped');
    const activeNotes = useRef<Set<string>>(new Set());

    /**
     * Releases all currently active notes with a small delay to prevent artifacts
    */
    const releaseAllNotes = useCallback(() => {
        const RELEASE_DELAY_MS = 50;

        if (activeNotes.current.size === 0) return;

        setTimeout(() => {
            activeNotes.current.forEach((note) => {
                onKeyUp(note);
            });
            activeNotes.current.clear();
        }, RELEASE_DELAY_MS);
    }, [onKeyUp]);

    /**
     * Schedules all MIDI events on the transport timeline
    */
    const scheduleEvents = useCallback((midiData: Midi) => {
        if (!tone) return;

        const noteEvents: NoteEvent[] = midiData.tracks[0].notes.map((note) => ({
            time: note.time,
            note: note.name,
            duration: note.duration
        }));

        noteEvents.forEach(event => {
            // Schedule note-on event
            tone.getTransport().schedule(() => {
              onKeyDown(event.note);
              activeNotes.current.add(event.note);
            }, event.time);
      
            // Schedule note-off event
            tone.getTransport().schedule(() => {
              onKeyUp(event.note);
              activeNotes.current.delete(event.note);
            }, event.time + event.duration);
        });
    }, [tone, onKeyDown, onKeyUp]);

    /**
     * Cleanup function to reset transport and release notes
    */
    const cleanup = useCallback(() => {
        if (!tone) return;
        
        tone.getTransport().cancel();
        releaseAllNotes();
        tone.getTransport().position = 0;
    }, [tone, releaseAllNotes]);

    // Handle MIDI data changes
    useEffect(() => {
        if (!tone || !loadedMidiDataRef.current) {
            cleanup();
            return;
        }

        cleanup();
        scheduleEvents(loadedMidiDataRef.current);

        return () => {
            cleanup();
        };
    }, [tone, loadedMidiDataRef, cleanup, scheduleEvents]);

    // Playback control functions
    const play = useCallback(async() => {
        console.log(loadedMidiDataRef.current);
        if (!tone || playbackState === 'playing' || !loadedMidiDataRef.current) return;

        tone.getTransport().start();
        setPlaybackState('playing');
    }, [tone, playbackState, setPlaybackState, loadedMidiDataRef]);

    const pause = useCallback(() => {
        if (!tone || playbackState === 'paused') return;

        tone.getTransport().pause();
        releaseAllNotes();
        setPlaybackState('paused');
    }, [tone, releaseAllNotes, playbackState, setPlaybackState]);

    const stop = useCallback(() => {
        if (!tone || playbackState === 'stopped') return;

        cleanup();
        setPlaybackState('stopped');
    }, [tone, playbackState, setPlaybackState, cleanup]);

    // Refresh, clean up and schedule midi data on change
    useEffect(() => {
        if (parsedMidiData !== loadedMidiDataRef.current) {
            loadedMidiDataRef.current = parsedMidiData;
            cleanup();
            if (parsedMidiData) {
                scheduleEvents(parsedMidiData);
            }
        }
    }, [parsedMidiData, cleanup, scheduleEvents]);

    return {
        play,
        pause,
        stop,
        playbackState
    };
};

export default useMidiPlayback;
