import { OutputProps } from "@/_lib/_types/types";
import { useState } from "react";

const Outputs: React.FC<OutputProps> = ({
    effectsInterfaces
}) => {
    const {gainInterface, reverbInterface, vibratoInterface} = effectsInterfaces;
    
    const [reverb, setReverb] = useState({
        decay: reverbInterface?.get()?.decay ?? 0,
        preDelay: reverbInterface.get()?.preDelay ?? 0,
        wet: reverbInterface.get()?.wet ?? 0
    });
    
    const [vibrato, setVibrato] = useState({
        frequency: vibratoInterface?.get()?.frequency ?? 0,
        depth: vibratoInterface.get()?.depth ?? 0,
        wet: vibratoInterface.get()?.wet ?? 0
    });
    
    const [gain, setGain] = useState<number>( gainInterface.get()?.gain ?? 0 );

    return (
        <div className="border-2 border-black">
            {reverbInterface.name}
            <div key={'reverbDecay'} className="grid grid-cols-[25%_65%_10%]">
                Decay:
                <input 
                    type="range"
                    className="w-full"
                    value={reverb.decay}
                    min={0}
                    max={100}
                    onChange={(e) => {
                        reverbInterface.set('decay',  Number(e.target.value))
                        setReverb({...reverb, decay: Number(e.target.value)});
                    }}                        
                />
                {reverbInterface.get()?.decay}
            </div>
            <div key={'reverbPreDelay'} className="grid grid-cols-[25%_65%_10%]">
                preDelay:
                <input 
                    type="range"
                    className="w-full"
                    value={reverb.preDelay}
                    min={0}
                    max={100}
                    onChange={(e) => {
                        reverbInterface.set('preDelay',  Number(e.target.value))
                        setReverb({...reverb, preDelay: Number(e.target.value)});
                    }}                        
                />
                {reverbInterface.get()?.preDelay}
            </div>
            <div key={'reverbWet'} className="grid grid-cols-[25%_65%_10%]">
                Wet:
                <input 
                    type="range"
                    className="w-full"
                    value={reverb.wet}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(e) => {
                        reverbInterface.set('wet',  Number(e.target.value))
                        setReverb({...reverb, wet: Number(e.target.value)});
                    }}                        
                />
                {reverbInterface.get()?.wet}
            </div>
            {vibratoInterface.name}
            <div key={'vibratoFrequency'} className="grid grid-cols-[25%_65%_10%]">
                Frequency:
                <input 
                    type="range"
                    className="w-full"
                    value={vibrato.frequency}
                    min={0}
                    max={100}
                    onChange={(e) => {
                        vibratoInterface.set({frequency: Number(e.target.value)})
                        setVibrato({...vibrato, frequency: Number(e.target.value)});
                    }}                        
                />
                {vibratoInterface.get()?.frequency}
            </div>
            <div key={'vibratoDepth'} className="grid grid-cols-[25%_65%_10%]">
                Depth:
                <input 
                    type="range"
                    className="w-full"
                    value={vibrato.depth}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(e) => {
                        vibratoInterface.set({depth: Number(e.target.value)})
                        setVibrato({...vibrato, depth: Number(e.target.value)});
                    }}                        
                />
                {vibratoInterface.get()?.depth}
            </div>
            <div key={'vibratoWet'} className="grid grid-cols-[25%_65%_10%]">
                Wet:
                <input 
                    type="range"
                    className="w-full"
                    value={vibrato.wet}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(e) => {
                        vibratoInterface.set({wet: Number(e.target.value)})
                        setVibrato({...vibrato, wet: Number(e.target.value)});
                    }}                        
                />
                {vibratoInterface.get()?.wet}
            </div>
            {gainInterface.name}
            <div key={gainInterface.name} className="grid grid-cols-[25%_65%_10%]">
                Volume:
                <input 
                    type="range"
                    className="w-full"
                    value={gain}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(e) => {
                        gainInterface.set({gain: Number(e.target.value)})
                        setGain(Number(e.target.value));
                    }}                        
                />
                {gainInterface.get()?.gain}
            </div>
        </div>
    );
};

export default Outputs;
