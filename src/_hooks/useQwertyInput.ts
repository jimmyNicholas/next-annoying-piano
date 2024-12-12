import { useCallback, useEffect, useRef, useState } from "react";
import { KeyHandlers } from "@/_lib/_types/types";
import { qwertyMap } from "@/_lib/_data/qwertyMap";

export interface QwertyInputProps {
    octaveRange: {
        octaveMin: number;
        currentOctave: number;
        octaveMax: number; 
    };
    keyHandlers: KeyHandlers;
};

interface QwertyInputReturn {
    isQwertyEnabled: boolean;
    toggleIsQwertyEnabled: () => void;
}

/**
 * Custom hook for handling QWERTY keyboard input in a musical application
 * Provides keyboard-to-note mapping and octave management functionality
 * 
 * @param {Object} props - Hook configuration object
 * @param {Object} props.octaveRange - Configuration for octave boundaries and current position
 * @param {number} props.octaveRange.octaveMin - Lowest allowable octave number
 * @param {number} props.octaveRange.currentOctave - Currently selected octave
 * @param {number} props.octaveRange.octaveMax - Highest allowable octave number
 * @param {Object} props.keyHandlers - Event handlers for key interactions
 * @param {(noteName: string) => void} props.keyHandlers.onKeyDown - Callback triggered when a key is pressed
 * @param {(noteName: string) => void} props.keyHandlers.onKeyUp - Callback triggered when a key is released
 * 
 * @returns {Object} Hook control interface
 * @returns {boolean} returns.isQwertyEnabled - Current state of QWERTY input
 * @returns {() => void} returns.toggleIsQwertyEnabled - Function to toggle QWERTY input on/off
 * 
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
