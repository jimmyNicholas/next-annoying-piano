import { Key } from '@/_lib/_types/types'

export default function Keyboard({
    keys,
}: {
    keys: Key[];
}) {

    return (
        <div>
            Keyboard
            <div className="relative flex h-[9.4375em] w-auto mx-auto my-[2.5em] p-[1.5em] border border-[#160801] rounded-[0.5em] bg-gradient-to-br from-black/30 to-black/0 bg-[url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/187/vwood.png')] shadow-[inset_0_0_50px_rgba(0,0,0,0.5),inset_0_1px_rgba(212,152,125,0.2),0_5px_15px_rgba(0,0,0,0.5)] box-border">
                {keys.map((key) => {
                    return (
                        <>
                            {key.pitch[1] === '#' ? 
                                <div className='relative float-left h-[4em] w-[1em] z-[1] -ml-[0.7em] border-[1px] border-black rounded-b-[3px] shadow-[inset_-1px_-1px_2px_rgba(255,255,255,0.2),inset_0_-5px_2px_3px_rgba(0,0,0,0.6),0_2px_4px_rgba(0,0,0,0.5)] bg-gradient-to-br from-[#222] to-[#555]'>
                                </div> 
                                : <div className='whiteKey relative float-left h-[8em] w-[2em] z-[0.5] border-l-[1px] border-b-[1px] border-[#bbb] rounded-b-[5px] shadow-[inset_-1px_0_0_rgba(255,255,255,0.8),inset_0_0_5px_#ccc,inset_0_0_3px_rgba(0,0,0,0.2)] bg-gradient-to-b from-[#eee] to-white'>
                                </div>}
                        </>
                    )
                })}
            </div>
        </div>
    );
};
