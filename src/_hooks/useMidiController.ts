import {setupMidiController} from "@/_services/midiController";
import { KeyHandlers } from "@/_lib/_types/types";

const useMidiController = (
    toggleIsMidiControllerLoaded: () => void,
    checkIsMidiControllerLoaded: () => boolean,
    keyHandlers: KeyHandlers 
) => {
    const {isLoaded, midiControllerInputs} = setupMidiController(); 
    console.log(isLoaded, midiControllerInputs );
    

    return {};
};

export default useMidiController;