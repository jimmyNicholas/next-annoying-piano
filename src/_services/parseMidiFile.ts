import { Midi } from "@tonejs/midi";

const parseMidiFile = (file: File) => {
    const reader = new FileReader();
    let parsedMidi = null;
    reader.onload = async (e) => {
        if (!(e.target && e.target.result instanceof ArrayBuffer)) { return null };
        const arrayBuffer = e.target.result;
        parsedMidi = new Midi(arrayBuffer);
    }
    reader.readAsArrayBuffer(file);
    return parsedMidi;
};

export default parseMidiFile;