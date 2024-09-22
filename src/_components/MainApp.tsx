'use client';

import OptionsPanel from "./optionsPanel/OptionsPanel";
import Keyboard from "./Keyboard";
import { getKeys } from "@/_utils/keys/keyboardSetup";
import { Key, HertzTable, KeyboardProps, Mode, QwertyInputProps } from '@/_lib/_types/types';
import { getHertzTable } from "@/_utils/hertzHelpers";
import { useState, useRef, MutableRefObject } from "react";
import { AudioModule, OptionsPanelProps } from "@/_lib/_types/types";
import getMode from "@/_utils/modes/getMode";
import { useQwertyInput } from "@/_hooks/qwertyInput";
import { modes } from "@/_lib/_data/modes";

const MainApp: React.FC = () => {
    const [audioIsLoaded, setAudioIsLoaded] = useState<boolean>(false);
    const [audioService, setAudioService] = useState<AudioModule | null>(null);

    async function enableAudio() {
        const {audioModule} = await import('../_services/audio');
        await audioModule.setupAudio()
            .then(() => setAudioIsLoaded(true))
            .then(() => setAudioService(audioModule));
    };

    const keyboardRange = {startPitch: 'C', startOctave: 2, endPitch: 'B', endOctave: 4};
    const [keys] = useState<Key[]>( getKeys( keyboardRange) );
    const hertzTable = useRef<HertzTable>(getHertzTable( keyboardRange ));
    const lastReleased = useRef<string | null>(null);
    
    
    function onKeyDown(keyName: string){
        if (!audioIsLoaded || !audioService) { return };
        const hertz = hertzTable.current[keyName];
        audioService.playHertz(keyName, hertz);
    };

    function onKeyUp(keyName: string) {
        if (!audioIsLoaded || !audioService) { return };
        audioService.stopHertz(keyName);
        if (!lastReleased.current) {
            lastReleased.current = keyName;
        } else if (lastReleased.current !== keyName){
            const modeSelect = {
                mode: mode.value,
                hertzModifiers: {
                    lastKey: lastReleased.current,
                    currentKey: keyName,
                    modifiers: mode.modifiers
                },
                hertzTable: hertzTable.current
            };
            getMode(modeSelect);
            lastReleased.current = keyName;
        }
    }

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

    function onReset() {
        hertzTable.current = getHertzTable( keyboardRange );
    };

    const isQwertyEnabled = useRef(false);
    const checkIsQwertyEnabled = (): boolean => { return isQwertyEnabled.current };
    const qwertyInputProps: QwertyInputProps = {
        checkIsQwertyEnabled,
        octaveRange: {
            octaveMin: keyboardRange.startOctave,
            currentOctave: 2,
            octaveMax: keyboardRange.endOctave
        },
        keyHandlers: {onKeyDown,onKeyUp}
    };
    useQwertyInput(qwertyInputProps);

    const optionsPanelProps: OptionsPanelProps = {
        globalProps: { enableAudio, audioIsLoaded, onReset},
        inputProps: { isQwertyEnabled},
        modeProps: { mode: mode, updateMode, onModChange, maxModes: modes.length - 1}
    };

    const keyboardProps: KeyboardProps = { 
        keys, 
        keyHandlers: {onKeyDown,onKeyUp}
    };

    return (
        <div className="border-2 border-black">
            <OptionsPanel {...optionsPanelProps} />
            <Keyboard {...keyboardProps} />
        </div>
    );
};

export default MainApp;
