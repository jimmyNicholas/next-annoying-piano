import { Midi } from "@tonejs/midi";

const parseMidiFile = (file: File): Promise<Midi> => {
    return new Promise((resolve, reject) => {
        if(!file) {
            reject(new Error("No file provided"));
            return;
        };

        if(!(file instanceof Blob)) {
            reject(new Error("Invalid file object"));
            return;
        };

        const reader = new FileReader();

        reader.onload = (e) => {
            if (!(e.target && e.target.result instanceof ArrayBuffer)) { 
                reject(new Error("Failed to read file"));
                return;
            };

            try {
                const arrayBuffer = e.target.result;
                const parsedMidi = new Midi(arrayBuffer);
                resolve(parsedMidi);
            } catch (error) {
                reject(error)
            }
        };
        
        reader.onerror = () => reject(new Error("Error reading file"));
        reader.readAsArrayBuffer(file);
    });
};

export default parseMidiFile;