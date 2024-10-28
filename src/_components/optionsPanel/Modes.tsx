import { Mode, ModeProps } from '@/_lib/_types/types';
import { useCallback, useEffect, useState } from 'react';

const Modes: React.FC<ModeProps> = ({
    getModeRef,
    setModeRef,
    updateModifier,
    modes
}) => {
    const [modeState, setModeState] = useState<Mode>(getModeRef());
    const [updateCounter, setUpdateCounter] = useState<number>(0);

    useEffect(() => {
        setModeState(getModeRef());
    }, [getModeRef, updateCounter]);

    const onModeChange = useCallback((id: string) => {
        const newMode = modes.find(m => m.id === id);
        if (newMode) setModeRef(newMode);
        setUpdateCounter(prev => prev + 1);
    },[modes, setModeRef]);

    const onModChange = useCallback((value: string, index: number) => {
        updateModifier(Number(value), index);
        setUpdateCounter(prev => prev + 1);
    },[updateModifier, setUpdateCounter]);

    if (!modes.length) {
        return <div>No modes available</div>;
    };

    return (
        <div className="border-2 border-black">
            <div className="grid grid-cols-[30%_70%]">
                <select
                    value={modeState.id}
                    onChange={(e) => onModeChange(e.target.value)}
                >
                    {modes.map((mode) => (
                    <option key={mode.id} value={mode.id}>
                        {mode.name}
                    </option>
                    ))}
                </select>
                <div className='p-2'>{modeState.description}</div>
            </div>

            {modeState.modifiers?.map((mod, index) => (
                <div 
                    key={`${mod.id}-${index}`} 
                    className="grid grid-cols-[15%_70%_15%] items-center text-center"
                >
                    {mod.name}
                    <input 
                        type="range"
                        className="w-full"
                        value={mod.value}
                        min={mod.min}
                        max={mod.max}
                        step={mod.step}
                        onChange={(e) => onModChange(e.target.value, index)}
                    />
                    {mod.value}
                </div>
            ))}  
        </div>
    );
};

export default Modes;
