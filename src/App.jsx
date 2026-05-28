import HomePage from "./components/HomePage/HomePage";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Footer from "./components/Footer/Footer";

function App() {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <>
      <main>
        <div>
          <HomePage />
        </div>
        <div>
          <Footer />
        </div>
      </main>
    </>
  );
}

export default App;
