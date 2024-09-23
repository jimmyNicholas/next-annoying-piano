import { WebMidi, Input } from "webmidi";

const getMidiControllerInputs = () => {
    const inputs: Input[] = WebMidi.inputs;
    return inputs;
};

const setupMidiController = () => { 
    try {
        WebMidi.enable();
    } catch (err) {
        throw err;
    }
};

export {setupMidiController, getMidiControllerInputs};
