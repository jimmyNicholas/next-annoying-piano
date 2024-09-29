import { InputProps } from "@/_lib/_types/types";
import { useState } from "react";
import { useMIDIInputs } from '@react-midi/hooks'

const Inputs: React.FC<InputProps> = ({
    checkIsQwertyEnabled,
    toggleIsQwertyEnabled,
    handleMidiUpload,
    midiPlayback
}) => {
    const [isEnabled, setIsEnabled] = useState(checkIsQwertyEnabled());
    function onClick() {
        toggleIsQwertyEnabled();
        setIsEnabled(checkIsQwertyEnabled());
    };

    const { inputs, selectInput, selectedInputId } = useMIDIInputs();
    const { play, pause, stop } = midiPlayback;

    return (
        <div className="border-2 border-black grid">
            <button
                key={'enableAudio'}
                className={`${isEnabled ? "bg-yellow-300" : "bg-slate-300"} m-2`}
                onClick={onClick}
            >
                QWERTY Enabled
            </button>
            <select 
                value={selectedInputId || ''} 
                onChange={(e) => selectInput(e.target.value)}
            >
                <option value="">Select MIDI Input</option>
                {inputs.map((input) => (
                <option key={input.id} value={input.id}>
                    {input.name}
                </option>
                ))}
            </select>
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
            <input type="file" accept=".mid, .midi" onChange={handleMidiUpload} />
        </div>
    );
};

export default Inputs;