'use client';

import OptionsPanel from "./optionsPanel/OptionsPanel";
import Keyboard from "./Keyboard";
import { getKeys } from "@/_utils/keys/keyboardSetup";


export default function MainApp() {
    const keys = getKeys('C', 2, 'B', 4);

    return (
        <div className="border-2 border-black">
            Main App 
            <button 
                onClick={async () => {
                    const {setupAudio} = await import('../_services/audio');
                    await setupAudio();
                }}
            >
                -Enable Audio-
            </button>
            <button 
                onClick={async () => {
                    const {playHertz} = await import('../_services/audio');
                    playHertz(440);
                }}
            >
                -Test Audio-
            </button>
            <button 
                onClick={async () => {
                    const {stopHertz} = await import('../_services/audio');
                    stopHertz(440);
                }}
            >
                -Stop Audio-
            </button>
            <OptionsPanel/>
            <Keyboard
                keys={keys}
            />
        </div>
    );
};
