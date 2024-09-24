'use client';

import OptionsPanel from "./optionsPanel/OptionsPanel";
import Keyboard from "./Keyboard";
import { KeyboardProps, OptionsPanelProps, QwertyInputProps } from '@/_lib/_types/types';
import { useEffect, useRef } from "react";
import { useQwertyInput } from "@/_hooks/useQwertyInput";
import { modes } from "@/_lib/_data/modes";
import useAudio from "@/_hooks/useAudio";
import useKeyboard from "@/_hooks/useKeyboard";
import useMode from "@/_hooks/useMode";
import { useMIDINote } from "@react-midi/hooks";

const MainApp: React.FC = () => {
   
    const { loadAudio, audioIsLoaded, audioService } = useAudio();
    const { mode, updateMode, onModChange } = useMode(onReset);
    const keyboardRange = {startPitch: 'C', startOctave: 2, endPitch: 'B', endOctave: 4};
    const { keys, resetHertzTable, keyHandlers} = useKeyboard(keyboardRange, audioIsLoaded, audioService, mode);

    function onReset() {
        resetHertzTable();
    };

    const isQwertyEnabled = useRef(false);
    const toggleIsQwertyEnabled = () => { 
        isQwertyEnabled.current = !isQwertyEnabled.current 
    };
    const checkIsQwertyEnabled = (): boolean => { 
        return isQwertyEnabled.current };

    const qwertyInputProps: QwertyInputProps = {
        checkIsQwertyEnabled,
        octaveRange: {
            octaveMin: keyboardRange.startOctave,
            currentOctave: 2,
            octaveMax: keyboardRange.endOctave
        },
        keyHandlers,
    };
    useQwertyInput(qwertyInputProps);
    
    // MIDI controller hook
    const midiNote = useMIDINote();
    const prevNotesRef = useRef<number[]>([]);

    useEffect(() => {
        if (!midiNote) { return };
        const midiNumber = midiNote.note;
        function findMidiNumber(midiNumber: number) {
            return prevNotesRef.current.find((num: number) => num === midiNumber);
        };
        function findMidiNote(midiNumber: number) {
            const key = keys.find((key) => key.midiNumber === midiNumber);
            return key?.name;
        }

        if (!findMidiNumber(midiNumber)) {
            prevNotesRef.current.push(midiNumber);
            const key = findMidiNote(midiNumber)
            if (!key) { return };
            keyHandlers.onKeyDown(key);
        } else if (findMidiNumber(midiNumber)) {
            prevNotesRef.current = prevNotesRef.current.filter((i) => i !== midiNumber);
            const key = findMidiNote(midiNumber)
            if (!key) { return };
            keyHandlers.onKeyUp(key);
        }
    }, [midiNote]);
    // MIDI controller hook


    const optionsPanelProps: OptionsPanelProps = {
        globalProps: { loadAudio, audioIsLoaded, onReset},
        inputProps: { checkIsQwertyEnabled, toggleIsQwertyEnabled},
        modeProps: { mode: mode, updateMode, onModChange, maxModes: modes.length - 1}
    };

    const keyboardProps: KeyboardProps = { 
        keys, 
        keyHandlers,
    };

    return (
        <div className="border-2 border-black">
            <OptionsPanel {...optionsPanelProps} />
            <Keyboard {...keyboardProps} />
        </div>
    );
};

export default MainApp;
