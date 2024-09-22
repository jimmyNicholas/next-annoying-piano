import { InputProps } from "@/_lib/_types/types";

const Inputs: React.FC<InputProps> = ({
    isQwertyEnabled,
}) => {
    const toggleIsQwertyEnabled = () => {
        isQwertyEnabled.current = !isQwertyEnabled.current;
    }

    return (
        <div className="border-2 border-black">
            <button
                key={'enableAudio'}
                className={`${isQwertyEnabled ? "bg-yellow-300" : "bg-slate-300"} m-2`}
                onClick={toggleIsQwertyEnabled}
            >
                QWERTY Enabled
            </button>
        </div>
    );
};

export default Inputs;