import { OutputProps } from "@/_lib/_types/types";

const Outputs: React.FC<OutputProps> = ({
    effectsNodes
}) => {
    return (
        <div className="border-2 border-black">
            Outputs
            {`${effectsNodes}`}
        </div>
    );
};

export default Outputs;
