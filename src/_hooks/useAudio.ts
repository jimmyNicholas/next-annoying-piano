import { useConnectEffects } from './audioHooks/useConnectEffects';
import useHertzPlayback from './audioHooks/useHertzPlayback';

const useAudio = () => {
    const { polySynth, polySynthInterface, effectsInterfaces } = useConnectEffects();
    const { hertzPlayback, keyEmitter } = useHertzPlayback(polySynth);
    return { hertzPlayback, keyEmitter, polySynthInterface, effectsInterfaces}
};

export default useAudio;
