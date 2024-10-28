import { HertzModifiers, HertzTable } from "@/_lib/_types/types";
import { Mode } from "@/_lib/_data/modes/Mode";
import { calculateHertz } from "@/_utils/hertzHelpers";

export class MoveMode extends Mode {
    constructor() {
        super(
            'MOVE',
            'Move',
            'Last released key moves up or down a set interval.',
            [
                {
                    id: 'INTERVAL',
                    name: 'Interval',
                    min: -2,
                    value: 1,
                    max: 2,
                    step: 1
                }
            ]
        )
    }

    modify(hertzModifiers: HertzModifiers, hertzTable: HertzTable): void {
        const { currentKey } = hertzModifiers;
        const lastHertz = hertzTable[currentKey];
        const interval = this.modifiers.find((mod) => {return mod.id === 'INTERVAL'});
        if (!interval) return;
        const newHertz = calculateHertz(lastHertz, interval.value);
        hertzTable[currentKey] = newHertz;  
    }
};
