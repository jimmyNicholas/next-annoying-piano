import Global from "./Global";
import Inputs from "./Inputs";
import Modes from "./Modes";
import Outputs from "./Outputs";
import { OptionsPanelProps } from "@/_lib/_types/types";

const OptionsPanel: React.FC<OptionsPanelProps> = ({
    globalProps,
    inputProps,
    modeProps,
}) => {
    return (
        <div className="grid grid-cols-[15%_25%_40%_20%] bg-cyan-200">
            <Global {...globalProps} />
            <Inputs {...inputProps}/>
            <Modes {...modeProps} />
            <Outputs/>
        </div>
    );
};

export default OptionsPanel;
