import { OutputProps, EffectInterface } from "@/_lib/_types/types";
import DraggableInput from "@/_ui/DraggableInput";
import { useCallback } from "react";

const Outputs: React.FC<OutputProps> = ({
    effectsInterfaces
}) => {
    const {gainInterface, reverbInterface, vibratoInterface} = effectsInterfaces;
    
    const getValueFromName = useCallback((valueName: string, effectInterface: EffectInterface) => {
        return effectInterface.options.find(({name}) => name === valueName)?.get();
    }, []);

    return (
        <div className="flex-1 grid grid-flow-col">
             {[reverbInterface, vibratoInterface, gainInterface].map((effect, effectIndex) => (
                <div 
                    key={effect.name !== undefined ? effect.name : effectIndex}
                    className="p-2 bg-slate-100 rounded-lg m-2 grid grid-cols-[18%_82%]"
                >
                    <h3 className="text-sm text-center">
                        {effect.name || 'Effect'}
                    </h3>
                    <div
                        className="bg-white grid grid-flow-col px-2 rounded-lg"
                    >
                        {effect.options?.map((option) => (
                            <div 
                                key={effectIndex + option.name}
                                className="grid grid-flow-col text-xs text-center items-center"
                            >
                                <DraggableInput 
                                    label={option.title}
                                    value={getValueFromName(option.name, effect)}
                                    min={option.min}
                                    max={option.max}
                                    step={option.step}
                                    onChange={(value) => option.set(value)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Outputs;
