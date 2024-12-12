import { PlayIcon, PauseIcon, StopIcon } from "@/_assets/icons";

/**
 * Type for the different states of MIDI playback
 */
type PlaybackAction = 'play' | 'pause' | 'stop';

/**
 * Props interface for the MidiPlaybackButton component
 * @interface MidiPlaybackButtonProps
 * @property {PlaybackAction} action - The type of playback action this button represents
 * @property {() => void} onClick - Click handler for the button
 * @property {'stopped' | 'playing' | 'paused'} currentState - Current state of MIDI playback
 */
interface MidiPlaybackButtonProps {
    action: PlaybackAction;
    onClick: () => void;
    currentState: 'stopped' | 'playing' | 'paused';
}

/**
 * Button component for MIDI playback controls
 * @component
 */
const MidiPlaybackButton: React.FC<MidiPlaybackButtonProps> = ({
    action,
    onClick,
    currentState
}) => {
    /**
     * Maps action types to their corresponding icons
     */
    const iconMap = {
        play: PlayIcon,
        pause: PauseIcon,
        stop: StopIcon
    };

    const Icon = iconMap[action];
    
    /**
     * Determines if the button should be highlighted based on current state
     */
    const isActive = currentState === (
        action === 'play' ? 'playing' :
        action === 'pause' ? 'paused' : 'stopped'
    );

    return (
        <button 
            className={`${isActive ? "bg-yellow-300" : "bg-slate-300"} p-2 grid place-items-center rounded-lg`}
            onClick={onClick}
            aria-label={`${action.charAt(0).toUpperCase() + action.slice(1)} MIDI`}
        >
            <Icon className="w-10 h-10"/>
        </button>
    );
};

export default MidiPlaybackButton;