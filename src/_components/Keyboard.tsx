import { Key } from '@/_lib/_types/types'
import React from 'react';

export default function Keyboard({
    keys,
}: {
    keys: Key[];
}) {

    return (
        <div className='grid content-center h-full'>
            <div className="relative flex h-[9.4375em] w-auto mx-auto my-[2.5em] p-[1.5em] border border-[#160801] rounded-[0.5em] bg-gradient-to-br from-black/30 to-black/0 bg-pink-600 shadow-[inset_0_0_50px_rgba(0,0,0,0.5),inset_0_1px_rgba(212,152,125,0.2),0_5px_15px_rgba(0,0,0,0.5)] box-border">
                {keys.map((key) => {
                    let whiteKeyMargin = '-ml-[0.5em]';
                    if (key.pitch === 'C' || key.pitch === 'F') {
                        whiteKeyMargin = '';
                    }
                    return (
                        <React.Fragment key={key.name}> 
                            {key.pitch[1] === '#' ? 
                                //black key
                                <button
                                    className=' 
                                        relative 
                                        float-left 
                                        h-[4em] 
                                        w-[1em] 
                                        z-[1] 
                                        -ml-[0.7em] 
                                        border-[1px] 
                                        border-black 
                                        rounded-b-[3px] 
                                        shadow-[inset_-1px_-1px_2px_rgba(255,255,255,0.2),inset_0_-5px_2px_3px_rgba(0,0,0,0.6),0_2px_4px_rgba(0,0,0,0.5)] 
                                        bg-gradient-to-br from-[#222] to-[#555]  
                                        active:shadow-[inset_-1px_-1px_2px_rgba(255,255,255,0.2),inset_0_-2px_2px_3px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(0,0,0,0.5)] 
                                        active:bg-gradient-to-r from-[#444] to-[#222]'
                                >
                                </button> 
                                : 
                                //white key
                                <button 
                                    key={key.name} 
                                    className={`    
                                        relative 
                                        float-left 
                                        h-[8em] 
                                        w-[2em] 
                                        z-[0.5] 
                                        ${whiteKeyMargin} 
                                        border-l-[1px] 
                                        border-b-[1px] 
                                        border-[#bbb] 
                                        rounded-b-[5px] 
                                        shadow-[inset_-1px_0_0_rgba(255,255,255,0.8),inset_0_0_5px_#ccc,inset_0_0_3px_rgba(0,0,0,0.2)] 
                                        bg-gradient-to-b 
                                        from-[#eee] to-white 
                                        active:border-t-[1px] 
                                        active:border-l-[1px] 
                                        active:border-b-[1px] 
                                        active:border-[#999] 
                                        active:shadow-[inset_2px_0_3px_rgba(0,0,0,0.1),inset_-5px_5px_20px_rgba(0,0,0,0.2),inset_0_0_3px_rgba(0,0,0,0.2)] 
                                        active:bg-gradient-to-b from-white to-[#e9e9e9]`}>
                                </button>}
                        </React.Fragment> 
                    )
                })}
            </div>
        </div>
    );
};
