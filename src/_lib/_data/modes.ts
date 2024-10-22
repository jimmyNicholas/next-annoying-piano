export const modes = [
    {
        index: 0,
        text: 'Swap',
        value: 'SWAP',
        description: "Swaps pitch of the last released key with the previous key.",
        modifiers: []
    },
    {
        index: 1,
        text: 'Gravity',
        value: 'GRAVITY',
        description: "The last released key pulls the pitch of the previous key toward it",
        modifiers: [
            {
                modName: 'STRENGTH',
                label: 'Strength',
                min: 1,
                value: 2,
                max: 10,
                step: 0.1
            }
        ]
    }
];
