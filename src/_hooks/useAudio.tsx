import { useState, useEffect } from 'react';
import { AudioModule } from "@/_lib/_types/types";

function useAudio() {
    const [audioIsLoaded, setAudioIsLoaded] = useState<boolean>(false);
    const [audioService, setAudioService] = useState<AudioModule | null>(null);

    useEffect(() => {
        async function loadAudio() {     
            const {audioModule} = await import('../_services/audio');
            await audioModule.setupAudio()
                .then(() => setAudioIsLoaded(true))
                .then(() => setAudioService(audioModule));    
        };
        loadAudio();
    }, []);

    return { audioIsLoaded, audioService };
}   

export default useAudio;