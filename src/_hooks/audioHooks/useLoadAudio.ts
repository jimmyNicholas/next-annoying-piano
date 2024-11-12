import { useCallback, useEffect, useRef, useState } from 'react';
import { ToneType } from '@/_lib/_types/types';

interface LoadAudioReturn {
    audioIsLoaded: boolean;
    tone: React.MutableRefObject<typeof ToneType | null>;
};

/**
 * Custom hook that handles the initialization and loading of the Tone.js audio context.
 * 
 * @description
 * This hook manages the safe initialization of the Web Audio API through Tone.js by:
 * 1. Dynamically importing Tone.js only when needed
 * 2. Waiting for user interaction before starting audio context
 * 3. Handling the audio context startup process
 * 4. Managing cleanup of event listeners
 * 
 * The hook follows best practices for web audio by requiring user interaction
 * before initializing audio context, which is necessary for browsers' autoplay policies.
 * It also implements dynamic importing for better initial page load performance.
 * 
 * @returns {LoadAudioReturn} An object containing:
 * - audioIsLoaded: Boolean indicating whether audio context is initialized
 * - tone: Reference to the Tone.js instance once loaded
 * 
 * @example
 * ```tsx
 * function AudioComponent() {
 *   const { audioIsLoaded, tone } = useLoadAudio();
 * 
 *   useEffect(() => {
 *     if (!audioIsLoaded) {
 *       console.log('Waiting for user interaction...');
 *       return;
 *     }
 * 
 *     console.log('Audio context is ready!');
 *     // Initialize your audio components here
 *     const synth = new tone.current.Synth();
 *   }, [audioIsLoaded, tone]);
 * 
 *   return (
 *     <div>
 *       {audioIsLoaded ? (
 *         'Audio ready!'
 *       ) : (
 *         'Click or press any key to start audio'
 *       )}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @warning
 * This hook must be used before any other audio-related operations.
 * Audio won't start until the first user interaction (click or keypress).
 */
const useLoadAudio = (): LoadAudioReturn => {
    // Track whether audio context is initialized
    const [audioIsLoaded, setAudioIsLoaded] = useState<boolean>(false);

    // Store Tone.js instance
    const tone = useRef<typeof ToneType | null>(null);
    
    /**
     * Initializes the audio context and loads Tone.js
     * Called after user interaction to comply with browser autoplay policies
    */
    const startAudio = useCallback(async () => {
        // Prevent multiple initialization attempts
        if (audioIsLoaded) return;

        // Dynamically import Tone.js
        tone.current = await import('tone') as typeof ToneType;

        // Initialize audio context
        await tone.current.start()
            .then(() => setAudioIsLoaded(true))
            .catch((err) => console.error('Failed to start audio: ', err));
    }, [audioIsLoaded]);

    /**
     * Sets up event listeners for user interaction
     * Removes listeners once audio is initialized
    */
    useEffect(() => {
        if (audioIsLoaded) return;

        const handleInteraction = () => {
            startAudio();
            // Clean up listeners after first interaction
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };

        // Add listeners for user interaction
        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction); 
          
        // Cleanup function
        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, [audioIsLoaded, startAudio]);

    return { audioIsLoaded, tone };
};

export default useLoadAudio;
