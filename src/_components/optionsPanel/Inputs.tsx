import { InputProps } from "@/_lib/_types/types";
import { useCallback, useState } from "react";
import { useMIDIInputs } from '@react-midi/hooks'
import { QwertyIcon } from "@/_assets/icons";

const Inputs: React.FC<InputProps> = ({
    isQwertyEnabled,
    toggleIsQwertyEnabled,
}) => {
    const [isEnabled, setIsEnabled] = useState<boolean>(isQwertyEnabled);
    
    const onClick = useCallback(() =>  {
        toggleIsQwertyEnabled();
        setIsEnabled(prev => !prev);
    }, [toggleIsQwertyEnabled, setIsEnabled]);

    const { inputs, selectInput, selectedInputId } = useMIDIInputs();

    return (
        <div className="grid grid-cols-[40%_60%] p-2">
            <div className="grid grid-rows-2 gap-2">
                <button
                    key={'enableAudio'}
                    className={`${isEnabled ? "bg-yellow-400 hover:bg-yellow-500" : "bg-slate-300 hover:bg-slate-400"} grid justify-center content-center rounded-lg`}
                    onClick={onClick}
                >
                    <QwertyIcon className="w-10 h-10"/>
                </button>
                <select 
                    value={selectedInputId || ''} 
                    onChange={(e) => selectInput(e.target.value)}
                    className="p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Select MIDI Controller</option>
                    {inputs.map((input) => (
                    <option key={input.id} value={input.id}>
                        {input.name}
                    </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Inputs;