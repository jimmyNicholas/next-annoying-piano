import { useState, useRef } from "react";
import { Key, HertzTable, KeyboardRange, AudioModule, Mode } from "@/_lib/_types/types";
import { getKeys } from "@/_utils/keys/keyboardSetup";
import { getHertzTable } from "@/_utils/hertzHelpers";
import getMode from "@/_utils/modes/getMode";

const useKeyboard = (
    keyboardRange: KeyboardRange,
    audioIsLoaded: boolean,
    audioService: AudioModule | null,
    mode: Mode,
) => {
    const [keys] = useState<Key[]>( getKeys( keyboardRange) );
    const hertzTable = useRef<HertzTable>(getHertzTable( keyboardRange ));
    const lastReleased = useRef<string | null>(null);

    function resetHertzTable() { hertzTable.current = getHertzTable(keyboardRange)};

    function onKeyDown(keyName: string){
        if (!audioIsLoaded || !audioService) { return };
        const hertz = hertzTable.current[keyName];
        audioService.playHertz(keyName, hertz);
    };

    function onKeyUp(keyName: string) {
        if (!audioIsLoaded || !audioService) { return };
        audioService.stopHertz(keyName);
        if (!lastReleased.current) {
            lastReleased.current = keyName;
        } else if (lastReleased.current !== keyName){
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
    }

    return { keys, resetHertzTable, keyHandlers: {onKeyDown, onKeyUp}};
};

export default useKeyboard;