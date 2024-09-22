import gravity from "./gravity";
import swapHertz from "./swap";
import { ModeSelect } from "@/_lib/_types/types";

const getMode = ({
    mode, 
    hertzModifiers,
    hertzTable
}: ModeSelect): void => {

    switch (mode) {
        case 'SWAP':
            swapHertz(hertzModifiers, hertzTable);
            break;
        case 'GRAVITY':
            gravity(hertzModifiers, hertzTable);
            break;
        default:
            break;
    }
};

export default getMode;
