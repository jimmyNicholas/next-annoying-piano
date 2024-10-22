import { useCallback, useRef } from "react";
import { modes } from "@/_lib/_data/modes";
import { Mode } from "@/_lib/_types/types";

const useMode = (
    onReset: () => void,
) => {
    const modeIndex = useRef<number>(0);
    const mode = useRef<Mode>(modes[modeIndex.current]);

    const getMode = useCallback(() => {
        return mode.current;
    }, []);

    const setMode = useCallback((newModeIndex: number) => {
        modeIndex.current = newModeIndex;
        mode.current = modes[modeIndex.current];
        onReset();
    },[onReset]);

    const onModChange = useCallback((newValue: number, index: number) => {
        if (!mode.current.modifiers) return;
        const modifier = mode.current.modifiers[index];
        if (newValue < modifier.min || newValue > modifier.max) return;
        mode.current.modifiers[index].value = newValue;
    }, []);

    return { getMode, setMode, onModChange };
};

export default useMode;
