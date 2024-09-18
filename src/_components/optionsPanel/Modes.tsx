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
        },
        {
            text: 'Gravity',
            value: 'GRAVITY',
            isSelected: 'GRAVITY' === currentMode,
        },
    ];

    function onClick(e: React.MouseEvent<HTMLButtonElement>) {
        const clickedMode = e.currentTarget.value;
        updateMode(clickedMode);
        setCurrentMode(clickedMode);
    };

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
                </button>
            ))}
        </div>
    );
};

export default Modes;
