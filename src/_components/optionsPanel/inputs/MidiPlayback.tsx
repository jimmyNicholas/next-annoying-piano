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
        <div className="flex-1 grid grid-flow-col gap-2 p-2">
            <div className="grid grid-flow-col gap-1">         
                <button 
                    className={`${playbackState === 'playing' ? "bg-yellow-300" : "bg-slate-300"} p-2 place-items-center rounded-lg`}
                    onClick={play}>
                        <PlayIcon className="w-10 h-10"/> 
                </button>
                <button 
                    className={`${playbackState === 'paused' ? "bg-yellow-300" : "bg-slate-300"} p-2 place-items-center rounded-lg`}
                    onClick={pause}>
                        <PauseIcon className="w-10 h-10"/>
                </button>
                <button 
                    className={`${playbackState === 'stopped' ? "bg-yellow-300" : "bg-slate-300"} p-2 place-items-center rounded-lg`}
                    onClick={stop}>
                        <StopIcon className="w-10 h-10"/>
                </button>
            </div>
            <div className="grid grid-flow-row">
                <label
                    className={`bg-slate-300 grid justify-center content-center rounded-lg`}
                >
                    <UploadFileIcon className="w-16 h-16"/> 
                    <input 
                        type="file" 
                        accept=".mid, .midi" 
                        onChange={handleMidiUpload} 
                        className="hidden"
                    />
                </label>
                <div
                    className="text-sm text-center content-center"
                >
                    {midiFileText ? midiFileText : (<div>No Midi File Loaded</div>)}
                </div>
            </div>
        </div>
    );
};

export default MidiPlayback;
