import { useState } from "react";
import { products } from "/src/components/Data/Data";
import Body from "../Body/Body";
import Footer from "../Footer/Footer";
import Hero from "../Hero/Hero";
import NavBar from "../NavBar/NavBar";
import "./HomePage.css";
import Cart from "../Cart/Cart";
import WishList from "../WishList/WishList";
import Details from "../Details/Details";
import { useEffect, useRef } from "react";

const HomePage = () => {
  const [openCart, setOpenCart] = useState(false);
  const [openWishList, setOpenWishList] = useState(false);
  const [openProductDetails, setOpenProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  function handleOpenCart() {
    setOpenCart((openCart) => !openCart);
    setOpenWishList(false);
  }

  function handleOpenWishList() {
    setOpenWishList((openWishList) => !openWishList);
    setOpenCart(false);
  }

  function handleProductDetails() {
    setOpenProductDetails((openProductDetails) => !openProductDetails);
    console.log("close details page");
    setSelectedProduct((productSelected) => !productSelected);
  }

  function handleProductClick(product) {
    setSelectedProduct(product);
  }

  const detailsRef = useRef(null);

  useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  return (
    <>
      <div ref={detailsRef}>
        <NavBar
          onOpenCart={handleOpenCart}
          onOpenWishList={handleOpenWishList}
        />

        {openCart && <Cart OnOpenCart={handleOpenCart} />}
        {openWishList && <WishList onOpenWishList={handleOpenWishList} />}
        {selectedProduct && (
          <Details
            onProductDetails={handleProductDetails}
            product={selectedProduct}
          />
        )}
        {!openCart &&
          !openWishList &&
          !openProductDetails &&
          !selectedProduct && (
            <>
              <Hero />
              <Body
                products={products}
                onProductDetails={handleProductDetails}
                onProductClick={handleProductClick}
              />
            </>
          )}

        <Footer />
      </div>
    </>
  );
};
export default HomePage;
