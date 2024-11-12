import { Mode } from "@/_lib/_data/modes/Mode";
import { HertzModifiers, HertzTable } from "@/_lib/_types/types";

/**
 * SwapMode implements a pitch swapping mechanism where the pitch of the last released
 * key is swapped with the previous key's pitch.
 * 
 * @example
 * const swapMode = new SwapMode();
 * // When applied, it will swap the pitches between the last two played keys
 * swapMode.modify(hertzModifiers, hertzTable);
 * 
 * @class SwapMode
 * @extends {Mode}
 * @category Mode
 */

export class SwapMode extends Mode {
    /**
     * Creates an instance of SwapMode.
     * Initializes the mode with its name, display name, and description.
     */
    constructor() {
        super(
            'SWAP',
            'Swap',
            'Swaps pitch of the last released key with the previous key.',
            []
        );
    };

    /**
     * Modifies the hertz table by swapping the frequencies of the last two played keys.
     * If the last key and current key are the same, no modification occurs.
     * 
     * @param {HertzModifiers} hertzModifiers - Object containing lastKey and currentKey
     * @param {HertzTable} hertzTable - Table of key-to-frequency mappings to modify
     * @returns {void}
    */
    modify(hertzModifiers: HertzModifiers, hertzTable: HertzTable): void {
        const { lastKey, currentKey } = hertzModifiers;
        if (lastKey === currentKey) return;
        
        const lastHertz = hertzTable[lastKey];
        const currentHertz = hertzTable[currentKey];
        hertzTable[lastKey] = currentHertz;
        hertzTable[currentKey] = lastHertz;
    };
};
