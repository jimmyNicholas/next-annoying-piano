import { useCallback, useContext, useEffect, useRef } from "react";
import { Emitter, Note, PolySynth } from "@/_lib/_types/types";
import { ToneContext } from "@/_components/MainApp";

interface HertzPlaybackReturn {
    hertzPlayback: {
      playHertz: (keyName: string, hertz: number) => void;
      stopHertz: (keyName: string) => void;
    };
    keyEmitter: Emitter | null;
};

/**
 * Custom hook that manages frequency-based sound playback and key event emission.
 * 
 * @description
 * This hook provides functionality for playing and stopping notes using frequency values (hertz),
 * while maintaining a record of currently playing notes and emitting corresponding key events.
 * It integrates with Tone.js for audio synthesis and uses an event emitter for key state management.
 * 
 * Key features:
 * 1. Frequency-based note triggering
 * 2. Active note state tracking
 * 3. Key event emission system
 * 4. Automatic cleanup of released notes
 * 
 * @param {PolySynth | null} polySynth - The polyphonic synthesizer instance to use for playback
 * 
 * @returns {HertzPlaybackReturn} An object containing:
 * - hertzPlayback: Methods for controlling note playback
 *   - playHertz: Triggers a note at the specified frequency
 *   - stopHertz: Stops playback of a specific note
 * - keyEmitter: Event emitter instance for key events
 * 
 * @example
 * ```tsx
 * function Keyboard() {
 *   const { hertzPlayback, keyEmitter } = useHertzPlayback(synth);
 *   
 *   // Play a note
 *   const handleKeyPress = (note: string, frequency: number) => {
 *     hertzPlayback.playHertz(note, frequency);
 *   };
 *   
 *   // Stop a note
 *   const handleKeyRelease = (note: string) => {
 *     hertzPlayback.stopHertz(note);
 *   };
 *   
 *   // Listen for key events
 *   useEffect(() => {
 *     if (!keyEmitter) return;
 *     keyEmitter.on('keyDown', ({ keyName }) => {
 *       console.log(`Key pressed: ${keyName}`);
 *     });
 *   }, [keyEmitter]);
 *   
 *   return <div>Keyboard UI</div>;
 * }
 * ```
 */
const useHertzPlayback = (polySynth: PolySynth | null): HertzPlaybackReturn => {
    // Access Tone.js context
    const tone = useContext(ToneContext);

    // Track currently playing notes
    const playingNotes = useRef<Note[]>([]);

    // Initialize event emitter for key events
    const keyEmitter = useRef<Emitter | null>(null);
    
    // Set up key emitter when Tone.js is available
    useEffect(() => {
        if (!tone) return;
        keyEmitter.current = new tone.Emitter();
    }, [tone]);

    /**
     * Emits a key event with the specified event name and key
     * @param event - The event type ('keyDown' or 'keyUp')
     * @param keyName - The identifier for the key
    */
    const emitKey = (event: string, keyName: string) => {
        if (!keyEmitter.current) return;
        keyEmitter.current.emit(event, {keyName});        
    };

    /**
     * Triggers playback of a note at the specified frequency
     * @param keyName - Identifier for the key/note
     * @param hertz - Frequency to play in Hertz
    */
    const playHertz = useCallback((keyName: string, hertz: number): void => {
        if (!tone || !polySynth) return;
        polySynth.triggerAttack(hertz, tone.now());
        playingNotes.current.push({keyName, hertz});
        emitKey('keyDown', keyName);
    }, [tone, polySynth]);

    /**
     * Stops playback of a specific note
     * @param keyName - Identifier for the key/note to stop
    */
    const stopHertz = useCallback((keyName: string): void => {
        if (!tone || !polySynth) return;
        const currentNote = playingNotes.current.find(
            (playingNote) => playingNote.keyName === keyName
        );
        if (typeof currentNote === 'undefined') return;
        
        polySynth.triggerRelease(currentNote.hertz, tone.now());
        playingNotes.current = playingNotes.current.filter(
            playingNote => playingNote !== currentNote
        );
        emitKey('keyUp', keyName);      
    }, [tone, polySynth]);

    return { 
        hertzPlayback: {playHertz, stopHertz}, 
        keyEmitter: keyEmitter.current
    };
};

export default useHertzPlayback;
