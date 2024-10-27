import OptionsPanel from "./optionsPanel/OptionsPanel";
import Keyboard from "./Keyboard";
import { KeyboardProps, OptionsPanelProps, QwertyInputProps } from '@/_lib/_types/types';
import { useMemo } from "react";
import { useQwertyInput } from "@/_hooks/useQwertyInput";
import useAudio from "@/_hooks/useAudio";
import useKeyboard from "@/_hooks/useKeyboard";
import useMidiUploader from "@/_hooks/useMidiUploader";
import { useMidiPlayback } from "@/_hooks/useMidiPlayback";
import useMode from "@/_hooks/useMode";
import useMidiController from "@/_hooks/useMidiController";

const PianoWrapper: React.FC = () => {

    const { 
        hertzPlayback,
        keyEmitter, 
        effectsInterfaces
    } = useAudio();

    const keyboardRange = useMemo(() => ({
        startPitch: 'A',
        startOctave: 0,
        endPitch: 'C',
        endOctave: 8
    }), []);

    const {
        getModeRef,
        setModeRef,
        updateModifier,
        modes
    } = useMode(onReset);

    const {
        keys,
        resetHertzTable,
        keyHandlers
    } = useKeyboard(keyboardRange, hertzPlayback, getModeRef);

    function onReset() {
        resetHertzTable();
    };
    
    const qwertyInputProps: QwertyInputProps = {
        octaveRange: {
            octaveMin: keyboardRange.startOctave,
            currentOctave: 2,
            octaveMax: keyboardRange.endOctave
        },
        keyHandlers
    };

    const { isQwertyEnabled, toggleIsQwertyEnabled } = useQwertyInput(qwertyInputProps);
    useMidiController(keys, keyHandlers);
    const { parsedMidiData, midiFileText, handleMidiUpload} = useMidiUploader();
    const { play, pause, stop, playbackState } = useMidiPlayback(parsedMidiData, keyHandlers);

    const optionsPanelProps: OptionsPanelProps = {
        globalProps: {
            onReset
        },
        inputProps: {
            isQwertyEnabled, 
            toggleIsQwertyEnabled,
            midiPlaybackProps: {
              midiFileText, 
              handleMidiUpload,
              play, 
              pause, 
              stop, 
              playbackState
            }
        },
        modeProps: {
            getModeRef,
            setModeRef,
            updateModifier,
            modes
        },
        outputProps: {
            effectsInterfaces
        }
    };

    const keyboardProps: KeyboardProps = {
        keys,
        keyEmitter,
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