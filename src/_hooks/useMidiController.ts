import {getMidiControllerInputs, setupMidiController} from "@/_services/midiController";
import { KeyHandlers } from "@/_lib/_types/types";
import { useState } from "react";
import { Input } from 'webmidi';

function getMidiKeyNote(midiKey: any) {
    const name = midiKey.name;
    const accidental = midiKey.accidental || '';
    const octave = midiKey.octave;
    return name + accidental + octave;
}

const useMidiController = async (
    toggleIsMidiControllerLoaded: () => void,
    checkIsMidiControllerLoaded: () => boolean,
    keyHandlers: KeyHandlers 
) => {
    const [midiControllerInputs, setMidiControllerInputs] = useState<Input[]>([]);

    if (!checkIsMidiControllerLoaded()) {
        await setupMidiController()
            .then(() => {
                const midiInputs = getMidiControllerInputs();
                setMidiControllerInputs(midiInputs);
                toggleIsMidiControllerLoaded();
            });   
    };
    
    return { midiControllerInputs, getMidiControllerInputs };
};

export default useMidiController;