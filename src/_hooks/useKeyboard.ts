import { useRef, useCallback } from "react";
import { Key, HertzTable, KeyboardRange, HertzPlayback, Mode } from "@/_lib/_types/types";
import { getKeys } from "@/_utils/keys/keyboardSetup";
import { getHertzTable } from "@/_utils/hertzHelpers";

const useKeyboard = (
    keyboardRange: KeyboardRange,
    hertzPlayback: HertzPlayback | null,
    getMode: () => Mode,
) => {
    const keys = useRef<Key[]>( getKeys( keyboardRange) );
    const hertzTable = useRef<HertzTable>(getHertzTable( keyboardRange ));
    const lastReleased = useRef<string | null>(null);

    function resetHertzTable() { hertzTable.current = getHertzTable(keyboardRange)};

    const onKeyDown = useCallback((keyName: string) => {
        if (!hertzPlayback) { return };
        const hertz = hertzTable.current[keyName];
        hertzPlayback.playHertz(keyName, hertz);
    }, [hertzPlayback]);


    const onKeyUp = useCallback((keyName: string) => {
        if (!hertzPlayback) { return };
        hertzPlayback.stopHertz(keyName);
        if (!lastReleased.current) {
            lastReleased.current = keyName;
        } 
        const mode = getMode();
        const hertzModifiers = {
            lastKey: lastReleased.current,
            currentKey: keyName,
        };
        mode.modify(hertzModifiers, hertzTable.current);
        lastReleased.current = keyName;
        
    }, [hertzPlayback, getMode]);

    return { keys: keys.current, resetHertzTable, keyHandlers: {onKeyDown, onKeyUp}};
};

export default useKeyboard;
