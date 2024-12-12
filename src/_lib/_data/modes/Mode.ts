import { HertzModifiers, HertzTable, ModeModifiers } from '@/_lib/_types/types';

/**
 * Abstract base class representing a music mode modifier
 * Modes can modify frequency tables and apply various musical transformations
 * 
 * @abstract
 * @class Mode
 */
export abstract class Mode {
    /** Unique identifier for the mode */
    readonly id: string;
    
    /** Display name of the mode */
    readonly name: string;
    
    /** Detailed description of what the mode does */
    readonly description: string;

    /** Array of modifier configurations that affect how the mode transforms frequencies */
    readonly modifiers: ModeModifiers[];

    /**
     * Creates a new Mode instance
     * 
     * @constructor
     * @param {string} id - Unique identifier for the mode
     * @param {string} name - Display name of the mode
     * @param {string} description - Detailed description of the mode's behavior
     * @param {ModeModifiers[]} modifiers - Array of modifier configurations
     */
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

    /**
     * Applies the mode's modifications to a frequency table
     * Must be implemented by concrete mode classes
     * 
     * @abstract
     * @param {HertzModifiers} hertzModifiers - Current frequency modifiers
     * @param {HertzTable} hertzTable - Frequency lookup table to be modified
     * @returns {void}
     */
    abstract modify(hertzModifiers: HertzModifiers, hertzTable: HertzTable): void;
};
