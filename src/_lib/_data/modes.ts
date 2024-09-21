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
                label: 'Strength',
                min: 0,
                value: 20,
                max: 50
            }
        ],
    }
];
