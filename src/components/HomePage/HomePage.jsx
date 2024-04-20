import { useState } from "react";
import Body from "../Body/Body";
import Footer from "../Footer/Footer";
import Hero from "../Hero/Hero";
import NavBar from "../NavBar/NavBar";
import "./HomePage.css";
import Cart from "../Cart/Cart";
import WishList from "../WishList/WishList";
import Description from "../Description/Description";

const HomePage = () => {
  const [openCart, setOpenCart] = useState(false);
  const [openWishList, setOpenWishList] = useState(false);
  const [openProductDescription, setOpenProductDescription] = useState(false);

  function handleOpenCart() {
    setOpenCart((openCart) => !openCart);
    setOpenWishList(false);
  }

  function handleOpenWishList() {
    setOpenWishList((openWishList) => !openWishList);
    setOpenCart(false);
  }

  function handleOpenProductDescription() {
    setOpenProductDescription(
      (openProductDescription) => !openProductDescription
    );
  }
  return (
    <>
      <NavBar onOpenCart={handleOpenCart} onOpenWishList={handleOpenWishList} />

      {openCart && <Cart OnOpenCart={handleOpenCart} />}
      {openWishList && <WishList onOpenWishList={handleOpenWishList} />}
      {openProductDescription && (
        <Description onOpenProductDescription={handleOpenProductDescription} />
      )}
      {!openCart && !openWishList && !openProductDescription && (
        <>
          <Hero />
          <Body onOpenProductDescription={handleOpenProductDescription} />
        </>
      )}
      {/* <Description /> */}

      <Footer />
    </>
  );
};
export default HomePage;
