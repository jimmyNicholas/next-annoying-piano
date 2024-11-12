import { HertzModifiers, HertzTable } from "@/_lib/_types/types";
import { Mode } from "@/_lib/_data/modes/Mode";

/**
 * GravityMode implements a pitch altering mechanism where the previous pitch released is 
 * pulled closer toward the last key released depending on the strength modifier.
 * 
 * @example
 * const gravityMode = new GravityMode();
 * // When applied, it will pull the pitch based on strength
 * gravityMode.modify(hertzModifiers, hertzTable);
 * 
 * @class GravityMode
 * @extends {Mode}
 * @category Mode
 */

export class GravityMode extends Mode {
    /**
     * Creates an instance of GravityMode.
     * Initializes the mode with its name, display name, and description.
     * 
     * The strength modifier determines how strongly the pitch is pulled.
     * It represents a fractional distance between the two pitches which is subtracted 
     * from the max at modification to ensure that a higher value leads to a larger pull.
     * - Min: 1 (weakest pull)
     * - Default: 2
     * - Max: 10 (strongest pull)
     */
    constructor() {
        super(
            'GRAVITY',
            'Gravity',
            'Pulls the pitch of the previous key toward it the last released key.',
            [
                {
                    id: 'STRENGTH',
                    name: 'Strength',
                    min: 1,
                    value: 2,
                    max: 10,
                    step: 0.1
                }
            ]
        )
    }

    /**
     * Modifies the hertz table by pulling the frequency of the last key
     * toward the current key's frequency based on the strength modifier.
     * If the last key and current key are the same, no modification occurs.
     *
     * The formula used is:
     * newHertz = lastHertz - ((lastHertz - currentHertz) / (maxStrength - currentStrength))
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

        const strength = this.modifiers.find((mod) => {return mod.id === 'STRENGTH'});
        if (!strength) return;
        
        const newHertz = lastHertz - ((lastHertz - currentHertz) / (strength.max - strength.value));
        hertzTable[lastKey] = newHertz;  
    }
};
