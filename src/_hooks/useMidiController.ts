import { Key, KeyHandlers } from "@/_lib/_types/types";
import { useMIDINote } from "@react-midi/hooks";
import { useCallback, useEffect } from "react"; 

/**
 * A custom React hook that handles MIDI controller input for musical keyboard interactions.
 * This hook maps MIDI note numbers to key names and triggers appropriate key handlers.
 * 
 * @param {Key[]} keys - An array of Key objects representing the keyboard layout.
 *                       Each Key object should contain a midiNumber and name property.
 * @param {KeyHandlers} keyHandlers - An object containing callback functions for key events.
 * @param {function} keyHandlers.onKeyDown - Callback function triggered when a key is pressed.
 * @param {function} keyHandlers.onKeyUp - Callback function triggered when a key is released.
 * 
 * @example
 * // Define keyboard layout
 * const keys = [
 *   { name: 'C4', midiNumber: 60 },
 *   { name: 'D4', midiNumber: 62 }
 * ];
 * 
 * // Define key handlers
 * const keyHandlers = {
 *   onKeyDown: (keyName) => console.log(`Key pressed: ${keyName}`),
 *   onKeyUp: (keyName) => console.log(`Key released: ${keyName}`)
 * };
 * 
 * // Use the hook
 * function Piano() {
 *   useMidiController(keys, keyHandlers);
 *   return <div>Piano Component</div>;
 * }
 * 
 * @returns {void}
 * 
 * @requires @react-midi/hooks
 * @requires react
 * 
 */
const useMidiController = (
    keys: Key[],
    keyHandlers: KeyHandlers
) => {
    const midiNote = useMIDINote();
    
    const findMidiNote = useCallback((midiNumber: number) => {
        const key = keys.find((key) => key.midiNumber === midiNumber);
        return key?.name;
    }, [keys]);

    useEffect(() => {
        // Return if null
        if (!midiNote) return;

        // Lookup key name from MIDI number
        const key = findMidiNote(midiNote.note)
        if (!key) { return }  

        // Play or release key
        const { onKeyDown, onKeyUp } = keyHandlers;
        midiNote.on ? onKeyDown(key) : onKeyUp(key);
    }, [midiNote, findMidiNote, keyHandlers]);
};

export default useMidiController;
