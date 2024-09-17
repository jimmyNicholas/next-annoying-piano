'use client';

import OptionsPanel from "./optionsPanel/OptionsPanel";
import Keyboard from "./Keyboard";
import { getKeys } from "@/_utils/keys/keyboardSetup";
import { Key, HertzTable, KeyboardProps } from '@/_lib/_types/types';
import { getHertzTable } from "@/_utils/hertzHelpers";
import { useState, useRef } from "react";
import { AudioModule, OptionsPanelProps } from "@/_lib/_types/types";
import getMode from "@/_utils/modes/getMode";

const MainApp: React.FC = () => {
    const [audioIsLoaded, setAudioIsLoaded] = useState<boolean>(false);
    const [audioService, setAudioService] = useState<AudioModule | null>(null);

    async function enableAudio() {
        const {audioModule} = await import('../_services/audio');
        await audioModule.setupAudio()
            .then(() => setAudioIsLoaded(true))
            .then(() => setAudioService(audioModule));
    };

    const keyboardRange =  {startPitch: 'C', startOctave: 2, endPitch: 'B', endOctave: 4};
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
            getMode(mode.current, lastReleased.current, keyName, hertzTable.current);
            lastReleased.current = keyName;
        }
    }

    const mode = useRef<string>('SWAP');
    function updateMode(newMode: string) {
        mode.current = newMode;
        onReset();
    };

    function onReset() {
        hertzTable.current = getHertzTable( keyboardRange );
    };

    const optionsPanelProps: OptionsPanelProps = {
        globalProps: { enableAudio, audioIsLoaded, onReset},
        modeProps: { mode: mode.current, updateMode}
    };

    const keyboardProps: KeyboardProps = { keys, onKeyDown, onKeyUp };

    return (
        <div className="border-2 border-black">
            <OptionsPanel {...optionsPanelProps} />
            <Keyboard {...keyboardProps} />
        </div>
    );
};

export default MainApp;
