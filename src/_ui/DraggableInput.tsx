import { useCallback, useEffect, useState, WheelEventHandler } from "react";

interface DraggableInputProps {
    label?: string | number;
    min: number;
    max: number;
    onChange?: (value: number) => void;
    step: number;
    value: number | undefined;
}

const DRAGGING_DENOMINATOR = 200;

const DraggableInput: React.FC<DraggableInputProps> = ({ label, onChange, value: inputValue, step, min, max }) => {
    const [value, setValue] = useState(inputValue || 0);

    const handleMouseWheel = useCallback<WheelEventHandler<HTMLDivElement>>(
        (e) => setValue(e.deltaY < 0 ? Math.max(min, value - step) : Math.min(max, value + step)),
        [max, min, step, value]
    );

    const handleChange = useCallback(
        (v: number) => {
            onChange?.(v)
        }, 
        [onChange]
    );

    const handleDrag = useCallback(
        (e: MouseEvent) => {
            e.preventDefault()
            setValue((prev) => {
                const rawValue = prev + -e.movementY * ((max - min) / DRAGGING_DENOMINATOR);
                const steppedValue = parseFloat(rawValue.toFixed(2));
                return Math.max(min, Math.min(max, steppedValue));
            });
        }, [max, min]
    );

    const handleMouseUp = useCallback(() => {
        document.removeEventListener('mousemove', handleDrag)
        document.removeEventListener('mouseup', handleMouseUp)
    }, [handleDrag]);

    const handleMouseDown = useCallback(() => {
        document.addEventListener('mousemove', handleDrag)
        document.addEventListener('mouseup', handleMouseUp)
    }, [handleDrag, handleMouseUp]);

    useEffect(() => {
        handleChange(value)
    }, [handleChange, value])

    return (
        <div 
            className="flex select-none cursor-ns-resize"
            onWheel={handleMouseWheel}
            onMouseDown={handleMouseDown}
        >
            <div
                className="flex p-1"
            >
                <span className="w-16">{label}</span>
                <span className="font-mono min-w-10">{value}</span>
            </div>
        </div>
    );
};

export default DraggableInput;
