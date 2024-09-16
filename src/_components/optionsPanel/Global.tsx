import {ResetIcon} from '@/_assets/icons' 

export default function Global({
    enableAudio,
    audioIsLoaded,
    onReset,
    } : {
    enableAudio: () => void;
    audioIsLoaded: boolean;
    onReset: () => void,
}) {

    return (
        <div className="border-2 border-black grid grid-cols-2">
            <button
                key={'enableAudio'}
                className={`${audioIsLoaded ? "bg-yellow-300" : "bg-slate-300"} m-2`}
                onClick={enableAudio}
            >
                Audio Enabled
            </button>
            <button
                key={'reset'}
                className="bg-rose-400 m-2 active:bg-rose-300 flex justify-center"
                onClick={onReset}
            >
                <ResetIcon className='p-2'/>
            </button>
        </div>
    );
}