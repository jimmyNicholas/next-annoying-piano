import { useCallback, useEffect, useState, WheelEventHandler } from "react";

/**
 * A numeric input component that can be adjusted through dragging, mouse wheel, or direct input.
 * Supports value constraints and step-based increments.
 * 
 * @component
 * @example
 * ```tsx
 * <DraggableInput
 *   label="Volume"
 *   min={0}
 *   max={100}
 *   step={1}
 *   value={50}
 *   onChange={(value) => console.log('New value:', value)}
 * />
 * ```
 */
interface DraggableInputProps {
    /** Optional label to display above the input value */
    label?: string | number;
    /** Minimum allowed value */
    min: number;
    /** Maximum allowed value */
    max: number;
    /** Callback function triggered when the value changes */
    onChange?: (value: number) => void;
    /** Step increment for value changes */
    step: number;
    /** Current value of the input */
    value: number | undefined;
}

/** Denominator used to control drag sensitivity */
const DRAGGING_DENOMINATOR = 200;

const DraggableInput: React.FC<DraggableInputProps> = ({ label, onChange, value: inputValue, step, min, max }) => {
    /** Tracks the formatted display value */
    const [displayValue, setDisplayValue] = useState<number>(0);
    /** Tracks the current numeric value */
    const [value, setValue] = useState(inputValue || 0);

    /**
     * Handles mouse wheel events to increment/decrement the value
     * @param e - Wheel event from the div element
    */
    const handleMouseWheel = useCallback<WheelEventHandler<HTMLDivElement>>(
        (e) => setValue(e.deltaY < 0 ? Math.max(min, value - step) : Math.min(max, value + step)),
        [max, min, step, value]
    );

    /**
     * Updates the display value and triggers the onChange callback
     * @param v - New numeric value to be processed
    */
    const handleChange = useCallback(
        (v: number) => {
            onChange?.(v)
            const stepAdjustment = step !== 1 ? 100 : 1;
            setDisplayValue(Math.round(v / step) / stepAdjustment)
        }, 
        [onChange, step]
    );

    /**
     * Processes mouse movement during drag operations
     * Calculates new value based on vertical mouse movement
     * @param e - Mouse event containing movement data
    */
    const handleDrag = useCallback(
        (e: MouseEvent) => {
            e.preventDefault()
            setValue((prev) => 
                Math.max(min, Math.min(max, prev + -e.movementY * ((max - min) / DRAGGING_DENOMINATOR)))
            );
        }, [max, min]
    );

    /**
     * Removes drag-related event listeners when dragging ends
    */
    const handleMouseUp = useCallback(() => {
        document.removeEventListener('mousemove', handleDrag)
        document.removeEventListener('mouseup', handleMouseUp)
    }, [handleDrag]);

    /**
     * Initializes drag-related event listeners when dragging starts
    */
    const handleMouseDown = useCallback(() => {
        document.addEventListener('mousemove', handleDrag)
        document.addEventListener('mouseup', handleMouseUp)
    }, [handleDrag, handleMouseUp]);

    /**
     * Updates display value whenever the internal value changes
    */
    useEffect(() => {
        handleChange(value)
    }, [handleChange, value])

    return (
        <div 
            className="select-none cursor-ns-resize rounded-lg"
            onWheel={handleMouseWheel}
            onMouseDown={handleMouseDown}
        >
            <div
                className="flex flex-col justify-between items-center"
            >
                <span>{label}</span>
                <span 
                    className="font-mono text-right"
                    style={{ width: '6ch' }}
                >{displayValue}</span>
            </div>
        </div>
    );
};

export default DraggableInput;
