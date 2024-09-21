import { HertzModifiers, HertzTable } from "@/_lib/_types/types";

const gravity = (hertzModifiers: HertzModifiers, hertzTable: HertzTable): void => {
    const { lastKey, currentKey } = hertzModifiers;
    
    const lastHertz = hertzTable[lastKey];
    const currentHertz = hertzTable[currentKey];
    const newHertz = Math.round(lastHertz - ((lastHertz - currentHertz) / 20));
    hertzTable[lastKey] = newHertz;
};

export default gravity;
