import { HertzModifiers, HertzTable } from "@/_lib/_types/types";

const modifySwap = (hertzModifiers: HertzModifiers, hertzTable: HertzTable): void => {
    const { lastKey, currentKey } = hertzModifiers;

    const lastHertz = hertzTable[lastKey];
    const currentHertz = hertzTable[currentKey];
    hertzTable[lastKey] = currentHertz;
    hertzTable[currentKey] = lastHertz;
};

const swapMode = {
    name: 'Swap',
    description: "Swaps pitch of the last released key with the previous key.",
    modify: modifySwap,
    modifiers: []
};

export default swapMode;
