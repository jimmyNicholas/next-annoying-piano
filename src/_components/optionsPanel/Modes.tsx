import { Mode, ModeProps } from '@/_lib/_types/types';
import { useCallback, useEffect, useState } from 'react';

const Modes: React.FC<ModeProps> = ({
    getModeState,
    setModeState,
    setMod,
    maxModes,
}) => {
    const [mode, setMode] = useState<Mode>(getModeState());
    const [updateCounter, setUpdateCounter] = useState<number>(0);

    useEffect(() => {
        setMode(getModeState());
    }, [getModeState, updateCounter]);

    const onModeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setModeState(Number(e.target.value));
        setUpdateCounter(prev => prev + 1);
    },[setModeState, setUpdateCounter]);

    const onModChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        setMod(Number(e.target.value), index);
        setUpdateCounter(prev => prev + 1);
    },[setMod]);

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
                    onChange={(e) => onModeChange(e)}
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
                            onChange={(e) => onModChange(e, index)}
                        />
                        {mod.value}
                    </div>
            )})}
        </div>
    );
};

export default Modes;
