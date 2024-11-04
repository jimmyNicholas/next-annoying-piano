import { ResetIcon } from '@/_assets/icons';
import { Mode, ModeProps } from '@/_lib/_types/types';
import DraggableInput from '@/_ui/DraggableInput';
import { useCallback, useEffect, useState } from 'react';

const Modes: React.FC<ModeProps> = ({
    getModeRef,
    setModeRef,
    updateModifier,
    modes,
    onReset
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
    },[updateModifier]);

    if (!modes.length) {
        return <div>No modes available</div>;
    };

    return (
        <div className="flex-1 grid gap-2 p-2 bg-cyan-100 rounded-lg m-2">
            <div
                className='grid grid-flow-col gap-2'
            >
                <select
                    value={modeState.id}
                    onChange={(e) => onModeChange(e.target.value)}
                    className="px-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    {modes.map((mode) => (
                    <option key={mode.id} value={mode.id}>
                        {mode.name}
                    </option>
                    ))}
                </select>
                <button
                    key={'reset'}
                    className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg px-6 transition-colors shadow-md flex place-content-center"
                    onClick={onReset}
                >
                    <ResetIcon className='w-10 h-10 place-self-center'/>
                </button>
            </div>

            <div className='grid grid-flow-col sm:max-md:grid-flow-row gap-2'> 
                <div className='text-md text-wrap px-2 h-full content-center border border-2 rounded-lg text-white bg-teal-900'>
                    {modeState.description}
                </div>

                {modeState.modifiers?.map((mod, index) => (
                    <div 
                        key={`${mod.id}-${index}`} 
                        className="text-sm text-center place-content-center grid p-2 rounded-lg bg-white "
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
