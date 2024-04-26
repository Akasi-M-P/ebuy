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


  function handleProductClick(product) {
    setSelectedProduct(product);
    setOpenProductDetails(true);
  }

  function handleCloseProductDetails() {
    setOpenProductDetails((closeProduct) => !closeProduct);
    console.log("close");
  }

  return (
    <>
      <div>
        <NavBar
          onOpenCart={handleOpenCart}
          onOpenWishList={handleOpenWishList}
        />

        {openCart && <Cart OnOpenCart={handleOpenCart} />}
        {openWishList && <WishList onOpenWishList={handleOpenWishList} />}
        {selectedProduct && openProductDetails && (
          <Details
            onProductDetails={handleCloseProductDetails}
            product={selectedProduct}
          />
        )}
        {!openCart && !openWishList && !openProductDetails && (
          <>
            <Hero />
            <Body products={products} onProductClick={handleProductClick} />
          </>
        )}

        <Footer />
      </div>
    </>
  );
};
export default HomePage;
