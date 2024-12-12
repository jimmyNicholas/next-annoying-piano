import { describe, it, expect, vi } from 'vitest';
import useVibratoEffect from '@/_hooks/audioHooks/audioEffectHooks/useVibratoEffect';

const mockVibratoNode = {
    name: 'Vibrato',
    get: () => ({ frequency: 5, depth: 0.1, wet: 0 }),
    set: vi.fn(),
    dispose: vi.fn(),
    toDestination: function() { return this; }
};

const mockContextValue = {
    Vibrato: vi.fn().mockImplementation(() => mockVibratoNode)
};

vi.mock('react', async () => {
    const actual = await vi.importActual('react');
    return {
        ...actual,
        useContext: () => mockContextValue,
        useRef: () => ({ current: mockVibratoNode }),
        useEffect: vi.fn((cb) => cb())
    };
});

describe('useVibratoEffect', () => {
    it('should return correct interface structure', () => {
        const { vibratoInterface } = useVibratoEffect();
        expect(vibratoInterface.name).toBe('Vibrato');
        expect(vibratoInterface.options).toHaveLength(3);
        const optionNames = vibratoInterface.options.map(opt => opt.name);
        expect(optionNames).toEqual(['frequency', 'depth', 'wet']);
    });

    it('should have correct parameter ranges', () => {
        const { vibratoInterface } = useVibratoEffect();
        
        const frequencyOption = vibratoInterface.options.find(opt => opt.name === 'frequency');
        expect(frequencyOption).toMatchObject({
        title: 'Frequency',
        min: 1,
        max: 100,
        step: 1
        });

        const depthOption = vibratoInterface.options.find(opt => opt.name === 'depth');
        expect(depthOption).toMatchObject({
        title: 'Depth',
        min: 0,
        max: 1,
        step: 0.01
        });

        const wetOption = vibratoInterface.options.find(opt => opt.name === 'wet');
        expect(wetOption).toMatchObject({
        title: 'Wet',
        min: 0,
        max: 1,
        step: 0.01
        });
    });

    it('should initialize with default values', () => {
        const { vibratoInterface } = useVibratoEffect();
        const frequencyValue = vibratoInterface.options.find(opt => opt.name === 'frequency')?.get();
        const depthValue = vibratoInterface.options.find(opt => opt.name === 'depth')?.get();
        const wetValue = vibratoInterface.options.find(opt => opt.name === 'wet')?.get();

        expect(frequencyValue).toBe(5);
        expect(depthValue).toBe(0.1);
        expect(wetValue).toBe(0);
    });

    it('should handle parameter updates', () => {
        const { vibratoInterface } = useVibratoEffect();
        vibratoInterface.options.forEach(option => {
        expect(() => option.set(option.min)).not.toThrow();
        expect(() => option.set(option.max)).not.toThrow();
        });
    });
});