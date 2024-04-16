import HomePage from "./components/HomePage/HomePage";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

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
      </main>
    </>
  );
}

export default App;
