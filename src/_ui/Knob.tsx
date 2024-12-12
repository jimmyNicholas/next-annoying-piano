import { useCallback, useEffect, useState, WheelEventHandler } from "react";

/**
 * Props for the Knob component
 * @interface KnobProps
 * @property {string | number} [label] - Optional label to display below the knob
 * @property {number} min - Minimum value the knob can represent
 * @property {number} max - Maximum value the knob can represent
 * @property {(value: number) => void} [onChange] - Callback function triggered when knob value changes
 * @property {number} step - Amount to increment/decrement value by when using mouse wheel
 * @property {number} [value] - Current value of the knob (undefined defaults to 0)
 */
interface KnobProps {
    label?: string | number;
    min: number;
    max: number;
    onChange?: (value: number) => void;
    step: number;
    value: number | undefined;
}

// Denominator used to control drag sensitivity
const DRAGGING_DENOMINATOR = 200;

/**
 * A rotary knob component that can be controlled via mouse drag or mouse wheel
 * Provides visual feedback through rotation and supports value constraints
 * 
 * @component
 * @param {KnobProps} props - Component props
 * @returns {JSX.Element} Knob component
 */
const Knob: React.FC<KnobProps> = ({ label, onChange, value: inputValue, step, min, max }: KnobProps): JSX.Element => {
    const [value, setValue] = useState(inputValue || 0);

    /**
     * Handles mouse wheel events to increment/decrement value
     * Respects min/max bounds and step size
     */
    const handleMouseWheel = useCallback<WheelEventHandler<HTMLDivElement>>(
        (e) => setValue(e.deltaY < 0 ? Math.max(min, value - step) : Math.min(max, value + step)),
        [max, min, step, value]
    );

    /**
     * Triggers the onChange callback with the current value
     */
    const handleChange = useCallback(
        (v: number) => {
            onChange?.(v)
        }, 
        [onChange]
    );

    /**
     * Handles drag movement to update knob value
     * Uses movementY to determine direction and amount of change
     */
    const handleDrag = useCallback(
        (e: MouseEvent) => {
            e.preventDefault()
            setValue((prev) => Math.max(min, Math.min(max, prev + -e.movementY * ((max - min) / DRAGGING_DENOMINATOR))))
        }, [max, min]
    );

    /**
     * Cleans up event listeners when dragging ends
     */
    const handleMouseUp = useCallback(() => {
        document.removeEventListener('mousemove', handleDrag)
        document.removeEventListener('mouseup', handleMouseUp)
    }, [handleDrag]);

    /**
     * Sets up event listeners for drag functionality
     */
    const handleMouseDown = useCallback(() => {
        document.addEventListener('mousemove', handleDrag)
        document.addEventListener('mouseup', handleMouseUp)
    }, [handleDrag, handleMouseUp]);

    // Trigger onChange when value changes
    useEffect(() => {
        handleChange(value)
    }, [handleChange, value])

    // Calculate position as percentage between min and max
    const position = (value - min) / (max - min)

    return (
        <div 
            className="size-10 aspect-square"
            onWheel={handleMouseWheel}
            onMouseDown={handleMouseDown}
        >
            <KnobMain position={position} />
            <div>{label}</div>
        </div>
    )
}

/**
 * Props for the KnobMain component
 * @interface KnobMainProps
 * @property {number} position - Number between 0 and 1 representing knob position
 */
interface KnobMainProps {
    position: number;
};

/**
 * SVG-based visual representation of the knob
 * Rotates based on the current position value
 * 
 * @component
 * @param {KnobMainProps} props - Component props
 * @returns {JSX.Element} KnobMain component
 */
const KnobMain: React.FC<KnobMainProps> = ({position}: KnobMainProps): JSX.Element => {
    // Convert position to angle between 0 and 270 degrees
    const angle = Math.min(Math.max(0, position * 270), 270);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            style={{
                fillRule: 'evenodd',
                clipRule: 'evenodd',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeMiterlimit: 1.5,
            }}
            viewBox="0 0 1024 1024"
        >
            {/* Static background elements */}
            <g>
                <path
                fill="none"
                d="M202.085 686.883C135.815 633.107 94.786 558.75 94.786 476.659c0-163.901 163.552-296.967 365.003-296.967 201.45 0 365.002 133.066 365.002 296.967 0 81.743-40.682 155.817-106.457 209.539"
                style={{
                    fill: '#ebebeb',
                    fillOpacity: 0,
                    stroke: 'currentColor',
                    strokeWidth: '13.2px',
                }}
                transform="matrix(1.35193 0 0 1.66166 -109.602 -280.045)"
                />
                <path
                d="m960 960-97.415-97.415"
                style={{
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: 20,
                }}
                />
                <path
                d="M164.09 859.91 64 960"
                style={{
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: 20,
                }}
                transform="matrix(.98664 .01336 .01336 .98664 -11.974 11.974)"
                />
            </g>
            {/* Rotating knob elements */}
            <g style={{ cursor: 'pointer', rotate: `${angle}deg`, transformOrigin: '50%', transition: 'rotate 100ms' }}>
                <ellipse
                cx={459.789}
                cy={476.659}
                fill="none"
                rx={365.003}
                ry={296.967}
                style={{
                    fill: '#ebebeb',
                    fillOpacity: 0,
                    stroke: 'currentColor',
                    strokeWidth: '15.88px',
                }}
                transform="matrix(1.12427 0 0 1.38185 -4.929 -146.67)"
                />
                <path
                d="M512 512 223.86 800.14"
                style={{
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: 20,
                }}
                />
            </g>
        </svg>
    )
}

export default Knob;
