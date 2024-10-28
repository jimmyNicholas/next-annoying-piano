'use client';

import Header from "@/_layouts/Header";
import MainApp from "@/_components/MainApp";
import Footer from "@/_layouts/Footer";
import { MIDIProvider } from "@react-midi/hooks";

export default function Home() {
  return (
    <div className="grid grid-rows-[4%_92%_4%] w-full h-full">
      <Header/>
      <MIDIProvider>
        <MainApp/>
      </MIDIProvider>
      <Footer/>
    </div>
  );
}
