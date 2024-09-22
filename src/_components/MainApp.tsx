'use client';

import OptionsPanel from "./optionsPanel/OptionsPanel";
import Keyboard from "./Keyboard";
import { KeyboardProps, Mode, OptionsPanelProps, QwertyInputProps } from '@/_lib/_types/types';
import { useState, useRef } from "react";
import { useQwertyInput } from "@/_hooks/useQwertyInput";
import { modes } from "@/_lib/_data/modes";
import useAudio from "@/_hooks/useAudio";
import useKeyboard from "@/_hooks/useKeyboard";

const MainApp: React.FC = () => {
   
    const { loadAudio, audioIsLoaded, audioService } = useAudio();

    const keyboardRange = {startPitch: 'C', startOctave: 2, endPitch: 'B', endOctave: 4};

    const modeIndex = useRef<number>(0);
    const [mode, setMode] = useState<Mode>(modes[modeIndex.current]);

    function updateMode(newModeIndex: number) {
        modeIndex.current = newModeIndex;
        setMode(modes[modeIndex.current]);
        onReset();
    };

    function onModChange(value: number, index: number) {
        setMode(prevMode => ({
            ...prevMode,
            modifiers: prevMode.modifiers?.map((modifier, i) => 
                i === index
                    ? {...modifier, value: value}
                    : modifier
            )
        }));
    };

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
