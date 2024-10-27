import { Mode } from "@/_lib/_types/types";
import { GravityMode } from "./gravity";
import { SwapMode } from "./swap";

export const modes: Mode[] = [
    new SwapMode(),
    new GravityMode()
];
