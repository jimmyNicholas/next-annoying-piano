'use client';

import OptionsPanel from "./optionsPanel/OptionsPanel";
import Keyboard from "./Keyboard";
import { KeyboardProps, OptionsPanelProps, QwertyInputProps } from '@/_lib/_types/types';
import { useEffect, useRef, useState } from "react";
import { useQwertyInput } from "@/_hooks/useQwertyInput";
import { modes } from "@/_lib/_data/modes";
import useAudio from "@/_hooks/useAudio";
import useKeyboard from "@/_hooks/useKeyboard";
import useMode from "@/_hooks/useMode";
import useMidiController from "@/_hooks/useMidiController";

import { Midi } from "@tonejs/midi";

const MainApp: React.FC = () => {
   
    const { loadAudio, audioIsLoaded, audioService } = useAudio();
    const { mode, updateMode, onModChange } = useMode(onReset);
    const keyboardRange = {startPitch: 'A', startOctave: 0, endPitch: 'C', endOctave: 8};
    const { keys, resetHertzTable, keyHandlers} = useKeyboard(keyboardRange, audioIsLoaded, audioService, mode);

    function onReset() {
        resetHertzTable();
    };

    const isQwertyEnabled = useRef(false);
    const toggleIsQwertyEnabled = () => { 
        isQwertyEnabled.current = !isQwertyEnabled.current 
    };
    const checkIsQwertyEnabled = (): boolean => { 
        return isQwertyEnabled.current };

    const qwertyInputProps: QwertyInputProps = {
        checkIsQwertyEnabled,
        octaveRange: {
            octaveMin: keyboardRange.startOctave,
            currentOctave: 2,
            octaveMax: keyboardRange.endOctave
        },
        keyHandlers,
    };
    useQwertyInput(qwertyInputProps);
    useMidiController(keys, keyHandlers);

    // Midi Player
    const [playMidiTrack, setPlayMidiTrack] = useState(false);
    function startSongOn() {
        setPlayMidiTrack(true);
    };

    let songEvents: any = [];
    function handleMidiData(parsedMidi: any) {
        songEvents = parsedMidi;
        //console.log('Parsed Midi', parsedMidi);
    }

    const [midiData, setMidiData] = useState<Midi | null>(null);
    
    function handleMidiUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) {return};
        const file = e.target.files[0];
        if (!file) {return};
        const reader = new FileReader();
        reader.onload = async (e) => {
            if (!(e.target && e.target.result instanceof ArrayBuffer)) return;
            const arrayBuffer = e.target.result;
            const midi = new Midi(arrayBuffer);
            setMidiData(midi);
        }
        reader.readAsArrayBuffer(file);
    }
    
    function getSongEvents(song: any) {
        if (!song) { return };
        let songEvents: any = [];
        song.forEach((note: any) => {
            songEvents.push({ type: 'start', time: note.time, note });
            songEvents.push({ type: 'end', time: note.duration + note.time, note });
        });
        return songEvents;
    }

    useEffect(() => {
        if(!midiData) { return };
        let songEvents: any = [];
        const tracks = [midiData.tracks[0]];
        tracks.forEach((track) => {
            const events = getSongEvents(track.notes);
            songEvents = [...songEvents, ...events]
        });
        songEvents.sort((a: any, b: any) => a.time - b.time);
        handleMidiData(songEvents)
    }, [midiData, handleMidiData]);

    const [songIndex, setSongIndex] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());

    async function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(() => {
        let isMounted = true; 
        const playNextSongEvent = async () => {
            if(playMidiTrack && songIndex < songEvents.length) {
                const currentEvent = songEvents[songIndex];

                const elapsedTime = (Date.now() - startTime) / 1000;
                const waitTime = (currentEvent.time - elapsedTime) * 1000;
                if (waitTime > 0) {
                    await delay(waitTime);
                }
                console.log(currentEvent.note.name);
                const key = currentEvent.note.name;
                if (currentEvent.type === 'start') {
                    keyHandlers.onKeyDown(key);
                } else if (currentEvent.type === 'end') {
                    keyHandlers.onKeyUp(key);
                }
                if (isMounted) {
                    setSongIndex((prevIndex) => prevIndex + 1);
                }
            }
        }
        playNextSongEvent();
    }, [playMidiTrack, songEvents, songIndex, startTime, keyHandlers]);
    
    useEffect(() => {
        if (playMidiTrack) {
            setStartTime(Date.now());
        }
    }, [playMidiTrack]);

    // Midi Player

    const optionsPanelProps: OptionsPanelProps = {
        globalProps: { loadAudio, audioIsLoaded, onReset},
        inputProps: { checkIsQwertyEnabled, toggleIsQwertyEnabled},
        modeProps: { mode: mode, updateMode, onModChange, maxModes: modes.length - 1}
    };

    const keyboardProps: KeyboardProps = { 
        keys, 
        keyHandlers,
    };

    return (
        <div className="border-2 border-black">
            <OptionsPanel {...optionsPanelProps} />
            <button onClick={startSongOn}>Start</button>
            <input type="file" accept=".mid, .midi" onChange={handleMidiUpload} />
            <Keyboard {...keyboardProps} />
        </div>
    );
};

export default MainApp;
