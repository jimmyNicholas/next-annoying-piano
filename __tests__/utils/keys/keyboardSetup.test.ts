
import { describe, it, expect } from "vitest";
import { getKeys } from "@/_utils/keys/keyboardSetup";

describe('getKeys', () => {
    it('generates correct keys for a simple one-octave range', () => {
        const range = {
          startPitch: 'C',
          startOctave: 4,
          endPitch: 'C',
          endOctave: 5
        }
    
    const keys = getKeys(range);
        
    expect(keys.length).toBe(13) // C4 to C5 inclusive
    expect(keys[0]).toEqual({
        midiNumber: 72,
        name: 'C4',
        pitch: 'C',
        octave: 4
    })
    expect(keys[keys.length - 1]).toEqual({
        midiNumber: 84,
        name: 'C5',
        pitch: 'C',
        octave: 5
    })
    })

    it('handles ranges within the same octave', () => {
    const range = {
        startPitch: 'C',
        startOctave: 4,
        endPitch: 'G',
        endOctave: 4
    }

    const keys = getKeys(range)
    
    expect(keys.length).toBe(8) // C4 to G4 inclusive
    expect(keys[0].name).toBe('C4')
    expect(keys[keys.length - 1].name).toBe('G4')
    })

    it('generates correct MIDI numbers', () => {
    const range = {
        startPitch: 'A',
        startOctave: 4,
        endPitch: 'C',
        endOctave: 5
    }

    const keys = getKeys(range)
    
    expect(keys[0].midiNumber).toBe(81) // A4 = 81
    expect(keys[keys.length - 1].midiNumber).toBe(84) // C5 = 84
    })

    it('correctly handles octave transitions', () => {
    const range = {
        startPitch: 'A',
        startOctave: 4,
        endPitch: 'D',
        endOctave: 5
    }

    const keys = getKeys(range)
    
    const cIndex = keys.findIndex(key => key.pitch === 'C')
    expect(keys[cIndex].octave).toBe(5)
    expect(keys[cIndex - 1].octave).toBe(4)
    })

    it('throws error when start note is higher than end note', () => {
    const range = {
        startPitch: 'C',
        startOctave: 5,
        endPitch: 'A',
        endOctave: 4
    }

    expect(() => getKeys(range)).toThrow('Invalid input')
    })

    it('handles chromatic notes correctly', () => {
    const range = {
        startPitch: 'C',
        startOctave: 4,
        endPitch: 'F#',
        endOctave: 4
    }

    const keys = getKeys(range)
    
    // Check if F# is included and has correct properties
    const fSharp = keys.find(key => key.pitch === 'F#')
    expect(fSharp).toBeDefined()
    expect(fSharp?.name).toBe('F#4')
    })

    it('generates correct number of keys for multi-octave range', () => {
    const range = {
        startPitch: 'C',
        startOctave: 4,
        endPitch: 'C',
        endOctave: 6
    }

    const keys = getKeys(range)
    expect(keys.length).toBe(25) // Two octaves = 24 semitones + 1 for inclusive end
    })
})