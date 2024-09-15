'use client';

import OptionsPanel from "./optionsPanel/OptionsPanel";
import Keyboard from "./Keyboard";
import { getKeys } from "@/_utils/keys/keyboardSetup";
import { getHertzTable } from "@/_utils/hertzHelpers";
import { useState } from "react";
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

    const keys = getKeys('C', 2, 'B', 4);
    const hertzTable = getHertzTable('C', 2, 'B', 4);

    async function onKeyDown(keyName: string){
        if (!audioIsLoaded || !audioService) { return };
        const hertz = hertzTable[keyName];
        audioService.playHertz(keyName, hertz);
    };

    async function onKeyUp(keyName: string) {
        if (!audioIsLoaded || !audioService) { return };
        audioService.stopHertz(keyName);
    }

    return (
        <div className="border-2 border-black">
            Main App 
            <button 
                onClick={enableAudio}
            >
                -Enable Audio-
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
