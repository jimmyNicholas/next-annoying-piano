import { InputProps } from "@/_lib/_types/types";
import { useState } from "react";
import { useMIDIInputs } from '@react-midi/hooks'
import MidiPlayback from "./inputs/MidiPlayback";

const Inputs: React.FC<InputProps> = ({
    checkIsQwertyEnabled,
    toggleIsQwertyEnabled,
    keyHandlers
}) => {
    const [isEnabled, setIsEnabled] = useState(checkIsQwertyEnabled());
    function onClick() {
        toggleIsQwertyEnabled();
        setIsEnabled(checkIsQwertyEnabled());
    };

    const { inputs, selectInput, selectedInputId } = useMIDIInputs();

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
            <MidiPlayback {...keyHandlers}/>
        </div>
    );
};

export default Inputs;