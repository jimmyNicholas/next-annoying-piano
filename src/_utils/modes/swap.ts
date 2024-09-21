import { HertzModifyers, HertzTable } from "@/_lib/_types/types";

const swapHertz = (hertzModifiers: HertzModifyers, hertzTable: HertzTable): void => {
    const { lastKey, currentKey } = hertzModifiers;

    const lastHertz = hertzTable[lastKey];
    const currentHertz = hertzTable[currentKey];
    hertzTable[lastKey] = currentHertz;
    hertzTable[currentKey] = lastHertz;
};

export default swapHertz;
