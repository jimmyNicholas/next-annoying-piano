import { MidiPlaybackProps } from "@/_lib/_types/types";

const MidiPlayback: React.FC<MidiPlaybackProps> = ({
    midiFileText, 
    handleMidiUpload,
    play, 
    pause, 
    stop, 
    playbackState
  }) => {

    return (
        <>
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
