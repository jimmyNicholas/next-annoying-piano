import { useCallback, useRef } from "react";
import { modes } from "@/_lib/_data/modes";
import { Mode } from "@/_lib/_types/types";

const useMode = (
    onReset: () => void,
) => {
    const modeIndex = useRef<number>(0);
    const modeState = useRef<Mode>(modes[modeIndex.current]);

    const getModeState = useCallback(() => {
        return modeState.current;
    }, []);

    const setModeState = useCallback((newModeIndex: number) => {
        modeIndex.current = newModeIndex;
        modeState.current = modes[modeIndex.current];
        onReset();
    },[onReset]);

    const onModChange = useCallback((newValue: number, index: number) => {
        if (!modeState.current.modifiers) return;
        const modifier = modeState.current.modifiers[index];
        if (newValue < modifier.min || newValue > modifier.max) return;
        modeState.current.modifiers[index].value = newValue;
    }, []);

    return { getModeState, setModeState, onModChange };
};

export default useMode;
