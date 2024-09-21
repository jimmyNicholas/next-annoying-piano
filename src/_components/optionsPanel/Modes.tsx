import { useState } from "react";
import { ModeProps } from '@/_lib/_types/types';

const Modes: React.FC<ModeProps> = ({
    mode,
    updateMode,
    onModChange,
    maxModes,
}) => {
    
    return (
        <div className="border-2 border-black grid grid-rows-2">
            <div className="grid grid-cols-[15%_70%_15%]">         
                Mode:
                <input 
                    type="range"
                    className="w-full"
                    value={mode.index}
                    min={0}
                    max={maxModes}
                    onChange={(e) => updateMode(Number(e.target.value))}
                />
                {mode.text}
            </div>
            {mode.modifiers?.map((mod, index) => {
                return (
                    <div key={mod.label} className="grid grid-cols-[15%_70%_15%]">
                        {mod.label}
                        <input 
                            type="range"
                            className="w-full"
                            value={mod.value}
                            min={mod.min}
                            max={mod.max}
                            onChange={(e) => onModChange(Number(e.target.value), index)}
                        />
                        {mod.value}
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
