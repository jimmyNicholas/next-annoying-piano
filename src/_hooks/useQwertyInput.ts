import { useCallback, useEffect, useRef, useState } from "react";
import { QwertyInputProps } from "@/_lib/_types/types";
import { qwertyMap } from "@/_lib/_data/qwertyMap";

export function useQwertyInput({octaveRange, keyHandlers}: QwertyInputProps) {
    const {onKeyDown, onKeyUp} = keyHandlers;
    const {octaveMin, octaveMax} = octaveRange;
    const currentOctave = useRef<number>(octaveRange.currentOctave);
    const [isQwertyEnabled, setIsQwertyEnabled] = useState<boolean>(false);
    const pressedQwerty = useRef<string[]>([]);

    const toggleIsQwertyEnabled = useCallback(() => {
        setIsQwertyEnabled(prev => !prev);
    }, []);

    const handleQwertyDown = useCallback((e: KeyboardEvent) => {
        if (!isQwertyEnabled) { return };
        
        const qwertyKey = e.key.toLowerCase();
        if (qwertyKey === 'z' && currentOctave.current > octaveMin) {
            currentOctave.current--;
            return; 
        };
        if (qwertyKey === 'x' && currentOctave.current < octaveMax) {
            currentOctave.current++;
            return;
        };

        if (qwertyMap[qwertyKey] && !pressedQwerty.current.includes(qwertyKey)) {
            const {pitch, baseOctave} = qwertyMap[qwertyKey];
            const keyName = pitch + (currentOctave.current + baseOctave);
            onKeyDown(keyName);
            pressedQwerty.current.push(qwertyKey);
        };      
        
    }, [isQwertyEnabled, octaveMin, octaveMax, onKeyDown]);

    const handleQwertyUp = useCallback((e: KeyboardEvent) => {
        if (!isQwertyEnabled) { return };
        
        const qwertyKey = e.key.toLowerCase();
        if (qwertyMap[qwertyKey]) {
            const {pitch, baseOctave} = qwertyMap[qwertyKey];
            const keyName = pitch + (currentOctave.current + baseOctave);
            onKeyUp(keyName);
            pressedQwerty.current = pressedQwerty.current.filter(
                pressedKey => pressedKey !== qwertyKey
            );
        };   
    }, [isQwertyEnabled, onKeyUp]);

    useEffect(() => {
        window.addEventListener('keydown', handleQwertyDown);
        window.addEventListener('keyup', handleQwertyUp);

        return () => {
            window.removeEventListener('keydown', handleQwertyDown);
            window.removeEventListener('keyup', handleQwertyUp);
        };
    }, [handleQwertyDown, handleQwertyUp]);

    return { isQwertyEnabled, toggleIsQwertyEnabled };
};
