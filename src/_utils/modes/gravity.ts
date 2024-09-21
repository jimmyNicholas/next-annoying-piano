import { HertzModifyers, HertzTable } from "@/_lib/_types/types";

const gravity = (hertzModifiers: HertzModifyers, hertzTable: HertzTable): void => {
    const { lastKey, currentKey, modifyerOne } = hertzModifiers;
    
    const lastHertz = hertzTable[lastKey];
    const currentHertz = hertzTable[currentKey];
    const newHertz = Math.round(lastHertz - ((lastHertz - currentHertz) / modifyerOne));
    hertzTable[lastKey] = newHertz;
};

export default gravity;
