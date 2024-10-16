import { OutputProps } from "@/_lib/_types/types";

const Outputs: React.FC<OutputProps> = ({
    effectsInterfaces
}) => {
    console.log(effectsInterfaces);
    
    return (
        <div className="border-2 border-black">
            Outputs
        </div>
    );
};

export default Outputs;
