import { HertzModifiers, HertzTable } from "@/_lib/_types/types";
import { Mode } from "@/_lib/_data/modes/Mode";
import { calculateHertz } from "@/_utils/hertzHelpers";

/**
 * MoveMode implements a pitch shifting mechanism where the last released key's
 * frequency is shifted up or down by a specified number of semitones.
 *
 * @example
 * const moveMode = new MoveMode();
 * // When applied, it will shift the pitch by the specified number of semitones.
 * moveMode.modify(hertzModifiers, hertzTable);
 *
 * @class MoveMode
 * @extends {Mode}
 * @category Mode
 */
export class MoveMode extends Mode {
    /**
     * Creates an instance of MoveMode.
     * Initializes the mode with its name, display name, and description.
     *
     * The interval modifier determines the direction and magnitude of the pitch shift:
     * - Min: -2 (shift down by 2 semitones)
     * - Default: 1 (shift up by 1 semitone)
     * - Max: 2 (shift up by 2 semitones)
     * 
     * Negative values shift the pitch down, positive values shift up.
     */
    constructor() {
        super(
            'MOVE',
            'Move',
            'Last released key moves up or down a specified number of semitones..',
            [
                {
                    id: 'SEMITONES',
                    name: 'semitones',
                    min: -2,
                    value: 1,
                    max: 2,
                    step: 1
                }
            ]
        );
    }

    /**
     * Modifies the hertz table by shifting the frequency of the current key
     * up or down based on the semitones modifier.
     *
     * Uses the calculateHertz utility function to compute the new frequency
     * based on the semitones value. Positive intervals shift up, negative shift down.
     *
     * @param {HertzModifiers} hertzModifiers - Object containing currentKey
     * @param {HertzTable} hertzTable - Table of key-to-frequency mappings to modify
     * @returns {void}
     */
    modify(hertzModifiers: HertzModifiers, hertzTable: HertzTable): void {
        const { currentKey } = hertzModifiers;
        const lastHertz = hertzTable[currentKey];
        
        const interval = this.modifiers.find((mod) => mod.id === 'SEMITONES');
        if (!interval) return;

        const newHertz = calculateHertz(lastHertz, interval.value);
        hertzTable[currentKey] = newHertz;
    }
}
