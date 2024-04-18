import { useState } from "react";
import Body from "../Body/Body";
import Footer from "../Footer/Footer";
import Hero from "../Hero/Hero";
import NavBar from "../NavBar/NavBar";
import "./HomePage.css";
import Cart from "../Cart/Cart";

const HomePage = () => {
  const [openCart, setOpenCart] = useState(false);

  function handleOpenCart() {
    setOpenCart((openCart) => !openCart);
  }
  return (
    <>
      <div>
        <NavBar OnOpenCart={handleOpenCart} />
      </div>
      {!openCart ? (
        <div>
          <Hero />
          <Body />
        </div>
      ) : (
        <Cart OnOpenCart={handleOpenCart} />
      )}

      <div>
        <Footer />
      </div>
    </>
  );
};
export default HomePage;
