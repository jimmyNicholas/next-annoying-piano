import { useState } from 'react';
import { AudioModule } from "@/_lib/_types/types";

function useAudio() {
    const [audioIsLoaded, setAudioIsLoaded] = useState<boolean>(false);
    const [audioService, setAudioService] = useState<AudioModule | null>(null);

    async function loadAudio() {     
        const {audioModule} = await import('../_services/audio');
        await audioModule.setupAudio()
            .then(() => setAudioIsLoaded(true))
            .then(() => setAudioService(audioModule));    
    };

    return { loadAudio, audioIsLoaded, audioService };
}   

export default useAudio;