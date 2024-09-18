import { useCallback, useEffect, useState } from "react";
import { QwertyInputProps, QwertyMap } from "@/_lib/_types/types";

const qwertyMap: QwertyMap = {
	'a' : {
		pitch: 'C',
		baseOctave: 0
    },
	'w': {
	    pitch: 'C#',
		baseOctave: 0
    },
    's': {
	    pitch: 'D',
		baseOctave: 0
    },
    'e' : {
		pitch: 'D#',
		baseOctave: 0
    },
	'd': {
	    pitch: 'E',
		baseOctave: 0
    },
    'f': {
	    pitch: 'F',
		baseOctave: 0
    },
    't' : {
		pitch: 'F#',
		baseOctave: 0
    },
	'g': {
	    pitch: 'G',
		baseOctave: 0
    },
    'y': {
	    pitch: 'G#',
		baseOctave: 0
    },
    'h' : {
		pitch: 'A',
		baseOctave: 0
    },
	'u': {
	    pitch: 'A#',
		baseOctave: 0
    },
    'j': {
	    pitch: 'B',
		baseOctave: 0
    },
    'k' : {
		pitch: 'C',
		baseOctave: 1
    },
	'o': {
	    pitch: 'C#',
		baseOctave: 1
    },
    'l': {
	    pitch: 'D',
		baseOctave: 1
    },
    'p' : {
		pitch: 'D#',
		baseOctave: 1
    },
	';': {
	    pitch: 'E',
		baseOctave: 1
    },
};

export function useQwertyInput({isQwertyEnabled, currentOctave, keyHandlers}: QwertyInputProps) {
    const {onKeyDown, onKeyUp} = keyHandlers;
    const [pressedQwerty, setPressedQwerty] = useState<string[]>([]);

    const handleQwertyDown = useCallback((e: KeyboardEvent) => {
        if (!isQwertyEnabled) { return };

        const qwertyKey = e.key;
        if (qwertyMap[qwertyKey] && !pressedQwerty.includes(qwertyKey)) {
            const {pitch, baseOctave} = qwertyMap[qwertyKey];
            const keyName = pitch + (currentOctave + baseOctave);
            onKeyDown(keyName);
            setPressedQwerty(prev => [...prev, qwertyKey]);
        };      
        
    }, [isQwertyEnabled, currentOctave, pressedQwerty, onKeyDown]);

    const handleQwertyUp = useCallback((e: KeyboardEvent) => {
        if (!isQwertyEnabled) { return };
        
        const qwertyKey = e.key;
        if (qwertyMap[qwertyKey]) {
            const {pitch, baseOctave} = qwertyMap[qwertyKey];
            const keyName = pitch + (currentOctave + baseOctave);
            onKeyUp(keyName);
            setPressedQwerty(prev => prev.filter(k => k !== e.key));
        };   
    }, [isQwertyEnabled, currentOctave, onKeyUp]);

    useEffect(() => {
        window.addEventListener('keydown', handleQwertyDown);
        window.addEventListener('keyup', handleQwertyUp);

        return () => {
            window.removeEventListener('keydown', handleQwertyDown);
            window.removeEventListener('keyup', handleQwertyUp);
        };
    }, [handleQwertyDown, handleQwertyUp]);
};
