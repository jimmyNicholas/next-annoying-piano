import OptionsPanel from "./optionsPanel/OptionsPanel";
import Keyboard from "./Keyboard";

export default function MainApp() {
    return (
        <div className="border-2 border-black">
            Main App
            <OptionsPanel/>
            <Keyboard/>
        </div>
    );
};