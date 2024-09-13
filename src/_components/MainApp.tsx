import OptionsPanel from "./optionsPanel/OptionsPanel";
import Keyboard from "./Keyboard";
import { getKeys } from "@/_utils/keys/keyboardSetup";

export default function MainApp() {
    const keys = getKeys('C', 2, 'C', 4);

    return (
        <div className="border-2 border-black">
            Main App
            <OptionsPanel/>
            <Keyboard
                keys={keys}
            />
        </div>
    );
};
