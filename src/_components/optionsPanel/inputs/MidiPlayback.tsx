import { MidiPlaybackProps } from "@/_lib/_types/types";
import { UploadFileIcon } from "@/_assets/icons";
import { PlayIcon, PauseIcon, StopIcon } from "@/_assets/icons";

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
                    className="border-2 border-black p-1 grid justify-center content-center"
                    onClick={play}>
                        <PlayIcon className="size-12"/> 
                </button>
                <button 
                    className="border-2 border-black p-1 grid justify-center content-center"
                    onClick={pause}>
                        <PauseIcon className="size-12"/>
                </button>
                <button 
                    className="border-2 border-black p-1 grid justify-center content-center"
                    onClick={stop}>
                        <StopIcon className="size-12"/>
                </button>
            </div>
            <div className="grid grid-flow-col">
                <label
                    className={`bg-slate-300 grid justify-center content-center`}
                >
                    <UploadFileIcon className="size-20"/>
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
