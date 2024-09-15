import swapHertz from "./swap";
import { HertzTable } from "@/_lib/_types/types";

export default function getMode(mode: string, lastKey: string, currentKey: string, hertzTable: HertzTable) {
    switch (mode) {
        case 'SWAP':
            swapHertz(lastKey, currentKey, hertzTable);
            break;
        case 'GRAVITY':
            console.log('gravity function');
            
            break;
        default:
            break;
    }
}
