export default function Global({
    onReset,
    } : {
    onReset: () => void,
}) {
    return (
        <div className="border-2 border-black grid">
            Global
            <button
                className="bg-rose-400 m-2 active:bg-rose-300"
                onClick={onReset}
            >
                Reset
            </button>
        </div>
    );
}