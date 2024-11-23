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

const getDecimalPlaces = (num: number): number => {
    const match = String(num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) return 0;
    return Math.max(
        0,
        (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0)
    );
};

const getDisplayPrecision = (step: number): number => {
    if (step >= 1) return 0;
    return getDecimalPlaces(step);
};


const DraggableInput: React.FC<DraggableInputProps> = ({ label, onChange, value: inputValue, step, min, max }) => {
    /** Tracks the formatted display value */
    const [displayValue, setDisplayValue] = useState<number>(0);
    /** Tracks the current numeric value */
    const [value, setValue] = useState(inputValue || 0);
    const precision = getDisplayPrecision(step);

    const clampValue = useCallback((newValue: number): number => {
        const rounded = Math.round(newValue / step) * step;
        const fixed = Number(rounded.toFixed(precision));
        return Math.max(min, Math.min(max, fixed));
    }, [min, max, step, precision]);

    /**
     * Handles mouse wheel events to increment/decrement the value
     * @param e - Wheel event from the div element
    */
    const handleMouseWheel = useCallback<WheelEventHandler<HTMLDivElement>>(
        (e) => {
            const newValue = clampValue(
                value + (e.deltaY < 0 ? step : -step)
            );
            setValue(newValue);
        },
            //setValue(e.deltaY < 0 ? Math.max(min, value - step) : Math.min(max, value + step)),
        [step, value, clampValue]
    );

    /**
     * Updates the display value and triggers the onChange callback
     * @param v - New numeric value to be processed
    */
    const handleChange = useCallback(
        (v: number) => {
            const clampedValue = clampValue(v);
            onChange?.(clampedValue)
            setDisplayValue(Number(clampedValue.toFixed(precision)));
            //setDisplayValue(Math.round(v / step) / stepAdjustment)
        }, 
        [onChange, precision, clampValue]
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
                clampValue(prev + -e.movementY * ((max - min) / DRAGGING_DENOMINATOR))
                //Math.max(min, Math.min(max, prev + -e.movementY * ((max - min) / DRAGGING_DENOMINATOR)))
            );
        }, [clampValue, max, min]
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
        //handleChange(value)
        const clampedValue = clampValue(value);
        if (clampedValue !== value) {
            setValue(clampedValue);
        }
        handleChange(clampedValue);
    }, [handleChange, value, clampValue])

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
