import { HertzModifiers, HertzTable, ModeModifiers } from '@/_lib/_types/types';

export abstract class Mode {
    readonly name: string;
    readonly description: string;
    readonly modifiers: ModeModifiers[];

    constructor(
        name: string,
        description: string,
        modifiers: ModeModifiers[]
    ) {
        this.name = name;
        this.description = description;
        this.modifiers = modifiers;
    }

    abstract modify(hertzModifiers: HertzModifiers, hertzTable: HertzTable): void;
};