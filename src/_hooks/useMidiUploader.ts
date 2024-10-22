import parseMidiFile from "@/_services/parseMidiFile";
import { Midi } from "@tonejs/midi";
import { useCallback, useRef} from "react";

const useMidiUploader = () => {
    const parsedMidiData = useRef<Midi | null>(null);
    const midiFileText = useRef<string | null>(null);

    const getMidiFileText = useCallback(() => {
        return midiFileText.current;
    }, [])

    const setMidiFileText = useCallback((text: string | null) => {
        midiFileText.current = text;
    }, []);

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
        handleMidiUpload
    };
};

export default useMidiUploader;
