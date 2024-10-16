import parseMidiFile from "@/_services/parseMidiFile";
import { Midi } from "@tonejs/midi";
import { useRef, useState } from "react";

const useMidiUploader = () => {
    const parsedMidiData = useRef<Midi | null>(null);
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
                parsedMidiData.current = parsedMidi;
            })
            .catch((error: Error) => {
                setMidiFileText(error.message)
                parsedMidiData.current = null;
            });
    };
    
    return {
        parsedMidiData: parsedMidiData.current, 
        midiFileText: midiFileText, 
        handleMidiUpload};
};

export default useMidiUploader;
