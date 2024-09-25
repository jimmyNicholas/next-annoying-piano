
import { Key, KeyHandlers } from "@/_lib/_types/types";
import { useMIDINote } from "@react-midi/hooks";
import { useEffect, useRef } from "react"; 

const useMidiController = (
    keys: Key[],
    keyHandlers: KeyHandlers
) => {
    const midiNote = useMIDINote();
    const prevNotesRef = useRef<number[]>([]);

    function findMidiNumber(midiNumber: number) {
        return prevNotesRef.current.find((num: number) => num === midiNumber);
    };
    

    useEffect(() => {
        if (!midiNote) { return };
        const { onKeyDown, onKeyUp } = keyHandlers;
        const midiNumber = midiNote.note;

        function findMidiNote(midiNumber: number) {
            const key = keys.find((key) => key.midiNumber === midiNumber);
            return key?.name;
        }

        if (!findMidiNumber(midiNumber)) {
            prevNotesRef.current.push(midiNumber);
            const key = findMidiNote(midiNumber)
            if (!key) { return };
            onKeyDown(key);
        } else if (findMidiNumber(midiNumber)) {
            prevNotesRef.current = prevNotesRef.current.filter((i) => i !== midiNumber);
            const key = findMidiNote(midiNumber)
            if (!key) { return };
            onKeyUp(key);
        }
    }, [midiNote, keys, keyHandlers]);
};

export default useMidiController;