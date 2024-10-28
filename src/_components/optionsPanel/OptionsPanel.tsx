import Global from "./Global";
import Inputs from "./Inputs";
import Modes from "./Modes";
import Outputs from "./Outputs";
import { OptionsPanelProps } from "@/_lib/_types/types";

const OptionsPanel: React.FC<OptionsPanelProps> = ({
    globalProps,
    inputProps,
    modeProps,
    outputProps
}) => {
    return (
        <div className="grid grid-cols-[8%_30%_30%_32%] bg-cyan-200">
            <Global {...globalProps} />
            <Inputs {...inputProps}/>
            <Modes {...modeProps} />
            <Outputs {...outputProps}/>
        </div>
    );
};

export default OptionsPanel;
