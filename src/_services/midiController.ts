import { WebMidi, Input } from "webmidi";
import {useEffect, useState} from 'react';

const getMidiControllerInputs = () => {
    return WebMidi.inputs;
};

const setupMidiController = (isMidiControllerLoaded = false) => { 
    const [midiControllerInputs, setMidiControllerInputs] = useState<Input[]>([]);
    const [isLoaded, setIsLoaded] = useState(isMidiControllerLoaded);

    useEffect(() => {
        const enableMidi = async () => {
            try {
                WebMidi.enable();
                const inputs: Input[] = WebMidi.inputs;    
                setMidiControllerInputs(inputs);
                setIsLoaded(true);
            } catch (err) {
                alert(err);
            }
        };
        if (!isMidiControllerLoaded) {
            enableMidi();
        }
    }, [isLoaded]);

    return { isLoaded, midiControllerInputs };
};

export {setupMidiController, getMidiControllerInputs};
