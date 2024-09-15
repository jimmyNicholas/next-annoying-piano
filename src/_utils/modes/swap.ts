import { HertzTable } from "@/_lib/_types/types";

export default function swapHertz(lastKey: string, currentKey: string, hertzTable: HertzTable) {
    const lastHertz = hertzTable[lastKey];
    const currentHertz = hertzTable[currentKey];
    hertzTable[lastKey] = currentHertz;
    hertzTable[currentKey] = lastHertz;
};
