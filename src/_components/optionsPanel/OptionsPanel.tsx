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
        <div className="bg-cyan-600 grid grid-flow-col sm:max-2xl:grid-flow-row">  
            {/* <Global {...globalProps} /> */}
            <div
                className="grid sm:max-2xl:grid-cols-[40%_60%]"
            >
                <Inputs {...inputProps}/>
                <MidiPlayback {...midiPlaybackProps}/>
            </div>
            <Modes {...modeProps} />
            <Outputs {...outputProps}/>
        </div>
    );
};

export default OptionsPanel;
