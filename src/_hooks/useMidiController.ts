import {getMidiControllerInputs, setupMidiController} from "@/_services/midiController";
import { KeyHandlers } from "@/_lib/_types/types";

const useMidiController = (
    toggleIsMidiControllerLoaded: () => void,
    checkIsMidiControllerLoaded: () => boolean,
    keyHandlers: KeyHandlers 
) => {
    const isLoaded = setupMidiController(); 
    const midiControllerInputs = isLoaded ? getMidiControllerInputs() : [];
    console.log(isLoaded, midiControllerInputs);

    return {};
};

export default useMidiController;