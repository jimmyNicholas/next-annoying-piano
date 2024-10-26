import { Mode } from "@/_lib/_data/modes/Mode";
import { HertzModifiers, HertzTable } from "@/_lib/_types/types";

export class SwapMode extends Mode {
    constructor() {
        super(
            'Swap',
            'Swaps pitch of the last released key with the previous key.',
            []
        );
    };

    modify(hertzModifiers: HertzModifiers, hertzTable: HertzTable): void {
        const { lastKey, currentKey } = hertzModifiers;
        const lastHertz = hertzTable[lastKey];
        const currentHertz = hertzTable[currentKey];
        hertzTable[lastKey] = currentHertz;
        hertzTable[currentKey] = lastHertz;
    };
};
