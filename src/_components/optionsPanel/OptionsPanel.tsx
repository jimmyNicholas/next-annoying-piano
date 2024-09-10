import Global from "./Global";
import Inputs from "./Inputs";
import Modes from "./modes";
import Outputs from "./Outputs";

export default function OptionsPanel() {
    return (
        <div className="grid grid-cols-[15%_20%_45%_20%]">
            <Global/>
            <Inputs/>
            <Modes/>
            <Outputs/>
        </div>
    );
}
