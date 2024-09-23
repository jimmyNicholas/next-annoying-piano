import { WebMidi, Input } from "webmidi";
import {useEffect, useState} from 'react';

export async function setupMidiController(isMidiLoaded = false) { 
    const [midiInputs, setMidiInputs] = useState<Input[]>([]);

    useEffect(() => {
        const enableMidi = async () => {
            try {
                WebMidi.enable();
                console.log("WebMidi enabled!");
                const inputs: Input[] = WebMidi.inputs;    
                setMidiInputs(inputs);
            } catch (err) {
                alert(err);
            }
        };
        if (!isMidiLoaded) {
            enableMidi();
        }
    }, [isMidiLoaded]);
};
