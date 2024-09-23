import { WebMidi, Input } from "webmidi";
import {useEffect, useState} from 'react';

const setupMidiController = async (isMidiLoaded = false) => { 
    const [midiControllerInputs, setMidiControllerInputs] = useState<Input[]>([]);

    useEffect(() => {
        const enableMidi = async () => {
            try {
                WebMidi.enable();
                console.log("WebMidi enabled!");
                const inputs: Input[] = WebMidi.inputs;    
                setMidiControllerInputs(inputs);
            } catch (err) {
                alert(err);
            }
        };
        if (!isMidiLoaded) {
            enableMidi();
        }
    }, [isMidiLoaded]);

    return { midiControllerInputs};
};

export default setupMidiController;
