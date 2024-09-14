'use client';

import OptionsPanel from "./optionsPanel/OptionsPanel";
import Keyboard from "./Keyboard";
import { getKeys } from "@/_utils/keys/keyboardSetup";
import { useEffect } from "react";
import { setupAudio } from "@/_services/audio";

export default function MainApp() {
    const keys = getKeys('C', 2, 'B', 4);

    useEffect(() => {
        setupAudio();
    }, []);  

    return (
        <div className="border-2 border-black">
            Main App
            <OptionsPanel/>
            <Keyboard
                keys={keys}
            />
        </div>
    );
};
