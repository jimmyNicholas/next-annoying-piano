import { useConnectEffects } from './audioHooks/useConnectEffects';
import useHertzPlayback from './audioHooks/useHertzPlayback';

const useAudio = () => {
    const { polySynth, effectsInterfaces } = useConnectEffects();
    const { hertzPlayback } = useHertzPlayback(polySynth);
    return { hertzPlayback, effectsInterfaces}
};

export default useAudio;
