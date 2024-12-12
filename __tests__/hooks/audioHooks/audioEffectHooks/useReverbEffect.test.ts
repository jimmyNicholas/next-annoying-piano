import { describe, it, expect, vi } from 'vitest';
import useReverbEffect from '@/_hooks/audioHooks/audioEffectHooks/useReverbEffect';

const mockReverbNode = {
    name: 'Reverb',
    get: () => ({ decay: 5, preDelay: 0.01, wet: 1 }),
    set: vi.fn(),
    dispose: vi.fn(),
    toDestination: function() { return this; }
};

const mockContextValue = {
    Reverb: vi.fn().mockImplementation(() => mockReverbNode)
  };

vi.mock('react', async () => {
    const actual = await vi.importActual('react');
    return {
      ...actual,
      useContext: () => mockContextValue,
      useRef: () => ({ current: mockReverbNode }),
      useEffect: vi.fn((cb) => cb())
    };
});

describe('useReverbEffect', () => {
    it('should return correct interface structure', () => {
        const { reverbInterface } = useReverbEffect();
        
        expect(reverbInterface.name).toBe('Reverb');
        expect(reverbInterface.options).toHaveLength(3);
        
        const optionNames = reverbInterface.options.map(opt => opt.name);
        expect(optionNames).toEqual(['decay', 'preDelay', 'wet']);
    });

    it('should have correct parameter ranges', () => {
        const { reverbInterface } = useReverbEffect();
        
        const decayOption = reverbInterface.options.find(opt => opt.name === 'decay');
        expect(decayOption).toMatchObject({
            title: 'Decay',
            min: 0.01,
            max: 10,
            step: 0.01
        });

        const preDelayOption = reverbInterface.options.find(opt => opt.name === 'preDelay');
        expect(preDelayOption).toMatchObject({
            title: 'Pre-Delay',
            min: 0.01,
            max: 10,
            step: 0.01
        });

        const wetOption = reverbInterface.options.find(opt => opt.name === 'wet');
        expect(wetOption).toMatchObject({
            title: 'Wet',
            min: 0,
            max: 1,
            step: 0.01
        });
    });

    it('should initialize with default values', () => {
        const { reverbInterface } = useReverbEffect();
        
        const decayValue = reverbInterface.options.find(opt => opt.name === 'decay')?.get();
        const preDelayValue = reverbInterface.options.find(opt => opt.name === 'preDelay')?.get();
        const wetValue = reverbInterface.options.find(opt => opt.name === 'wet')?.get();

        expect(decayValue).toBe(5);
        expect(preDelayValue).toBe(0.01);
        expect(wetValue).toBe(1);
    });

    it('should handle parameter updates', () => {
        const { reverbInterface } = useReverbEffect();
        
        reverbInterface.options.forEach(option => {
            expect(() => option.set(option.min)).not.toThrow();
            expect(() => option.set(option.max)).not.toThrow();
        });
    });
});
