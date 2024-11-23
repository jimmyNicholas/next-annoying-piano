import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'
import DraggableInput from '@/_ui/DraggableInput';

describe('DraggableInput', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders with initial props', () => {
    const { getByText } = render(
      <DraggableInput
        label="Test Label"
        value={50}
        min={0}
        max={100}
        step={1}
      />
    )

    expect(getByText('Test Label')).toBeDefined()
    expect(getByText('50')).toBeDefined()
  })

  it('handles mouse wheel events correctly', () => {
    const onChange = vi.fn()
    const { container } = render(
      <DraggableInput
        value={50}
        min={0}
        max={100}
        step={1}
        onChange={onChange}
      />
    )

    const input = container.firstChild as HTMLElement
    
    // Test scroll up (increase)
    fireEvent.wheel(input, { deltaY: -100 })
    expect(onChange).toHaveBeenCalledWith(51)

    // Test scroll down (decrease)
    fireEvent.wheel(input, { deltaY: 100 })
    expect(onChange).toHaveBeenCalledWith(50)
  })

  it('respects min and max bounds', () => {
    const onChange = vi.fn()
    
    // Test minimum bound
    const { container } = render(
      <DraggableInput
        value={0}
        min={0}
        max={100}
        step={1}
        onChange={onChange}
      />
    )

    let input = container.firstChild as HTMLElement
    fireEvent.wheel(input, { deltaY: 100 })
    expect(onChange).toHaveBeenLastCalledWith(0)

    // Cleanup previous render
    cleanup()

    // Test maximum bound
    const { container: newContainer } = render(
      <DraggableInput
        value={100}
        min={0}
        max={100}
        step={1}
        onChange={onChange}
      />
    )
    
    input = newContainer.firstChild as HTMLElement
    fireEvent.wheel(input, { deltaY: -100 })
    expect(onChange).toHaveBeenLastCalledWith(100)
  })

  it('handles mouse drag correctly', () => {
    const onChange = vi.fn()
    const { container } = render(
      <DraggableInput
        value={50}
        min={0}
        max={100}
        step={1}
        onChange={onChange}
      />
    )

    const input = container.firstChild as HTMLElement

    // Start drag
    fireEvent.mouseDown(input)
    
    // Simulate drag up (decrease value)
    fireEvent.mouseMove(document, { movementY: 10 })
    
    // End drag
    fireEvent.mouseUp(document)

    // Verify value changed
    expect(onChange).toHaveBeenCalled()
  })

  it('handles different step values correctly', () => {
    const onChange = vi.fn()
    const { container } = render(
      <DraggableInput
        value={5}
        min={0}
        max={10}
        step={0.1}
        onChange={onChange}
      />
    )

    const input = container.firstChild as HTMLElement
    
    // Test scroll with decimal step
    fireEvent.wheel(input, { deltaY: 100 })
    expect(onChange).toHaveBeenCalledWith(4.9)
  })

  describe('display formatting', () => {
    it('formats integer values correctly', () => {
      const { getByText } = render(
        <DraggableInput
          value={5}
          min={0}
          max={10}
          step={1}
          onChange={() => {}}
        />
      )
      expect(getByText('5')).toBeDefined()
    })

    it('formats decimal values based on step precision', () => {
      const { getByText } = render(
        <DraggableInput
          value={5.5}
          min={0}
          max={10}
          step={0.1}
          onChange={() => {}}
        />
      )
      expect(getByText('5.5')).toBeDefined()
    })

    it('formats small decimal values correctly', () => {
      const { getByText } = render(
        <DraggableInput
          value={0.02}
          min={0}
          max={1}
          step={0.01}
          onChange={() => {}}
        />
      )
      expect(getByText('0.02')).toBeDefined()
    })

    it('handles large step values correctly', () => {
      const { getByText } = render(
        <DraggableInput
          value={100}
          min={0}
          max={1000}
          step={100}
          onChange={() => {}}
        />
      )
      expect(getByText('100')).toBeDefined()
    })
  })
})
