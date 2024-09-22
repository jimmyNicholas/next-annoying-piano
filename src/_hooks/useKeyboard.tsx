import { useState, useRef } from "react";
import { Key, HertzTable } from "@/_lib/_types/types";
import { getKeys } from "@/_utils/keys/keyboardSetup";
import { getHertzTable } from "@/_utils/hertzHelpers";

function useKeyboard() {
    const keyboardRange = {startPitch: 'C', startOctave: 2, endPitch: 'B', endOctave: 4};
    const [keys] = useState<Key[]>( getKeys( keyboardRange) );
    const hertzTable = useRef<HertzTable>(getHertzTable( keyboardRange ));
    const lastReleased = useRef<string | null>(null);

    function resetHertzTable() { hertzTable.current = getHertzTable(keyboardRange)};

    return { keys, resetHertzTable, };
};

export default useKeyboard;