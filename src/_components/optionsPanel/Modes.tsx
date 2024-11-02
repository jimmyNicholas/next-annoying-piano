import { Mode, ModeProps } from '@/_lib/_types/types';
import DraggableInput from '@/_ui/DraggableInput';
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

    const onModChange = useCallback((value: string | number, index: number) => {
        updateModifier(Number(value), index);
        setUpdateCounter(prev => prev + 1);
    },[updateModifier, setUpdateCounter]);

    if (!modes.length) {
        return <div>No modes available</div>;
    };

    return (
        <div className="flex-2">
            <div className="grid grid-rows-2 gap-2 m-2">
                <select
                    value={modeState.id}
                    onChange={(e) => onModeChange(e.target.value)}
                    className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    {modes.map((mode) => (
                    <option key={mode.id} value={mode.id}>
                        {mode.name}
                    </option>
                    ))}
                </select>

                <div className='text-md text-slate-600 p-4'>
                    {modeState.description}
                </div>

                {modeState.modifiers?.map((mod, index) => (
                    <div 
                        key={`${mod.id}-${index}`} 
                        className="grid grid-cols-3 text-sm items-center text-center"
                    >
                        <DraggableInput 
                            label={`${mod.name}: `}
                            value={mod.value}
                            min={mod.min}
                            max={mod.max}
                            step={mod.step}
                            onChange={(value) => onModChange(value, index)}
                        />
                    </div>
                ))}  

            </div> 
        </div>           
    );
};

export default Modes;
