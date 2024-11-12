import OptionsPanel from "./optionsPanel/OptionsPanel";
import Keyboard from "./Keyboard";
import { KeyboardProps, OptionsPanelProps, QwertyInputProps } from '@/_lib/_types/types';
import { useContext, useEffect, useMemo, useState } from "react";
import useQwertyInput from "@/_hooks/useQwertyInput";
import useAudio from "@/_hooks/useAudio";
import useKeyboard from "@/_hooks/useKeyboard";
import useMidiUploader from "@/_hooks/useMidiUploader";
import useMidiPlayback from "@/_hooks/useMidiPlayback";
import useMode from "@/_hooks/useMode";
import { ToneContext } from "./MainApp";

const PianoWrapper: React.FC = () => {
    const tone = useContext(ToneContext)
    const [isToneLoaded, setIsToneLoaded] = useState(false);

    useEffect(() => {
        if (!isToneLoaded && tone) setIsToneLoaded(true);
    }, [tone, isToneLoaded, setIsToneLoaded]);

    const { 
        hertzPlayback,
        keyEmitter, 
        polySynthInterface,
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
    const { parsedMidiData, midiFileText, handleMidiUpload} = useMidiUploader();
    const { play, pause, stop, playbackState } = useMidiPlayback(parsedMidiData, keyHandlers);

    const optionsPanelProps: OptionsPanelProps = {
        globalProps: {
            
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
            modes,
            onReset
        },
        outputProps: {
            polySynthInterface,
            effectsInterfaces
        }
    };

    const keyboardProps: KeyboardProps = {
        keys,
        keyEmitter,
        keyHandlers
    };
    return (
      <div className="h-full flex flex-col">
          <OptionsPanel {...optionsPanelProps} />          
          <Keyboard {...keyboardProps} />
      </div>
    );
};
  
export default PianoWrapper;