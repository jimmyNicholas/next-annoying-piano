import { Mode } from "@/_lib/_types/types";
import { GravityMode } from "@/_utils/modes/gravity";
import { SwapMode } from "@/_utils/modes/swap";

export const modes: Mode[] = [
    new GravityMode(),
    new SwapMode()
];
