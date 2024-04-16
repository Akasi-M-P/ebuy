import Body from "../Body/Body";
import Footer from "../Footer/Footer";
import Hero from "../Hero/Hero";
import NavBar from "../NavBar/NavBar";
import "./HomePage.css";

const HomePage = () => {
  return (
    <>
      <div>
        <NavBar />
      </div>
      <div>
        <Hero />
      </div>
      <div>
        <Body />
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};
export default HomePage;
