import { useCallback, useEffect, useState } from 'react';
import { AudioModule } from "@/_lib/_types/types";

const useAudio = () => {
    const [audioIsLoaded, setAudioIsLoaded] = useState<boolean>(false);
    const [audioService, setAudioService] = useState<AudioModule | null>(null);
    const [ tone, setTone ] = useState({});

    const startAudio = useCallback(async () => {
        if (!audioIsLoaded) {
            const Tone = await import('tone');
            setTone(Tone);
            await Tone.start()
                .then(() => setAudioIsLoaded(true));
        };
    }, [audioIsLoaded, setTone]);

    useEffect(() => {
        function setupAudio() {
            window.addEventListener('click', startAudio);
            window.addEventListener('keydown', startAudio);
            return () => {
                window.removeEventListener('click', () => setAudioIsLoaded(false));
                window.removeEventListener('keydown', () => setAudioIsLoaded(false))
            };
        };
        setupAudio();
    }, [startAudio]);    

    async function loadAudio() {     
        const {audioModule} = await import('../_services/audio');
        await audioModule.setupAudio()
            .then(() => setAudioIsLoaded(true))
            .then(() => setAudioService(audioModule));    
    };

    return { loadAudio, audioIsLoaded, audioService };
}   

export default useAudio;