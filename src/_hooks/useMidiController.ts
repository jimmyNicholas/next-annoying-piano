import { Key, KeyHandlers } from "@/_lib/_types/types";
import { useMIDINote } from "@react-midi/hooks";
import { useCallback, useEffect } from "react"; 

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
        if (!midiNote) return;
        const { onKeyDown, onKeyUp } = keyHandlers;
        const key = findMidiNote(midiNote.note)
        if (!key) { return }  
        midiNote.on ? onKeyDown(key) : onKeyUp(key);
    }, [midiNote, findMidiNote, keyHandlers]);
};

export default useMidiController;