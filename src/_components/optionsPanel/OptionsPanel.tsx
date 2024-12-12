import Inputs, { InputProps } from "./Inputs";
import MidiPlayback, { MidiPlaybackProps } from "./midi/MidiPlayback";
import Modes, { ModeProps } from "./Modes";
import Outputs, { OutputsProps } from "./Outputs";

export interface OptionsPanelProps {
    inputProps: InputProps;
    midiPlaybackProps: MidiPlaybackProps;
    modeProps: ModeProps;
    outputsProps: OutputsProps;
}

/**
 * Props for the options panel component
 * @interface OptionsPanelProps
 * @property {InputProps} inputProps - MIDI controller and keyboard input settings
 * @property {MidiPlaybackProps} midiPlaybackProps - MIDI file upload and playback settings
 * @property {ModeProps} modeProps - Mode selection settings
 * @property {OutputProps} outputProps - Output configuration settings
 */

/**
 * Main control panel component organizing all music application settings
 * Combines input selection, MIDI playback, mode selection, and output controls
 * @param {OptionsPanelProps} props - The component props
 * @returns {JSX.Element} Rendered options panel
 */
const OptionsPanel: React.FC<OptionsPanelProps> = ({
    inputProps,
    midiPlaybackProps,
    modeProps,
    outputsProps
}: OptionsPanelProps): JSX.Element => {

    return (
        <div className="bg-cyan-600 grid grid-flow-col sm:max-2xl:grid-flow-row">  
            <div
                className="grid sm:max-2xl:grid-cols-[40%_60%]"
            >
                <Inputs {...inputProps}/>
                <MidiPlayback {...midiPlaybackProps}/>
            </div>
            <Modes {...modeProps} />
            <Outputs {...outputsProps}/>
        </div>
    );
};

export default OptionsPanel;
