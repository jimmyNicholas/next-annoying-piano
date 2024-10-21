'use client';

import { ToneType } from '@/_lib/_types/types';
import { createContext} from "react";
import useLoadAudio from "@/_hooks/audioHooks/useLoadAudio";
import PianoWrapper from './PianoWrapper';
export const ToneContext = createContext<typeof ToneType | null>(null);

const MainApp: React.FC = () => {
    const { tone } = useLoadAudio();
    return (
        <ToneContext.Provider value={tone.current}>
            <PianoWrapper /> 
        </ToneContext.Provider>
    );
};

export default MainApp;
