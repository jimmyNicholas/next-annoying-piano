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
            modifyers: [],
        },
        {
            text: 'Gravity',
            value: 'GRAVITY',
            modifyers: [
                {
                    label: 'Strength',
                    min: 0,
                    default: 20,
                    max: 50,
                    step: 5
                }
            ],
        },
    ];
    const [modeIndex, setModeIndex] = useState<number>(0);
    const [modValues, setModValues] = useState<number[]>([]);

    function onChange(indexValue: number) {
        const mode = modes[indexValue].value;
        updateMode(mode);
        setCurrentMode(mode);
        setModeIndex(indexValue);        
    };
    
    function onModChange(value: number, index: number) {
        setModValues([
            ...modValues.slice(0, index),
            value,
            ...modValues.slice(index + 1)
        ])
    };

    return (
        <div className="border-2 border-black grid grid-rows-2">
            <div className="grid grid-cols-[15%_70%_15%]">         
                Mode:
                <input 
                    type="range"
                    className="w-full"
                    value={modeIndex}
                    min={0}
                    max={modes.length - 1}
                    onChange={(e) => onChange(Number(e.target.value))}
                />
                {modes[modeIndex].text}
            </div>
            {modes[modeIndex].modifyers.map((mod, index) => {
                return (
                    <div key={mod.label} className="grid grid-cols-[15%_70%_15%]">
                        {mod.label}
                        <input 
                            type="range"
                            className="w-full"
                            value={modValues[index] ? modValues[index] : mod.default}
                            min={mod.min}
                            max={mod.max}
                            onChange={(e) => onModChange(Number(e.target.value), index)}
                        />
                        {modValues[index] ? modValues[index] : mod.default}
                    </div>
            )})}
        </div>
    );
};

export default Modes;


/*
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
*/
