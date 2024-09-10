import Global from "./Global";
import Inputs from "./Inputs";
import Modes from "./modes";
import Outputs from "./Outputs";

export default function OptionsPanel() {
    return (
        <div>
            <Global/>
            <Inputs/>
            <Modes/>
            <Outputs/>
        </div>
    );
}
