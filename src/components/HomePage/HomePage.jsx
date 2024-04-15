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
    </>
  );
};
export default HomePage;
