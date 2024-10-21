import { OutputProps, EffectInterface } from "@/_lib/_types/types";
import { useCallback, useState } from "react";

const Outputs: React.FC<OutputProps> = ({
    effectsInterfaces
}) => {
    const {gainInterface, reverbInterface, vibratoInterface} = effectsInterfaces;
    
    const getValueFromName = useCallback((valueName: string, effectInterface: EffectInterface) => {
        return effectInterface.options.find(({name}) => name === valueName)?.get();
    }, []);

    const [reverb, setReverb] = useState<{[key: string]: number | undefined}>({});
    const [vibrato, setVibrato] = useState<{[key: string]: number | undefined}>({});
    const [gain, setGain] = useState<{[key: string]: number | undefined}>({});

    return (
        <div className="border-2 border-black">
            {reverbInterface.name || 'Effect'}
            {reverbInterface.options.map((option) => (
                <div key={reverbInterface.name + option.name} className="grid grid-cols-[25%_65%_10%]">
                    {option.title}
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
            
            {vibratoInterface.name || 'Effect'}
            {vibratoInterface.options.map((option) => (
                <div key={vibratoInterface.name + option.name} className="grid grid-cols-[25%_65%_10%]">
                    {option.title}
                    <input 
                        type="range"
                        className="w-full"
                        value={getValueFromName(option.name, vibratoInterface)}
                        min={option.min}
                        max={option.max}
                        step={option.step}
                        onChange={(e) => {
                            option.set(Number(e.target.value));
                            setVibrato({...vibrato, [option.name]: Number(e.target.value)})
                        }}                        
                    />
                    {option.get()}
                </div>
            ))}

            {gainInterface.name || 'Effect'}
            {gainInterface.options.map((option) => (
                <div key={gainInterface.name + option.name} className="grid grid-cols-[25%_65%_10%]">
                    {option.title}
                    <input 
                        type="range"
                        className="w-full"
                        value={getValueFromName(option.name, gainInterface)}
                        min={option.min}
                        max={option.max}
                        step={option.step}
                        onChange={(e) => {
                            option.set(Number(e.target.value));
                            setGain({...gain, [option.name]: Number(e.target.value)})
                        }}                        
                    />
                    {option.get()}
                </div>
            ))}
        </div>
    );
};

export default Outputs;
