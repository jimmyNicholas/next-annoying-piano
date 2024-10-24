import { useConnectEffects } from './audioHooks/useConnectEffects';
import useHertzPlayback from './audioHooks/useHertzPlayback';

const useAudio = () => {
    const { polySynth, effectsInterfaces } = useConnectEffects();
    const { hertzPlayback, keyEmitter } = useHertzPlayback(polySynth);
    return { hertzPlayback, keyEmitter, effectsInterfaces}
};

export default useAudio;
