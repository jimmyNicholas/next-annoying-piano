import {ResetIcon} from '@/_assets/icons' 
import { GlobalProps } from '@/_lib/_types/types';

const Global: React.FC<GlobalProps> = ({
    //onReset   
}) => {
    return (
        <div className="flex p-2">
            <button
                key={'reset'}
                className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg px-6 transition-colors shadow-md items-center"
                //onClick={onReset}
            >
                <ResetIcon className='w-10 h-10'/>
            </button>
        </div>
    );
}

export default Global;
