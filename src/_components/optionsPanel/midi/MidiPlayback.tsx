import { UploadFileIcon } from "@/_assets/icons";
import MidiPlaybackButton from "./MidiPlaybackButton";

export interface MidiPlaybackProps {
    midiFileText: string | null;
    handleMidiUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    play: () => void; 
    pause: () => void;
    stop: () => void;
    playbackState:  'stopped' | 'playing' | 'paused';
};

/**
 * Props for MIDI playback controls
 * @interface MidiPlaybackProps
 * @property {string | null} midiFileText - Display text for the currently loaded MIDI file
 * @property {(e: React.ChangeEvent<HTMLInputElement>) => void} handleMidiUpload - Handler for MIDI file upload events
 * @property {() => void} play - Function to start MIDI playback
 * @property {() => void} pause - Function to pause MIDI playback
 * @property {() => void} stop - Function to stop MIDI playback
 * @property {'stopped' | 'playing' | 'paused'} playbackState - Current state of MIDI playback
 */

/**
 * Component providing MIDI file playback controls and file upload functionality
 * Displays the current MIDI file name and playback state
 * @param {MidiPlaybackProps} props - The component props
 * @returns {JSX.Element} Rendered MIDI playback controls
 */
const MidiPlayback: React.FC<MidiPlaybackProps> = ({
    midiFileText, 
    handleMidiUpload,
    play, 
    pause, 
    stop, 
    playbackState
  }: MidiPlaybackProps): JSX.Element => {

    return (
        <div className="gap-2 p-2 bg-cyan-100 rounded-lg m-2 grid grid-flow-row">
            <div className="grid grid-flow-col gap-2">         
                <MidiPlaybackButton 
                    action="play"
                    onClick={play}
                    currentState={playbackState}
                />
                <MidiPlaybackButton 
                    action="pause"
                    onClick={pause}
                    currentState={playbackState}
                />
                <MidiPlaybackButton 
                    action="stop"
                    onClick={stop}
                    currentState={playbackState}
                />
            </div>
            <div className="grid grid-flow-col gap-2">
                <label
                    className={`bg-slate-300 grid justify-center content-center rounded-lg`}
                >
                    <UploadFileIcon className="w-10 h-10"/> 
                    <input 
                        type="file" 
                        accept=".mid, .midi" 
                        onChange={handleMidiUpload} 
                        className="hidden"
                    />
                </label>
                <div
                    className="text-md text-center content-center rounded-lg text-white bg-teal-900"
                >
                    {midiFileText ? midiFileText : (<div>No Midi File Loaded</div>)}
                </div>
            </div>
        </div>
    );
};

export default MidiPlayback;
