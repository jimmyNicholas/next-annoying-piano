import { HertzModifiers, HertzTable } from "@/_lib/_types/types";
import { Mode } from "@/_lib/_data/modes/Mode";

export class GravityMode extends Mode {
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

    modify(hertzModifiers: HertzModifiers, hertzTable: HertzTable): void {
        const { lastKey, currentKey } = hertzModifiers;
        if (lastKey === currentKey) return;
        const lastHertz = hertzTable[lastKey];
        const currentHertz = hertzTable[currentKey];
        const strength = this.modifiers.find((mod) => {return mod.id === 'STRENGTH'});
        if (!strength) return;
        const newHertz = Math.round(lastHertz - ((lastHertz - currentHertz) / (strength.max - strength.value)));
        hertzTable[lastKey] = newHertz;  
    }
};
