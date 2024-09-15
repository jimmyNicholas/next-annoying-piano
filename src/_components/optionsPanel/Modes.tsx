import { useState } from "react";

export default function Modes({
    mode,
    updateMode,
    } : {    
    mode: string;
    updateMode: (mode: string) => void;
}) {
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
                        ${mode.isSelected ? 'bg-orange-400' : 'bg-slate-400'}
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
}
