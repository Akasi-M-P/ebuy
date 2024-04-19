import { useState } from "react";
import Body from "../Body/Body";
import Footer from "../Footer/Footer";
import Hero from "../Hero/Hero";
import NavBar from "../NavBar/NavBar";
import "./HomePage.css";
import Cart from "../Cart/Cart";
import WishList from "../WishList/WishList";

const HomePage = () => {
  const [openCart, setOpenCart] = useState(false);
  const [openWishList, setOpenWishList] = useState(false);

  function handleOpenCart() {
    setOpenCart((openCart) => !openCart);
    setOpenWishList(false);
  }

  function handleOpenWishList() {
    setOpenWishList((openWishList) => !openWishList);
    setOpenCart(false);
  }
  return (
    <>
      <NavBar onOpenCart={handleOpenCart} onOpenWishList={handleOpenWishList} />

      {openCart && <Cart OnOpenCart={handleOpenCart} />}
      {openWishList && <WishList onOpenWishList={handleOpenWishList} />}
      {!openCart && !openWishList && (
        <>
          <Hero />
          <Body />
        </>
      )}

      <Footer />
    </>
  );
};
export default HomePage;
