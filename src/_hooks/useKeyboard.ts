import { useRef, useCallback } from "react";
import { Key, HertzTable, KeyboardRange, HertzPlayback, Mode } from "@/_lib/_types/types";
import { getKeys } from "@/_utils/keys/keyboardSetup";
import { getHertzTable } from "@/_utils/hertzHelpers";

interface KeyboardReturn {
    keys: Key[];
    resetHertzTable: () => void;
    keyHandlers: {
        onKeyDown: (keyName: string) => void;
        onKeyUp: (keyName: string) => void;
    };
}

/**
 * Custom hook that manages keyboard interactions and frequency mapping for a musical instrument.
 * 
 * @description
 * This hook handles the complex relationship between keyboard input, frequency (hertz) values,
 * and musical modes. It provides:
 * 1. Keyboard layout management
 * 2. Frequency-to-key mapping
 * 3. Key event handling
 * 4. Mode-based frequency modifications
 * 
 * The hook maintains state for the last released key to enable mode modifications
 * and provides methods for handling both key press and release events.
 * 
 * @param {KeyboardRange} keyboardRange - Defines the range of playable keys
 * @param {HertzPlayback | null} hertzPlayback - Interface for playing/stopping frequencies
 * @param {() => Mode} getMode - Function that returns the current mode
 * 
 * @returns {KeyboardReturn} An object containing:
 * - keys: Array of key definitions for the keyboard
 * - resetHertzTable: Function to reinitialize the frequency mapping
 * - keyHandlers: Object containing onKeyDown and onKeyUp event handlers
 * 
 */
const useKeyboard = (
    keyboardRange: KeyboardRange,
    hertzPlayback: HertzPlayback | null,
    getMode: () => Mode,
): KeyboardReturn => {
    // Initialize keyboard layout
    const keys = useRef<Key[]>( getKeys( keyboardRange) );

    // Initialize frequency mapping table
    const hertzTable = useRef<HertzTable>(getHertzTable( keyboardRange ));

    // Track the last released key for mode transformations
    const lastReleased = useRef<string | null>(null);

    /**
     * Reinitializes the frequency mapping table
     * Useful when changing modes or keyboard range
    */
    function resetHertzTable() { 
        hertzTable.current = getHertzTable(keyboardRange)
    };

    /**
     * Handles key press events by triggering the corresponding frequency
    */
    const onKeyDown = useCallback((keyName: string) => {
        if (!hertzPlayback) { return };

        const hertz = hertzTable.current[keyName];
        hertzPlayback.playHertz(keyName, hertz);
    }, [hertzPlayback]);

    /**
     * Handles key release events and applies mode modifications
     * Updates the frequency table based on the current mode and key history
    */
    const onKeyUp = useCallback((keyName: string) => {
        if (!hertzPlayback) { return };


        hertzPlayback.stopHertz(keyName);

        // Initialize last released key if not set
        if (!lastReleased.current) {
            lastReleased.current = keyName;
        } 

        // Apply mode modifications
        const mode = getMode();
        const hertzModifiers = {
            lastKey: lastReleased.current,
            currentKey: keyName,
        };
        mode.modify(hertzModifiers, hertzTable.current);

        // Update last released key
        lastReleased.current = keyName;
        
    }, [hertzPlayback, getMode]);

    return { 
        keys: keys.current, 
        resetHertzTable, 
        keyHandlers: {onKeyDown, onKeyUp}
    };
};

export default useKeyboard;
