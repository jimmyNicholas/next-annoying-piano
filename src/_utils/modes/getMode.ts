import gravity from "./gravity";
import swapHertz from "./swap";
import { ModeSelect } from "@/_lib/_types/types";

const getMode = ({
    mode, 
    hertzModifyers,
    hertzTable
}: ModeSelect): void => {

    switch (mode) {
        case 'SWAP':
            swapHertz(hertzModifyers, hertzTable);
            break;
        case 'GRAVITY':
            gravity(hertzModifyers, hertzTable);
            break;
        default:
            break;
    }
};

export default getMode;
