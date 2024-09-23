import { WebMidi } from "webmidi";
import {useEffect, useState} from 'react';

const getMidiControllerInputs = () => {
    return WebMidi.inputs;
};

const setupMidiController = (isMidiControllerLoaded = false) => { 
    const [isLoaded, setIsLoaded] = useState(isMidiControllerLoaded);

    useEffect(() => {
        const enableMidi = async () => {
            try {
                WebMidi.enable();    
                setIsLoaded(true);
            } catch (err) {
                alert(err);
            }
        };
        if (!isMidiControllerLoaded) {
            enableMidi();
        }
    }, [isLoaded]);

    return { isLoaded };
};

export {setupMidiController, getMidiControllerInputs};
