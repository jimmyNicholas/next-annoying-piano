import { useCallback, useEffect, useRef, useState } from "react";
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

export function useQwertyInput({checkIsQwertyEnabled, octaveRange, keyHandlers}: QwertyInputProps) {
    const {onKeyDown, onKeyUp} = keyHandlers;
    const {octaveMin, octaveMax} = octaveRange;
    const currentOctave = useRef<number>(octaveRange.currentOctave);
    const [pressedQwerty, setPressedQwerty] = useState<string[]>([]);

    const handleQwertyDown = useCallback((e: KeyboardEvent) => {
        if (!checkIsQwertyEnabled) { return };
        
        const qwertyKey = e.key.toLowerCase();
        if (qwertyKey === 'z' && currentOctave.current > octaveMin) {
            currentOctave.current--;
            return; 
        };
        if (qwertyKey === 'x' && currentOctave.current < octaveMax) {
            currentOctave.current++;
            return;
        };

        if (qwertyMap[qwertyKey] && !pressedQwerty.includes(qwertyKey)) {
            const {pitch, baseOctave} = qwertyMap[qwertyKey];
            const keyName = pitch + (currentOctave.current + baseOctave);
            onKeyDown(keyName);
            setPressedQwerty(prev => [...prev, qwertyKey]);
        };      
        
    }, [checkIsQwertyEnabled, currentOctave, octaveMin, octaveMax, pressedQwerty, onKeyDown]);

    const handleQwertyUp = useCallback((e: KeyboardEvent) => {
        if (!checkIsQwertyEnabled) { return };
        
        const qwertyKey = e.key.toLowerCase();
        if (qwertyMap[qwertyKey]) {
            const {pitch, baseOctave} = qwertyMap[qwertyKey];
            const keyName = pitch + (currentOctave.current + baseOctave);
            onKeyUp(keyName);
            setPressedQwerty(prev => prev.filter(k => k !== e.key));
        };   
    }, [checkIsQwertyEnabled, currentOctave, onKeyUp]);

    useEffect(() => {
        window.addEventListener('keydown', handleQwertyDown);
        window.addEventListener('keyup', handleQwertyUp);

        return () => {
            window.removeEventListener('keydown', handleQwertyDown);
            window.removeEventListener('keyup', handleQwertyUp);
        };
    }, [handleQwertyDown, handleQwertyUp]);
};
