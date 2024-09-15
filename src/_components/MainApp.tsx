'use client';

import OptionsPanel from "./optionsPanel/OptionsPanel";
import Keyboard from "./Keyboard";
import { getKeys } from "@/_utils/keys/keyboardSetup";
import { Key, HertzTable } from '@/_lib/_types/types';
import { getHertzTable } from "@/_utils/hertzHelpers";
import { useState, useRef } from "react";
import { AudioModule } from "@/_lib/_types/types";

export default function MainApp() {
    const [audioIsLoaded, setAudioIsLoaded] = useState<boolean>(false);
    const [audioService, setAudioService] = useState<AudioModule | null>(null);

    async function enableAudio() {
        const {audioModule} = await import('../_services/audio');
        await audioModule.setupAudio()
            .then(() => setAudioIsLoaded(true))
            .then(() => setAudioService(audioModule));
    };

    const [keys] = useState<Key[]>( getKeys('C', 2, 'B', 4) );
    const hertzTable = useRef<HertzTable>(getHertzTable('C', 2, 'B', 4));

    function onKeyDown(keyName: string){
        if (!audioIsLoaded || !audioService) { return };
        const hertz = hertzTable.current[keyName];
        audioService.playHertz(keyName, hertz);
    };

    function swapHertz(lastKey: string, currentKey: string, hertzTable: HertzTable) {
        const lastHertz = hertzTable[lastKey];
        const currentHertz = hertzTable[currentKey];
        hertzTable[lastKey] = currentHertz;
        hertzTable[currentKey] = lastHertz;
    };

    const lastReleased = useRef<string | null>(null);

    function onKeyUp(keyName: string) {
        if (!audioIsLoaded || !audioService) { return };
        audioService.stopHertz(keyName);
        if (!lastReleased.current) {
            lastReleased.current = keyName;
        } else if (lastReleased.current !== keyName){
            swapHertz(lastReleased.current, keyName, hertzTable.current);
            lastReleased.current = keyName;
        }
    }

    return (
        <div className="border-2 border-black">
            <button
                className="bg-slate-300 border border-black" 
                onClick={enableAudio}
            >
                Enable Audio
            </button>
            <OptionsPanel/>
            <Keyboard
                keys={keys}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
            />
        </div>
    );
};
