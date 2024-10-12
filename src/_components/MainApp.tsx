'use client';

import OptionsPanel from "./optionsPanel/OptionsPanel";
import Keyboard from "./Keyboard";
import { KeyboardProps, OptionsPanelProps, QwertyInputProps, ToneType } from '@/_lib/_types/types';
import { useRef} from "react";
import { useQwertyInput } from "@/_hooks/useQwertyInput";
import { modes } from "@/_lib/_data/modes";
import useAudio from "@/_hooks/useAudio";
import useKeyboard from "@/_hooks/useKeyboard";
import useMode from "@/_hooks/useMode";
import useMidiController from "@/_hooks/useMidiController";
import { useMidiPlayback } from "@/_hooks/useMidiPlayer";
import useMidiUploader from "@/_hooks/useMidiUploader";
import useLoadAudio from "@/_hooks/audioHooks/useLoadAudio";

const LoadingScreen: React.FC = () => (
    <div>Click Screen To Load Audio</div>
);

const PianoWrapper: React.FC<{ tone: typeof ToneType | null}> = ({tone}) => {
    const audioIsLoaded = true; 
    const { hertzPlayback, effectsOptions } = useAudio(tone ); 
    console.log(effectsOptions);

    const { mode, updateMode, onModChange } = useMode(onReset);
    const keyboardRange = {startPitch: 'A', startOctave: 0, endPitch: 'C', endOctave: 8};
    const { keys, resetHertzTable, keyHandlers} = useKeyboard(keyboardRange, hertzPlayback, mode);

    function onReset() {
        resetHertzTable();
    };

    const isQwertyEnabled = useRef(false);
    const toggleIsQwertyEnabled = () => { 
        isQwertyEnabled.current = !isQwertyEnabled.current 
    };
    const checkIsQwertyEnabled = (): boolean => { 
        return isQwertyEnabled.current };

    const qwertyInputProps: QwertyInputProps = {
        checkIsQwertyEnabled,
        octaveRange: {
            octaveMin: keyboardRange.startOctave,
            currentOctave: 2,
            octaveMax: keyboardRange.endOctave
        },
        keyHandlers,
    };
    useQwertyInput(qwertyInputProps);
    useMidiController(keys, keyHandlers);

    const { parsedMidiData, midiFileText, handleMidiUpload} = useMidiUploader();
    const midiPlayback = useMidiPlayback(parsedMidiData, keyHandlers);

    const optionsPanelProps: OptionsPanelProps = {
        globalProps: { audioIsLoaded, onReset},
        inputProps: { checkIsQwertyEnabled, toggleIsQwertyEnabled, handleMidiUpload, midiFileText, midiPlayback},
        modeProps: { mode: mode, updateMode, onModChange, maxModes: modes.length - 1}
    };

    const keyboardProps: KeyboardProps = { 
        keys, 
        keyHandlers,
    };

    return (
        <div className="border-2 border-black">
            <OptionsPanel {...optionsPanelProps} />          
            <Keyboard {...keyboardProps} />
        </div>
    );
};

const MainApp: React.FC = () => {
    const { audioIsLoaded, tone } = useLoadAudio();
    return audioIsLoaded ? <PianoWrapper tone={tone} /> : <LoadingScreen />;
};

export default MainApp;
