import { useState, useEffect } from 'react';
import { AudioModule } from "@/_lib/_types/types";

function useAudio() {
    const [audioIsLoaded, setAudioIsLoaded] = useState<boolean>(false);
    const [audioService, setAudioService] = useState<AudioModule | null>(null);


}