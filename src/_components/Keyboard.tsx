import { KeyboardProps } from '@/_lib/_types/types';
import React, { useCallback, useRef } from 'react';

const Keyboard: React.FC<KeyboardProps> = ({
    keys,
    keyHandlers
}) => {
    const {onKeyDown, onKeyUp} = keyHandlers;
    const activeKeyRef = useRef<string | null>(null);
    
    const handleOnKeyDown = useCallback((keyName: string) => {
        activeKeyRef.current = keyName;
        onKeyDown(keyName);  
    }, [onKeyDown]);

    const handleOnKeyUp = useCallback((keyName: string) => {
        if (activeKeyRef.current === keyName) {
            onKeyUp(keyName); 
        }
        activeKeyRef.current = null;
    }, [onKeyUp]);

    const handlePointerLeave = useCallback(() => {
        if (activeKeyRef.current) {
          onKeyUp(activeKeyRef.current);
          activeKeyRef.current = null;
        }
      }, [onKeyUp]);

    return (
        <div className='grid content-center h-full bg-[url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/187/vwood.png)]'>
            <div 
                className="
                    relative 
                    flex 
                    h-[9.4375em] 
                    w-auto 
                    mx-auto 
                    my-10 
                    p-6 
                    border 
                    border-[#160801] 
                    rounded-lg 
                    bg-gradient-to-br from-black/30 to-black/0 
                    bg-pink-600 
                    shadow-[inset_0_0_50px_rgba(0,0,0,0.5),inset_0_1px_rgba(212,152,125,0.2),0_5px_15px_rgba(0,0,0,0.5)] box-border">
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
                                    onPointerDown={() => handleOnKeyDown(key.name)}
                                    onPointerUp={() => handleOnKeyUp(key.name)}
                                    onPointerLeave={handlePointerLeave}
                                    onPointerCancel={() => handleOnKeyUp(key.name)}
                                    className=' 
                                        relative 
                                        float-left 
                                        h-16 
                                        w-4 
                                        z-20 
                                        -ml-[0.7em] 
                                        border 
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
                                    onPointerDown={() => handleOnKeyDown(key.name)}
                                    onPointerUp={() => handleOnKeyUp(key.name)}
                                    onPointerLeave={handlePointerLeave}
                                    onPointerCancel={() => handleOnKeyUp(key.name)}
                                    className={`    
                                        relative 
                                        float-left 
                                        h-32 
                                        w-8 
                                        z-10 
                                        ${whiteKeyMargin} 
                                        border-l 
                                        border-b 
                                        border-gray-400 
                                        rounded-b-[5px] 
                                        shadow-[inset_-1px_0_0_rgba(255,255,255,0.8),inset_0_0_5px_#ccc,inset_0_0_3px_rgba(0,0,0,0.2)] 
                                        bg-gradient-to-b from-[#eee] to-white 
                                        active:border-t 
                                        active:border-l 
                                        active:border-b 
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

export default Keyboard;