import { useCallback, useRef } from "react";
import { Mode } from "@/_lib/_types/types";
import { modes } from '@/_lib/_data/modes/index' 

const useMode = (
    onReset: () => void,
) => {
    const modeRef = useRef<Mode>(modes[0]);

    const getModeRef = useCallback(() => {
        return modeRef.current;
    }, []);

    const setModeRef = useCallback((newMode: Mode) => {
        modeRef.current = newMode;
        onReset();
    },[onReset]);

    const updateModifier = useCallback((newValue: number, index: number) => {
        if (!modeRef.current.modifiers) return;
        const modifier = modeRef.current.modifiers[index];
        if (newValue < modifier.min || newValue > modifier.max) return;
        modeRef.current.modifiers[index].value = newValue;
    }, []);

    return { getModeRef, setModeRef, updateModifier, modes };
};

export default useMode;
