//import Global from "./Global";
import Inputs from "./Inputs";
import MidiPlayback from "./inputs/MidiPlayback";
import Modes from "./Modes";
import Outputs from "./Outputs";
import { OptionsPanelProps } from "@/_lib/_types/types";

const OptionsPanel: React.FC<OptionsPanelProps> = ({
    //globalProps,
    inputProps,
    modeProps,
    outputProps
}) => {
    const {midiPlaybackProps} = inputProps;
    return (
        <div className="flex flex-wrap bg-cyan-600 gap-2">
            {/* <Global {...globalProps} /> */}
            <Inputs {...inputProps}/>
            <MidiPlayback {...midiPlaybackProps}/>
            <Modes {...modeProps} />
            <Outputs {...outputProps}/>
        </div>
    );
};

export default OptionsPanel;
