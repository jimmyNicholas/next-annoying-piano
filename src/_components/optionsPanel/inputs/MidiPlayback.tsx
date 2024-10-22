import { MidiPlaybackProps } from "@/_lib/_types/types";
import { useState } from "react";

const MidiPlayback: React.FC<MidiPlaybackProps> = ({
    getMidiFileText, 
    handleMidiUpload,
    play, 
    pause, 
    stop, 
    getPlaybackState
  }) => {
    const [ playbackState ] = useState<'stopped' | 'playing' | 'paused'>(getPlaybackState());
    const [midiFileText] = useState<string | null>(getMidiFileText());

    return (
        <>
            {playbackState}
            <div className="grid grid-flow-col">         
                <button 
                    className="border-2 border-black p-1"
                    onClick={play}>
                        Play
                </button>
                <button 
                    className="border-2 border-black p-1"
                    onClick={pause}>
                        Pause
                </button>
                <button 
                    className="border-2 border-black p-1"
                    onClick={stop}>
                        Stop
                </button>
            </div>
            <div className="grid grid-flow-col">
                <label
                    className={`bg-slate-300 m-2`}
                >
                    Upload Midi File
                    <input 
                        type="file" 
                        accept=".mid, .midi" 
                        onChange={handleMidiUpload} 
                        className="hidden"
                    />
                </label>
                {midiFileText ? midiFileText : (null)}
            </div>
        </>
    );
};

export default MidiPlayback;
