import { useState, useRef, useCallback } from "react";
import { Key, HertzTable, KeyboardRange, HertzPlayback, Mode } from "@/_lib/_types/types";
import { getKeys } from "@/_utils/keys/keyboardSetup";
import { getHertzTable } from "@/_utils/hertzHelpers";
import getMode from "@/_utils/modes/getMode";

const useKeyboard = (
    keyboardRange: KeyboardRange,
    hertzPlayback: HertzPlayback | null,
    getModeState: () => Mode,
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
        } else if (lastReleased.current !== keyName){
            const mode = getModeState();
            const modeSelect = {
                mode: mode.value,
                hertzModifiers: {
                    lastKey: lastReleased.current,
                    currentKey: keyName,
                    modifiers: mode.modifiers
                },
                hertzTable: hertzTable.current
            };
            getMode(modeSelect);
            lastReleased.current = keyName;
        }
    }, [hertzPlayback, getModeState]);

    return { keys: keys.current, resetHertzTable, keyHandlers: {onKeyDown, onKeyUp}};
};

export default useKeyboard;