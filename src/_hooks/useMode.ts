import { useState, useRef } from "react";
import { modes } from "@/_lib/_data/modes";
import { Mode } from "@/_lib/_types/types";

const useMode = (
    onReset: () => void,
) => {
    const modeIndex = useRef<number>(0);
    const [mode, setMode] = useState<Mode>(modes[modeIndex.current]);

    function updateMode(newModeIndex: number) {
        modeIndex.current = newModeIndex;
        setMode(modes[modeIndex.current]);
        onReset();
    };

    function onModChange(value: number, index: number) {
        setMode(prevMode => ({
            ...prevMode,
            modifiers: prevMode.modifiers?.map((modifier, i) => 
                i === index
                    ? {...modifier, value: value}
                    : modifier
            )
        }));
    };

    return { mode, updateMode, onModChange };
};

export default useMode;
