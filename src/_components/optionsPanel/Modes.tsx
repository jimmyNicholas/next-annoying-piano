import { useState } from "react";
import { ModeProps } from '@/_lib/_types/types';

const Modes: React.FC<ModeProps> = ({
    mode,
    updateMode,
}) => {
    const [currentMode, setCurrentMode] = useState(mode);

    const modes = [
        {
            text: 'Swap',
            value: 'SWAP',
            isSelected: 'SWAP' === currentMode,
            modifyers: [],
        },
        {
            text: 'Gravity',
            value: 'GRAVITY',
            isSelected: 'GRAVITY' === currentMode,
            modifyers: [
                {
                    min: 0,
                    default: 20,
                    max: 50,
                    step: 5
                }
            ],
        },
    ];

    function onClick(e: React.MouseEvent<HTMLButtonElement>) {
        const clickedMode = e.currentTarget.value;
        updateMode(clickedMode);
        setCurrentMode(clickedMode);
    };

    const [knobValue, setKnobValue] = useState<number>(50);
    
    return (
        <div className="border-2 border-black grid grid-cols-4">
            {modes.map((mode) => (
                <button
                    key={mode.value}
                    className={`
                        ${mode.isSelected ? 'bg-orange-400' : 'bg-slate-300'}
                        m-2
                        `
                    }
                    onClick={((e) => onClick(e))}
                    value={mode.value}
                >
                    {mode.text}  
                    <input 
                        type="range"
                        className="w-10"
                        min={0}
                        max={100}
                        step={10}
                        onChange={(e) => setKnobValue(Number(e.target.value))}
                    />
                </button>
            ))}
            
        </div>
    );
};

export default Modes;
