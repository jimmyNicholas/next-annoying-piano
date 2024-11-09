import { OutputProps, EffectInterface } from "@/_lib/_types/types";
import DraggableInput from "@/_ui/DraggableInput";
import { useCallback } from "react";

const Outputs: React.FC<OutputProps> = ({
    polySynthInterface,
    effectsInterfaces
}) => {
    const {reverbInterface, vibratoInterface} = effectsInterfaces;
    
    const getValueFromName = useCallback((valueName: string, effectInterface: EffectInterface) => {
        return effectInterface.options.find(({name}) => name === valueName)?.get();
    }, []);

    return (
        <div className="grid grid-flow-col bg-cyan-100 rounded-lg mb-2 mx-2 select-none sm:grid-flow-row lg:grid-flow-row"
        >
             {[reverbInterface, vibratoInterface, polySynthInterface].map((effect, effectIndex) => (
                <div 
                    key={effect.name !== undefined ? effect.name : effectIndex}
                    className="p-2 bg-cyan-50 rounded-lg m-2 grid sm:grid-cols-[18%_82%] lg:grid-cols-[18%_82%]"
                >
                    <h3 className="sm:max-lg:text-sm lg:text-base text-center content-center">
                        {effect.name || 'Effect'}
                    </h3>
                    <div
                        className="bg-white grid grid-flow-col rounded-lg gap-2"
                    >
                        {effect.options?.map((option) => (
                            <div 
                                key={effectIndex + option.name}
                                className="sm:max-lg:text-xs xl:text-sm text-center items-center cursor-ns-resize"
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
