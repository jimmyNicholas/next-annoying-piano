import { HertzModifiers, HertzTable, ModeModifiers } from '@/_lib/_types/types';

export abstract class Mode {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly modifiers: ModeModifiers[];

    constructor(
        id: string,
        name: string,
        description: string,
        modifiers: ModeModifiers[]
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.modifiers = modifiers;
    }

    abstract modify(hertzModifiers: HertzModifiers, hertzTable: HertzTable): void;
};