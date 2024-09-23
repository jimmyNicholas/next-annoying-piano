import { WebMidi, Input } from "webmidi";
import { useState } from 'react';

const getMidiControllerInputs = () => {
    const inputs: Input[] = WebMidi.inputs;
    return inputs;
};

const setupMidiController = async () => { 
    const [midiLoaded, setMidiLoaded] = useState(false);

    await WebMidi.enable()  
        .then(() => setMidiLoaded(true))
        .catch(err => alert(err))

    return midiLoaded;
};

export {setupMidiController, getMidiControllerInputs};
