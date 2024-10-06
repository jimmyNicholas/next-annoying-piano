import parseMidiFile from "@/_services/parseMidiFile";
import { Midi } from "@tonejs/midi";
import { useState } from "react";

const useMidiUploader = () => {
    const [parsedMidiData, setParsedMidiData] = useState<Midi | null>(null);
    const [midiFileText, setMidiFileText] = useState<string | null>(null);

    function handleMidiUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!e.target.files) { return };
        if (!file) {
            setMidiFileText("No file selected");
            return;
        };

        setMidiFileText(null);

        parseMidiFile(file)
            .then((parsedMidi) => {
                setMidiFileText(file.name);
                setParsedMidiData(parsedMidi); 
            })
            .catch((error: Error) => {
                setMidiFileText(error.message);
                setParsedMidiData(null);
            });
    };
    return {parsedMidiData, midiFileText, handleMidiUpload};
};

export default useMidiUploader;
