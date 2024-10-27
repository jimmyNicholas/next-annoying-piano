import { InputProps } from "@/_lib/_types/types";
import { useCallback, useState } from "react";
import { useMIDIInputs } from '@react-midi/hooks'
import MidiPlayback from "./inputs/MidiPlayback";
import { QwertyIcon } from "@/_assets/icons";

const Inputs: React.FC<InputProps> = ({
    isQwertyEnabled,
    toggleIsQwertyEnabled,
    midiPlaybackProps
}) => {
    const [isEnabled, setIsEnabled] = useState<boolean>(isQwertyEnabled);
    
    const onClick = useCallback(() =>  {
        toggleIsQwertyEnabled();
        setIsEnabled(prev => !prev);
    }, [toggleIsQwertyEnabled, setIsEnabled]);

    const { inputs, selectInput, selectedInputId } = useMIDIInputs();

    return (
        <div className="border-2 border-black grid grid-cols-2">
            <button
                key={'enableAudio'}
                className={`${isEnabled ? "bg-yellow-300" : "bg-slate-300"} grid justify-center content-center`}
                onClick={onClick}
            >
                <QwertyIcon className="size-20"/>
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
            <MidiPlayback {...midiPlaybackProps}/>
        </div>
    );
};

export default Inputs;