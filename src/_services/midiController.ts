import { WebMidi, Input } from "webmidi";

const getMidiControllerInputs = () => {
    const inputs: Input[] = WebMidi.inputs;
    return inputs;
};

const setupMidiController = async (): Promise<void> => { 
    try {
        await WebMidi.enable();
    } catch (err) {
        throw err;
    }
};

export {setupMidiController, getMidiControllerInputs};
