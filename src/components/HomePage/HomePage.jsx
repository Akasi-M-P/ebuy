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
  const [cart, setCart] = useState([]);
  const [addedProduct, setAddedProduct] = useState(null);

  // Calculates Cart length
  const cartLength = cart.length;

  // Opens cart
  function handleOpenCart() {
    setOpenCart((openCart) => !openCart);
    setOpenWishList(false);
    setOpenProductDetails(false);
  }

  // Opens wishlist
  function handleOpenWishList() {
    setOpenWishList((openWishList) => !openWishList);
    setOpenCart(false);
    setOpenProductDetails(false);
  }

  // Opens product details
  function handleProductClick(product) {
    setSelectedProduct(product);
    setOpenProductDetails(true);
  }

  // Closes product details
  function handleCloseProductDetails() {
    setOpenProductDetails((closeProduct) => !closeProduct);
    console.log("close");
  }

  // Adds a new product to the Cart list
  function handleAddProductToCart(product) {
    // Check whether product already exists in cart
    const isProductInCart = cart.some(
      (productItem) => productItem.id === product.id
    );
    if (isProductInCart) {
      // If product already exists, just update quantity
      const updatedCart = cart.map((cartItem) =>
        cartItem.id === product.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCart(updatedCart);
      console.log(updatedCart);
    } else {
      // If product does not exist in the cart, add it with a quantity of 1
      setCart((prevCart) => {
        const updatedCart = [...prevCart, { ...product, quantity: 1 }];
        console.log(updatedCart);
        return updatedCart;
      });
    }
  }

  // Checks products clicked or added
  function handleAddedProduct(product) {
    setAddedProduct((curProduct) =>
      curProduct?.id === product.id ? null : product
    );
  }

  return (
    <>
      <div>
        <NavBar
          onOpenCart={handleOpenCart}
          onOpenWishList={handleOpenWishList}
          cartLength={cartLength}
        />

        {openCart && <Cart OnOpenCart={handleOpenCart} cartProducts={cart} />}
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
            <Body
              products={products}
              onProductClick={handleProductClick}
              onAddProductToCart={handleAddProductToCart}
              onAddedProduct={handleAddedProduct}
            />
          </>
        )}

        <Footer />
      </div>
    </>
  );
};
export default HomePage;
