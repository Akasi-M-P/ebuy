/* eslint-disable react/prop-types */
import "./Product.css";
import { FaHeart } from "react-icons/fa6";
import { FaCartPlus, FaRegHeart } from "react-icons/fa";
import { BsFillCartCheckFill } from "react-icons/bs";
import { useState } from "react";

const Product = ({
  product,
  onProductClick,
  onAddProductToCart,
  onAddedProduct,
  addedProduct,
  onAddToWishList,
}) => {
  const [markedAdded, setMarkedAdded] = useState(false);
  const [markedWished, setMarkedWish] = useState(false);
  // handle product click and adding to cart
  function handleAddProduct() {
    onAddProductToCart(product);
    onAddedProduct(product);
    setMarkedAdded(true);

    setTimeout(() => {
      setMarkedAdded(false);
    }, 3000);
  }

  // Handle adding product to wishlist
  function handleAddToWishList() {
    onAddToWishList(product);
    setMarkedWish(true);
  }

  const isAdded = addedProduct?.id === product.id;

  return (
    <>
      <div>
        <div className="product border cursor-pointer rounded-md relative h-96  mt-4 md:border md:px-2 md:rounded-lg">
          <div className="mb-14">
            {!markedWished ? (
              <FaRegHeart
                className="absolute right-5 top-5 text-red-500 cursor-pointer text-2xl md:text-2xl lg:text-4xl"
                onClick={handleAddToWishList}
              />
            ) : (
              <FaHeart
                className="absolute right-5 top-5 text-red-500 cursor-pointer text-2xl md:text-2xl lg:text-4xl"
                onClick={handleAddToWishList}
              />
            )}
          </div>
          <div onClick={() => onProductClick(product)}>
            <img
              src={product.image}
              alt={product.name}
              className="h-64 object-contain mt-6"
            />
          </div>
          <div className="flex justify-between items-center px-2">
            <div className="flex flex-col gap-2 py-2">
              <p className="font-bold md:text-xl lg:text-2xl">{product.name}</p>
              <p className="text-orange-600 font-bold md:text-lg lg:text-xl">
                $ {product.price}
              </p>
            </div>
            <div className="relative">
              <div className="absolute text-orange-500 -top-8 -left-4 lg:-top-8 lg:left-4 font-bold text-lg">
                {isAdded && markedAdded && "Added"}
              </div>

              <button className="border-2 border-orange-200 px-2 py-2 md:px-8 md:py-4 text-sm md:text-lg rounded-md lg:text-2xl">
                {isAdded && markedAdded ? (
                  <BsFillCartCheckFill className="text-orange-500 text-xl md:text-2xl" />
                ) : (
                  <FaCartPlus
                    className="text-orange-500 text-xl md:text-2xl"
                    onClick={handleAddProduct}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Product;
