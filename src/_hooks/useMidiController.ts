import {getMidiControllerInputs, setupMidiController} from "@/_services/midiController";
import { KeyHandlers } from "@/_lib/_types/types";
import { useState } from "react";
import { Input } from 'webmidi';

const useMidiController = async (
    toggleIsMidiControllerLoaded: () => void,
    checkIsMidiControllerLoaded: () => boolean,
    keyHandlers: KeyHandlers 
) => {

    const [midiControllerInputs, setMidiControllerInputs] = useState<Input[]>();

    const isLoaded = setupMidiController(); 
    if (!checkIsMidiControllerLoaded()) {
        await setupMidiController()
            .then(() => {
                const midiInputs = getMidiControllerInputs();
                setMidiControllerInputs(midiInputs);
            });   
    }
    //const midiControllerInputs = isLoaded ? getMidiControllerInputs() : [];
    //console.log(isLoaded, midiControllerInputs);

    return {};
};

export default useMidiController;