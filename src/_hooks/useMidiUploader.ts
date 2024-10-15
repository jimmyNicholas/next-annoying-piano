import parseMidiFile from "@/_services/parseMidiFile";
import { Midi } from "@tonejs/midi";
import { useRef } from "react";

const useMidiUploader = () => {
    const parsedMidiData = useRef<Midi | null>(null);
    const midiFileText = useRef<string | null>(null);

    function handleMidiUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!e.target.files) { return };
        if (!file) {
            midiFileText.current = "No file selected";
            return;
        };
        midiFileText.current = null;

        parseMidiFile(file)
            .then((parsedMidi) => {
                midiFileText.current = file.name;
                parsedMidiData.current = parsedMidi;
            })
            .catch((error: Error) => {
                midiFileText.current = error.message;
                parsedMidiData.current = null;
            });
    };
    
    return {
        parsedMidiData: parsedMidiData.current, 
        midiFileText: midiFileText.current, 
        handleMidiUpload};
};

export default useMidiUploader;
