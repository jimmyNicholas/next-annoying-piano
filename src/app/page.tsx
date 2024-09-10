import Header from "@/_layouts/Header";
import MainApp from "@/_components/MainApp";
import Footer from "@/_layouts/Footer";

export default function Home() {
  return (
    <div className="grid grid-rows-[12%_80%_8%] h-lvh">
      <Header/>
      <MainApp/>
      <Footer/>
    </div>
  );
}
