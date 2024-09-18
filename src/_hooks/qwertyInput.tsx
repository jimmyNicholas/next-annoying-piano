import { useCallback, useEffect } from "react";
import { QwertyInputProps, QwertyMap, BaseKeyName } from "@/_lib/_types/types";

const qwertyMap: QwertyMap = {
	'a' : {
		pitch: 'C',
		baseOctave: 0
    },
	'w': {
	    pitch: 'C#',
		baseOctave: 0
    },
    'l': {
	    pitch: 'D',
		baseOctave: 1
    },
};

export function useQwertyInput({isQwertyEnabled, currentOctave, onKeyDown, onKeyUp}: QwertyInputProps) {

    const handleQwertyDown = useCallback((e: KeyboardEvent) => {
        if (!isQwertyEnabled) { return };

        const {pitch, baseOctave} = qwertyMap[e.key];
        if (!pitch || !baseOctave) { return };

        const keyName = pitch + (currentOctave + baseOctave);
        onKeyDown(keyName);
    }, [isQwertyEnabled, currentOctave]);

    const handleQwertyUp = useCallback((e: KeyboardEvent) => {
        if (!isQwertyEnabled) { return };

        const {pitch, baseOctave} = qwertyMap[e.key];
        if (!pitch || !baseOctave) { return };

        const keyName = pitch + (currentOctave + baseOctave);
        onKeyUp(keyName);
    }, [isQwertyEnabled, currentOctave]);

    useEffect(() => {
        window.addEventListener('keydown', handleQwertyDown);
        window.addEventListener('keyup', handleQwertyUp);

        return () => {
            window.removeEventListener('keydown', handleQwertyDown);
            window.removeEventListener('keyup', handleQwertyUp);
        };
    }, [handleQwertyDown, handleQwertyUp]);
};
