export const modes = [
    {
        index: 0,
        text: 'Swap',
        value: 'SWAP',
        modifiers: [],
    },
    {
        index: 1,
        text: 'Gravity',
        value: 'GRAVITY',
        modifiers: [
            {
                modName: 'STRENGTH',
                label: 'Strength',
                min: 1,
                value: 20,
                max: 50
            }
        ],
    }
];
