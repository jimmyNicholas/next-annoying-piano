import {ResetIcon} from '@/_assets/icons' 
import { GlobalProps } from '@/_lib/_types/types';

const Global: React.FC<GlobalProps> = ({
    onReset   
}) => {
    return (
        <div className="border-2 border-black grid">
            <button
                key={'reset'}
                className="bg-rose-400 p-2 aspect-square active:bg-rose-300"
                onClick={onReset}
            >
                <ResetIcon className='p-2'/>
            </button>
        </div>
    );
}

export default Global;
