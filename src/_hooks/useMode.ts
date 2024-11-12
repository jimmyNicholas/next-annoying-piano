import { useCallback, useRef } from "react";
import { Mode } from "@/_lib/_types/types";
import { modes } from '@/_lib/_data/modes/index' 

interface ModeControls {
    /** Get the current mode configuration */
    getModeRef: () => Mode;
    /** Set a new mode and trigger reset */
    setModeRef: (newMode: Mode) => void;
    /** Update a specific modifier value within the current mode */
    updateModifier: (newValue: number, index: number) => void;
    /** Available modes list */
    modes: Mode[];
}

/**
 * Custom hook for managing musical mode state and modifications.
 * Handles mode selection, modifier updates, and maintains mode state.
 * 
 * @param onReset - Callback function to trigger when mode changes
 * @returns {ModeControls} Object containing mode management functions
 * 
 * @example
 * function ModeSelector() {
 *   const resetInstrument = useCallback(() => {
 *     // Reset logic
 *   }, []);
 * 
 *   const { getModeRef, setModeRef, updateModifier, modes } = useMode(resetInstrument);
 * 
 *   return (
 *     <select onChange={(e) => setModeRef(modes[Number(e.target.value)])}>
 *       {modes.map((mode, index) => (
 *         <option key={mode.name} value={index}>{mode.name}</option>
 *       ))}
 *     </select>
 *   );
 * }
 */
const useMode = ( onReset: () => void): ModeControls => {
    // Initialize with first available mode
    const modeRef = useRef<Mode>(modes[0]);

    /**
     * Returns the current mode configuration
    */
    const getModeRef = useCallback(() => {
        return modeRef.current;
    }, []);

    /**
     * Updates the current mode and triggers reset
    */
    const setModeRef = useCallback((newMode: Mode): void => {
        if (!newMode) {
            console.warn('Attempted to set invalid mode');
            return;
        }

        modeRef.current = newMode;
        onReset();
    },[onReset]);

    /**
     * Updates a specific modifier value within the current mode
     * @param newValue - New value for the modifier
     * @param index - Index of the modifier to update
    */
    const updateModifier = useCallback((newValue: number, index: number) => {
        const currentMode = modeRef.current;

        // Validate mode has modifiers
        if (!currentMode.modifiers?.length) {
            console.warn('Current mode has no modifiers');
            return;
        }

        // Validate modifier index
        if (index < 0 || index >= currentMode.modifiers.length) {
            console.warn(`Invalid modifier index: ${index}`);
            return;
        }

        const modifier = currentMode.modifiers[index];

        // Validate new value
        if (newValue < modifier.min || newValue > modifier.max) {
            console.warn(`Value ${newValue} out of range for modifier ${index}`);
            return;
        }

        // Update modifier value
        currentMode.modifiers[index].value = newValue;
    }, []);

    return { 
        getModeRef, 
        setModeRef, 
        updateModifier, 
        modes 
    };
};

export default useMode;
