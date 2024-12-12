import { useCallback, useState } from "react";
import { useMIDIInputs } from '@react-midi/hooks'
import { QwertyIcon } from "@/_assets/icons";

export interface InputProps {
    isQwertyEnabled: boolean;
    toggleIsQwertyEnabled: () => void;
};

/**
 * Props for the input control component
 * @interface InputProps
 * @property {boolean} isQwertyEnabled - Whether QWERTY keyboard input is enabled
 * @property {() => void} toggleIsQwertyEnabled - Function to toggle QWERTY keyboard input
 */

/**
 * Component that manages MIDI controller selection and QWERTY keyboard input
 * Uses react-midi-hooks for MIDI device integration
 * @param {InputProps} props - The component props
 * @returns {JSX.Element} Rendered input controls
 */
const Inputs: React.FC<InputProps> = ({
    isQwertyEnabled,
    toggleIsQwertyEnabled,
}: InputProps): JSX.Element => {
    const [isEnabled, setIsEnabled] = useState<boolean>(isQwertyEnabled);
    
    const onClick = useCallback(() =>  {
        toggleIsQwertyEnabled();
        setIsEnabled(prev => !prev);
    }, [toggleIsQwertyEnabled, setIsEnabled]);

    const { inputs, selectInput, selectedInputId } = useMIDIInputs();

    return (
        <div className="grid p-2 bg-cyan-100 rounded-lg m-2 
            
        ">
            <div className="gap-2 grid grid-flow-row"
            >
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
                    className="p-2 rounded-lg ring-2 ring-blue-400 hover:ring-blue-500 focus:ring-blue-500 focus:border-transparent"
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