import { HertzModifiers, HertzTable } from "@/_lib/_types/types";

const gravity = (hertzModifiers: HertzModifiers, hertzTable: HertzTable): void => {
    const { lastKey, currentKey, modifiers } = hertzModifiers;
    if (!modifiers) return;

    const lastHertz = hertzTable[lastKey];
    const currentHertz = hertzTable[currentKey];
    const strength = modifiers.find((mod) => {return mod.modName === 'STRENGTH'});
    if (!strength) return;
    const newHertz = Math.round(lastHertz - ((lastHertz - currentHertz) / (strength.max - strength.value)));
    hertzTable[lastKey] = newHertz;    
};

export default gravity;
