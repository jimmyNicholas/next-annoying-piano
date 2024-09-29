import { Midi } from "@tonejs/midi";

const parseMidiFile = (file: File): Promise<Midi> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (!(e.target && e.target.result instanceof ArrayBuffer)) { 
                return reject(new Error("Invalid file format"));
            };
            try {
                const arrayBuffer = e.target.result;
                const parsedMidi = new Midi(arrayBuffer);
                resolve(parsedMidi);
            } catch (error) {
                reject(error)
            }
        };
        reader.onerror = () => reject(null);
        reader.readAsArrayBuffer(file);
    });
};

export default parseMidiFile;