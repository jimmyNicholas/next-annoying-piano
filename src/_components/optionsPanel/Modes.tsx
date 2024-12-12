import { ResetIcon } from '@/_assets/icons';
import { Mode } from '@/_lib/_types/types';
import DraggableInput from '@/_ui/DraggableInput';
import { useCallback, useEffect, useState } from 'react';

export interface ModeProps {
    getModeRef: () => Mode;
    setModeRef: (newMode: Mode) => void;
    updateModifier: (newValue: number, index: number) => void;
    modes: Mode[];
    onReset: () => void;
};

/**
 * Props for the mode selection component
 * @interface ModeProps
 * @property {() => Mode} getModeRef - Function to get the current mode reference
 * @property {(newMode: Mode) => void} setModeRef - Function to set a new mode
 * @property {(newValue: number, index: number) => void} updateModifier - Function to update mode modifiers
 * @property {Mode[]} modes - Array of available modes
 * @property {() => void} onReset - Function to reset mode to default state
 */

/**
 * Component for selecting and configuring musical modes
 * Provides mode selection, modifier controls, and reset functionality
 * @param {ModeProps} props - The component props
 * @returns {JSX.Element} Rendered mode controls
 */
const Modes: React.FC<ModeProps> = ({
    getModeRef,
    setModeRef,
    updateModifier,
    modes,
    onReset
}: ModeProps): JSX.Element => {
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
        <div className="gap-2 p-2 bg-cyan-100 rounded-lg m-2 grid grid-flow-col 2xl:grid-flow-row">
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

            <div className='
                md:max-lg:grid-flow-row  gap-2
                grid
                sm:grid-flow-col
                '
            > 
                <div className='text-lg text-wrap px-2 h-full content-center border-2 rounded-lg text-white bg-teal-900'>
                    {modeState.description}
                </div>

                {modeState.modifiers?.map((mod, index) => (
                    <div 
                        key={`${mod.id}-${index}`} 
                        className="sm:max-md:text-sm md:text-base text-center place-content-center p-2 mx-2 rounded-lg bg-white"
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
