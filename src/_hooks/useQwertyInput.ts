import { useCallback, useEffect, useRef, useState } from "react";
import { QwertyInputProps } from "@/_lib/_types/types";
import { qwertyMap } from "@/_lib/_data/qwertyMap";

interface QwertyInputReturn {
    isQwertyEnabled: boolean;
    toggleIsQwertyEnabled: () => void;
}

/**
 * Custom hook that enables QWERTY keyboard input for musical applications.
 * Maps keyboard keys to musical notes and handles octave switching.
 * 
 * @param {QwertyInputProps} - The hook's configuration object
 * @param {OctaveRange} QwertyInputProps.octaveRange - Object containing octave range constraints
 * @param {KeyHandlers} QwertyInputProps.keyHandlers - Object containing key event callbacks
 * 
 * @returns {QwertyInputProps} An object containing:
 *   - isQwertyEnabled: boolean indicating if QWERTY input is active
 *   - toggleIsQwertyEnabled: function to toggle QWERTY input on/off
 * 
 * @example
 * const { isQwertyEnabled, toggleIsQwertyEnabled } = useQwertyInput({
 *   octaveRange: { octaveMin: 0, octaveMax: 8, currentOctave: 4 },
 *   keyHandlers: {
 *     onKeyDown: (note) => playNote(note),
 *     onKeyUp: (note) => stopNote(note)
 *   }
 * });
 */
const useQwertyInput = ({
    octaveRange, 
    keyHandlers
}: QwertyInputProps): QwertyInputReturn => {
    const {onKeyDown, onKeyUp} = keyHandlers;
    const {octaveMin, octaveMax} = octaveRange;

    // Track current octave with a ref to avoid re-renders
    const currentOctave = useRef<number>(octaveRange.currentOctave);

    // State to enable/disable QWERTY input
    const [isQwertyEnabled, setIsQwertyEnabled] = useState<boolean>(false);

    // Track currently pressed keys to prevent key repeat
    const pressedQwerty = useRef<string[]>([]);

    // Toggle QWERTY input on/off
    const toggleIsQwertyEnabled = useCallback(() => {
        setIsQwertyEnabled(prev => !prev);
    }, []);

    /**
     * Handles keyboard key press events
     * - Manages octave switching with 'z' and 'x' keys
     * - Maps QWERTY keys to musical notes
     * - Prevents key repeat by tracking pressed keys
    */
    const handleQwertyDown = useCallback((e: KeyboardEvent) => {
        if (!isQwertyEnabled) { return };
        
        const qwertyKey = e.key.toLowerCase();

        // Handle octave down with 'z' key
        if (qwertyKey === 'z' && currentOctave.current > octaveMin) {
            currentOctave.current--;
            return; 
        };

        // Handle octave up with 'x' key
        if (qwertyKey === 'x' && currentOctave.current < octaveMax) {
            currentOctave.current++;
            return;
        };

        // Handle note keys if they exist in qwertyMap and aren't already pressed
        if (qwertyMap[qwertyKey] && !pressedQwerty.current.includes(qwertyKey)) {
            const {pitch, baseOctave} = qwertyMap[qwertyKey];
            const keyName = pitch + (currentOctave.current + baseOctave);
            onKeyDown(keyName);
            pressedQwerty.current.push(qwertyKey);
        };      
        
    }, [isQwertyEnabled, octaveMin, octaveMax, onKeyDown]);

    /**
     * Handles keyboard key release events
     * - Triggers note release callbacks
     * - Removes released keys from pressed keys tracking
    */
    const handleQwertyUp = useCallback((e: KeyboardEvent) => {
        if (!isQwertyEnabled) { return };
        
        const qwertyKey = e.key.toLowerCase();
        if (qwertyMap[qwertyKey]) {
            const {pitch, baseOctave} = qwertyMap[qwertyKey];
            const keyName = pitch + (currentOctave.current + baseOctave);
            onKeyUp(keyName);
            pressedQwerty.current = pressedQwerty.current.filter(
                pressedKey => pressedKey !== qwertyKey
            );
        };   
    }, [isQwertyEnabled, onKeyUp]);

    // Set up and clean up keyboard event listeners
    useEffect(() => {
        window.addEventListener('keydown', handleQwertyDown);
        window.addEventListener('keyup', handleQwertyUp);

        return () => {
            window.removeEventListener('keydown', handleQwertyDown);
            window.removeEventListener('keyup', handleQwertyUp);
        };
    }, [handleQwertyDown, handleQwertyUp]);

    return { isQwertyEnabled, toggleIsQwertyEnabled };
};

export default useQwertyInput;
