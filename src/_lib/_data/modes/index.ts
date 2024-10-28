import { Mode } from "@/_lib/_types/types";
import { SwapMode } from "./swap";
import { GravityMode } from "./gravity";
import { MoveMode } from "./move";

export const modes: Mode[] = [
    new SwapMode(),
    new GravityMode(),
    new MoveMode()
];
