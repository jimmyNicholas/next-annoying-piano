import { useConnectEffects } from './audioHooks/useConnectEffects';
import useHertzPlayback from './audioHooks/useHertzPlayback';

const useAudio = () => {
    const { polySynth, effectsNodes } = useConnectEffects();
    const { hertzPlayback } = useHertzPlayback(polySynth);
    return { hertzPlayback, effectsNodes}
};

export default useAudio;
