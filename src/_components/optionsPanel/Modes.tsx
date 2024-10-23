import { modes } from '@/_lib/_data/modes';
import { Mode, ModeProps } from '@/_lib/_types/types';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

const Modes: React.FC<ModeProps> = ({
    getModeState,
    setModeState,
    setMod,
}) => {
    const [mode, setMode] = useState<Mode>(getModeState());
    const [updateCounter, setUpdateCounter] = useState<number>(0);

    useEffect(() => {
        setMode(getModeState());
    }, [getModeState, updateCounter]);

    const onModeChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setModeState(Number(e.target.value));
        setUpdateCounter(prev => prev + 1);
    },[setModeState, setUpdateCounter]);

    const onModChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        setMod(Number(e.target.value), index);
        setUpdateCounter(prev => prev + 1);
    },[setMod]);

    return (
        <div className="border-2 border-black grid grid-rows-[30%_70%]">
            <div className="grid grid-cols-2">
                <select
                    value={mode.index}
                    onChange={(e) => onModeChange(e)}
                >
                    {modes.map((mode) => (
                    <option key={mode.index} value={mode.index}>
                        {mode.text}
                    </option>
                    ))}
                </select>
                <div className='p-2'>{mode.description}</div>
            </div>

            {mode.modifiers?.map((mod, index) => (
                    <div key={mod.label} className="grid grid-cols-[15%_70%_15%] items-center text-center">
                        {mod.label}
                        <input 
                            type="range"
                            className="w-full"
                            value={mod.value}
                            min={mod.min}
                            max={mod.max}
                            step={mod.step}
                            onChange={(e) => onModChange(e, index)}
                        />
                        {mod.value}
                    </div>
            ))}  
        </div>
    );
};

export default Modes;
