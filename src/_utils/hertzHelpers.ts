
function calculateHertz(baseHertz: number, interval: number) {
    if (interval === 0) {
        return baseHertz;
    }
    const ratio = Math.pow(2, 1 / 12);
    return Math.round(baseHertz * Math.pow(ratio, interval));
}
