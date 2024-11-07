import { KeyboardProps } from '@/_lib/_types/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const Keyboard: React.FC<KeyboardProps> = ({
    keys,
    keyEmitter,
    keyHandlers
}) => {
    const {onKeyDown, onKeyUp} = keyHandlers;
    const activeKeyRef = useRef<string | null>(null);
    const [activeKeys, setActiveKeys] = useState<string[]>([]);

    const addActiveKey = useCallback((keyName: string) => {
        setActiveKeys((prev) => {
            if (prev.includes(keyName)) return prev;
            return [...prev, keyName];
        });
    }, [setActiveKeys]);

    const removeActiveKey = useCallback((keyName: string) => {
        setActiveKeys((prev) => prev.filter(key => key !== keyName));
    }, [setActiveKeys]);

    useEffect(() => {
        if (!keyEmitter) return;
        keyEmitter.on('keyDown', ({keyName}:{keyName: string}) => {
            addActiveKey(keyName);            
        }); 
        keyEmitter.on('keyUp', ({keyName}:{keyName: string}) => {
            removeActiveKey(keyName);  
        }); 
    }, [keyEmitter, addActiveKey, removeActiveKey]);
    
    const handleOnKeyDown = useCallback((keyName: string) => {
        activeKeyRef.current = keyName;
        onKeyDown(keyName);
        addActiveKey(keyName);
    }, [onKeyDown, addActiveKey]);

    const handleOnKeyUp = useCallback((keyName: string) => {
        if (activeKeyRef.current === keyName) {
            onKeyUp(keyName); 
        }
        activeKeyRef.current = null;
        removeActiveKey(keyName);
    }, [onKeyUp, removeActiveKey]);

    const handlePointerLeave = useCallback(() => {
        if (activeKeyRef.current) {
          onKeyUp(activeKeyRef.current);
          removeActiveKey(activeKeyRef.current);
          activeKeyRef.current = null;
        }
    }, [onKeyUp, removeActiveKey]);
    
    return (
        <div 
            className='grid h-full bg-[url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/187/vwood.png)]'
        >
            { [keys.slice(keys.length / 2), keys.slice(0, keys.length / 2)].map((keyArray, index) => (
                <div 
                    className='grid align-center justify-stretch'
                    key={index}
                >
                    <div 
                        className="
                            relative 
                            flex 
                            h-[9.4375em]
                            w-auto
                            mx-auto 
                            my-auto 
                            p-6 
                            border 
                            border-[#160801] 
                            rounded-lg 
                            bg-gradient-to-br from-black/30 to-black/0 
                            bg-pink-600 
                            shadow-[inset_0_0_50px_rgba(0,0,0,0.5),inset_0_1px_rgba(212,152,125,0.2),0_5px_15px_rgba(0,0,0,0.5)] box-border
                            sm:max-lg:scale-x-75 lg:scale-100 2xl:scale-150"
                    >
                        {keyArray.map((key) => {
                            let whiteKeyMargin = '-ml-[0.5em]';
                            if (key.pitch === 'C' || key.pitch === 'F') {
                                whiteKeyMargin = '';
                            }

                            const isActive = activeKeys.includes(key.name);

                            return (
                                <React.Fragment key={key.name}> 
                                    {key.pitch[1] === '#' ? 
                                        //black key
                                        <button
                                            onPointerDown={() => handleOnKeyDown(key.name)}
                                            onPointerUp={() => handleOnKeyUp(key.name)}
                                            onPointerLeave={handlePointerLeave}
                                            onPointerCancel={() => handleOnKeyUp(key.name)}
                                            className={` 
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
                                                ${isActive ?   
                                                    'active:shadow-[inset_-1px_-1px_2px_rgba(255,255,255,0.2),inset_0_-2px_2px_3px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(0,0,0,0.5)] active:bg-gradient-to-r from-[#444] to-[#222]'
                                                    : ''    
                                                }`}
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
                                                ${isActive ?   
                                                    'border-t border-l border-b border-[#999] shadow-[inset_2px_0_3px_rgba(0,0,0,0.1),inset_-5px_5px_20px_rgba(0,0,0,0.2),inset_0_0_3px_rgba(0,0,0,0.2)] bg-gradient-to-b from-white to-[#e9e9e9]'
                                                    : ''    
                                                }`}>
                                        </button>}
                                </React.Fragment> 
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Keyboard;