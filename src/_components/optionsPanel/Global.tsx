import {ResetIcon} from '@/_assets/icons' 
import { GlobalProps } from '@/_lib/_types/types';

const Global: React.FC<GlobalProps> = ({
    onReset   
}) => {
    return (
        <div className="border-2 border-black grid grid-cols-2">
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

export default Global;
