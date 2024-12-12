import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Midi } from '@tonejs/midi';
import parseMidiFile from '@/_services/parseMidiFile';

vi.mock('@tonejs/midi', () => ({
  Midi: vi.fn()
}));

const createMockFile = (content: ArrayBuffer): File => {
  return new File([content], 'test.midi', { type: 'audio/midi' });
};

describe('parseMidiFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully parse a valid MIDI file', async () => {
    // Create mock MIDI data
    const mockArrayBuffer = new ArrayBuffer(8);
    const mockFile = createMockFile(mockArrayBuffer);
    const mockMidiInstance = { tracks: [], name: 'Test MIDI' };
    
    // Mock the Midi constructor to return our mock instance
    (Midi as unknown as jest.Mock).mockImplementation(() => mockMidiInstance);

    const result = await parseMidiFile(mockFile);
    
    expect(result).toBe(mockMidiInstance);
    expect(Midi).toHaveBeenCalledWith(mockArrayBuffer);
  });

  it('should reject when no file is provided', async () => {
    await expect(parseMidiFile(null as unknown as File))
      .rejects
      .toThrow('No file provided');
  });

  it('should reject when an invalid file object is provided', async () => {
    await expect(parseMidiFile({} as File))
      .rejects
      .toThrow('Invalid file object');
  });

  it('should reject when FileReader fails to read the file', async () => {
    // Mock FileReader to simulate a read error
    const mockFileReader = {
      readAsArrayBuffer: vi.fn(),
      onerror: null as null | (() => void)
    };

    // Mock the global FileReader constructor
    const originalFileReader = global.FileReader;
    global.FileReader = vi.fn(() => mockFileReader) as unknown as typeof FileReader;

    const mockFile = createMockFile(new ArrayBuffer(8));
    const parsePromise = parseMidiFile(mockFile);

    // Simulate FileReader error
    if (mockFileReader.onerror) {
      mockFileReader.onerror();
    }

    await expect(parsePromise).rejects.toThrow('Error reading file');

    // Restore original FileReader
    global.FileReader = originalFileReader;
  });

  it('should reject when Midi constructor throws an error', async () => {
    const mockArrayBuffer = new ArrayBuffer(8);
    const mockFile = createMockFile(mockArrayBuffer);
    
    // Mock Midi constructor to throw an error
    (Midi as unknown as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid MIDI data');
    });

    await expect(parseMidiFile(mockFile))
      .rejects
      .toThrow('Invalid MIDI data');
  });

  it('should reject when FileReader result is not an ArrayBuffer', async () => {
    // Mock FileReader to return invalid result
    const mockFileReader = {
      readAsArrayBuffer: vi.fn(),
      onload: null as null | ((e: unknown) => void),
      result: 'invalid result' // Not an ArrayBuffer
    };

    // Mock the global FileReader constructor
    const originalFileReader = global.FileReader;
    global.FileReader = vi.fn(() => mockFileReader) as unknown as typeof FileReader;

    const mockFile = createMockFile(new ArrayBuffer(8));
    const parsePromise = parseMidiFile(mockFile);

    // Simulate FileReader load with invalid result
    if (mockFileReader.onload) {
      mockFileReader.onload({ target: mockFileReader });
    }

    await expect(parsePromise).rejects.toThrow('Failed to read file');

    // Restore original FileReader
    global.FileReader = originalFileReader;
  });
});
