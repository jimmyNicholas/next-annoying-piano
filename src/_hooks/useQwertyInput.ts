import { useCallback, useEffect, useRef, useState } from "react";
import { QwertyInputProps } from "@/_lib/_types/types";
import { qwertyMap } from "@/_lib/_data/qwertyMap";

export function useQwertyInput({octaveRange, keyHandlers}: QwertyInputProps) {
    const {onKeyDown, onKeyUp} = keyHandlers;
    const {octaveMin, octaveMax} = octaveRange;
    const currentOctave = useRef<number>(octaveRange.currentOctave);
    const isQwertyEnabled = useRef(false);
    const [pressedQwerty, setPressedQwerty] = useState<string[]>([]);

    // const toggleIsQwertyEnabled = () => {
    //     isQwertyEnabled.current = !isQwertyEnabled.current;
    // };

    // const checkIsQwertyEnabled = (): boolean => {
    //     return isQwertyEnabled.current;
    // };

    const getIsQwertyEnabled = useCallback(() => {
        return isQwertyEnabled.current;
    }, []);

    const setIsQwertyEnabled = useCallback((value: boolean) => {
        isQwertyEnabled.current = value;
    }, []);

    const handleQwertyDown = useCallback((e: KeyboardEvent) => {
        if (!isQwertyEnabled.current) { return };
        
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
        
    }, [currentOctave, octaveMin, octaveMax, pressedQwerty, onKeyDown]);

    const handleQwertyUp = useCallback((e: KeyboardEvent) => {
        if (!isQwertyEnabled.current) { return };
        
        const qwertyKey = e.key.toLowerCase();
        if (qwertyMap[qwertyKey]) {
            const {pitch, baseOctave} = qwertyMap[qwertyKey];
            const keyName = pitch + (currentOctave.current + baseOctave);
            onKeyUp(keyName);
            setPressedQwerty(prev => prev.filter(k => k !== e.key));
        };   
    }, [currentOctave, onKeyUp]);

    useEffect(() => {
        window.addEventListener('keydown', handleQwertyDown);
        window.addEventListener('keyup', handleQwertyUp);

        return () => {
            window.removeEventListener('keydown', handleQwertyDown);
            window.removeEventListener('keyup', handleQwertyUp);
        };
    }, [handleQwertyDown, handleQwertyUp]);

    return { getIsQwertyEnabled, setIsQwertyEnabled };
};
