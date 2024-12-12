import parseMidiFile from "@/_services/parseMidiFile";
import { Midi } from "@tonejs/midi";
import { useRef, useState} from "react";

interface MidiUploaderState {
    parsedMidiData: Midi | null;
    midiFileText: string | null;
    handleMidiUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Custom hook for handling MIDI file uploads and parsing.
 * Manages the upload state and provides parsed MIDI data for playback.
 * 
 * @returns {MidiUploaderState} Object containing upload state and handler
 * 
 * @example
 * function MidiUploader() {
 *   const { parsedMidiData, midiFileText, handleMidiUpload } = useMidiUploader();
 * 
 *   return (
 *     <div>
 *       <input 
 *         type="file" 
 *         accept=".mid,.midi" 
 *         onChange={handleMidiUpload} 
 *       />
 *       {midiFileText && <p>{midiFileText}</p>}
 *     </div>
 *   );
 * }
 */
const useMidiUploader = (): MidiUploaderState => {
    // State for parsed MIDI data and UI feedback
    const parsedMidiData = useRef<Midi | null>(null);
    const [midiFileText, setMidiFileText] = useState<string | null>(null);

    /**
     * Handles MIDI file upload and parsing
     * Updates state with parsed MIDI data or error message
    */
    const handleMidiUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';

        if (!file) {
            setMidiFileText("No file selected");
            parsedMidiData.current = null;
            return;
        };

        // Validate file type
        if (!file.name.match(/\.(mid|midi)$/i)) {
            console.log('here');
            
            setMidiFileText("Invalid file type. Please select a MIDI file");
            parsedMidiData.current = null;
            return;
        };

        // Clear previous state
        setMidiFileText(null);

        parseMidiFile(file)
            .then((parsedMidi) => {
                setMidiFileText(file.name);
                parsedMidiData.current = parsedMidi;
            })
            .catch((error: Error) => {
                //Handle parsing errors
                const errorMessage = error instanceof Error 
                    ? error.message 
                    : "Failed to parse MIDI file";
                setMidiFileText(errorMessage)
                parsedMidiData.current = null;
            });
    };
    
    return {
        parsedMidiData: parsedMidiData.current, 
        midiFileText, 
        handleMidiUpload
    };
};

export default useMidiUploader;
