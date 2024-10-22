import OptionsPanel from "./optionsPanel/OptionsPanel";
import Keyboard from "./Keyboard";
import { KeyboardProps, OptionsPanelProps, QwertyInputProps } from '@/_lib/_types/types';
import { useMemo, useRef} from "react";
import { useQwertyInput } from "@/_hooks/useQwertyInput";
import { modes } from "@/_lib/_data/modes";
import useAudio from "@/_hooks/useAudio";
import useKeyboard from "@/_hooks/useKeyboard";
import useMidiUploader from "@/_hooks/useMidiUploader";
import { useMidiPlayback } from "@/_hooks/useMidiPlayback";
import useMode from "@/_hooks/useMode";
import useMidiController from "@/_hooks/useMidiController";

const PianoWrapper: React.FC = () => {

    const { 
        hertzPlayback, 
        effectsInterfaces
    } = useAudio();

    const keyboardRange = useMemo(() => ({
        startPitch: 'A',
        startOctave: 0,
        endPitch: 'C',
        endOctave: 8
    }), []);

    const {
        getModeState,
        setModeState,
        onModChange
    } = useMode(onReset);

    const {
        keys,
        resetHertzTable,
        keyHandlers
    } = useKeyboard(keyboardRange, hertzPlayback, getModeState);

    function onReset() {
        resetHertzTable();
    };
    
    const isQwertyEnabled = useRef(false);

    const toggleIsQwertyEnabled = () => {
        isQwertyEnabled.current = !isQwertyEnabled.current;
    };

    const checkIsQwertyEnabled = (): boolean => {
        return isQwertyEnabled.current;
    };

    const qwertyInputProps: QwertyInputProps = {
        checkIsQwertyEnabled,
        octaveRange: {
            octaveMin: keyboardRange.startOctave,
            currentOctave: 2,
            octaveMax: keyboardRange.endOctave
        },
        keyHandlers
    };

    useQwertyInput(qwertyInputProps);
    useMidiController(keys, keyHandlers);
    const { parsedMidiData, getMidiFileText, handleMidiUpload} = useMidiUploader();
    const { play, pause, stop, getPlaybackState } = useMidiPlayback(parsedMidiData, keyHandlers);

    const optionsPanelProps: OptionsPanelProps = {
        globalProps: {
            onReset
        },
        inputProps: {
            checkIsQwertyEnabled,
            toggleIsQwertyEnabled,
            midiPlaybackProps: {
              getMidiFileText, 
              handleMidiUpload,
              play, 
              pause, 
              stop, 
              getPlaybackState
            }
        },
        modeProps: {
            getModeState,
            setModeState,
            onModChange,
            maxModes: modes.length - 1
        },
        outputProps: {
            effectsInterfaces
        }
    };

    const keyboardProps: KeyboardProps = {
        keys,
        keyHandlers
    };

    return (
      <div className="border-2 border-black">
          <OptionsPanel {...optionsPanelProps} />          
          <Keyboard {...keyboardProps} />
      </div>
    );
};
  
export default PianoWrapper;