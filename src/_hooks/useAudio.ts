import { useConnectEffects } from './audioHooks/useConnectEffects';
import useHertzPlayback from './audioHooks/useHertzPlayback';
import { ToneType } from '@/_lib/_types/types';

const useAudio = (tone: typeof ToneType | null ) => {
    const { polySynth, effectsOptions } = useConnectEffects(tone);
    const { hertzPlayback } = useHertzPlayback(tone, polySynth);
    return { tone, hertzPlayback, effectsOptions}
};

export default useAudio;
