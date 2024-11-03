'use client';

import Header from "@/_layouts/Header";
import MainApp from "@/_components/MainApp";
import Footer from "@/_layouts/Footer";
import { MIDIProvider } from "@react-midi/hooks";

export default function Home() {
  return (
    <div className="flex flex-col h-screen min-w-sm">
      <Header/>
      <MIDIProvider>
        <MainApp/>
      </MIDIProvider>
      <Footer/>
    </div>
  );
}
