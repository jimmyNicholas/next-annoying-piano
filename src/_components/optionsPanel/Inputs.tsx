import { InputProps } from "@/_lib/_types/types";
import { useState } from "react";

const Inputs: React.FC<InputProps> = ({
    checkIsQwertyEnabled,
    toggleIsQwertyEnabled,
}) => {
    const [isEnabled, setIsEnabled] = useState(checkIsQwertyEnabled());
    function onClick() {
        toggleIsQwertyEnabled();
        setIsEnabled(checkIsQwertyEnabled());
    };

    return (
        <div className="border-2 border-black grid">
            <button
                key={'enableAudio'}
                className={`${isEnabled ? "bg-yellow-300" : "bg-slate-300"} m-2`}
                onClick={onClick}
            >
                QWERTY Enabled
            </button>
        </div>
    );
};

export default Inputs;