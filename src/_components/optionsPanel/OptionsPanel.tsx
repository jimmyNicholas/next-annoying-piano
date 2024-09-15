import Global from "./Global";
import Inputs from "./Inputs";
import Modes from "./Modes";
import Outputs from "./Outputs";

export default function OptionsPanel({
    mode,
    updateMode,
} : {
    mode: string;
    updateMode: (mode: string) => void;
}) {
    return (
        <div className="grid grid-cols-[15%_20%_45%_20%]">
            <Global/>
            <Inputs/>
            <Modes
                mode={mode}
                updateMode={updateMode}
            />
            <Outputs/>
        </div>
    );
}
