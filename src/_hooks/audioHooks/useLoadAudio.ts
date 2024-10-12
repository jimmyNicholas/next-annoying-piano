import { useCallback, useEffect, useRef, useState } from 'react';
import { ToneType } from '@/_lib/_types/types';

const useLoadAudio = () => {
    const [audioIsLoaded, setAudioIsLoaded] = useState<boolean>(false);
    const tone = useRef<typeof ToneType | null>(null);
    
    const startAudio = useCallback(async () => {
        if (audioIsLoaded) return;
        tone.current = await import('tone') as typeof ToneType;
        await tone.current.start()
            .then(() => setAudioIsLoaded(true))
            .catch((err) => console.error('Failed to start audio: ', err));
    }, [audioIsLoaded]);

    useEffect(() => {
        if (audioIsLoaded) return;

        const handleInteraction = () => {
            startAudio();
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction); 
            
        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, [audioIsLoaded, startAudio]);

    return { audioIsLoaded, tone };
};

export default useLoadAudio;
