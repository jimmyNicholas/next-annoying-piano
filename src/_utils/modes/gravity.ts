import { HertzModifiers, HertzTable } from "@/_lib/_types/types";

const gravity = (hertzModifiers: HertzModifiers, hertzTable: HertzTable): void => {
    const { lastKey, currentKey, modifiers } = hertzModifiers;
    if (!modifiers) return;

    const lastHertz = hertzTable[lastKey];
    const currentHertz = hertzTable[currentKey];
    const strength = modifiers[0];
    const newHertz = Math.round(lastHertz - ((lastHertz - currentHertz) / strength));
    hertzTable[lastKey] = newHertz;
};

export default gravity;
