import { OutputProps, ReverbInterface } from "@/_lib/_types/types";
import { useCallback, useEffect, useState } from "react";

const Outputs: React.FC<OutputProps> = ({
    effectsInterfaces
}) => {
    const {gainInterface, reverbInterface, vibratoInterface} = effectsInterfaces;
    
    const getValueFromName = useCallback((valueName: string, effectInterface: ReverbInterface) => {
        return effectInterface.options.find(({name}) => name === valueName)?.get();
    }, []);

    const [reverb, setReverb] = useState<{[key: string]: number | undefined}>({});
    
    const [vibrato, setVibrato] = useState({
        frequency: vibratoInterface?.get()?.frequency ?? 0,
        depth: vibratoInterface.get()?.depth ?? 0,
        wet: vibratoInterface.get()?.wet ?? 0
    });
    
    const [gain, setGain] = useState<number>( gainInterface.get()?.gain ?? 0 );

    return (
        <div className="border-2 border-black">
            {reverbInterface.name}
            {reverbInterface.options.map((option) => (
                <div key={reverbInterface.name + option.name} className="grid grid-cols-[25%_65%_10%]">
                    {option.name}
                    <input 
                        type="range"
                        className="w-full"
                        value={getValueFromName(option.name, reverbInterface)}
                        min={option.min}
                        max={option.max}
                        step={option.step}
                        onChange={(e) => {
                            option.set(Number(e.target.value));
                            setReverb({...reverb, [option.name]: Number(e.target.value)})
                        }}                        
                    />
                    {option.get()}
                </div>
            ))}
            
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
