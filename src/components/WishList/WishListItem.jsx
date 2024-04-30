/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { BsFillCartCheckFill } from "react-icons/bs";
const WishListItem = ({
  wishListItem,
  onAddProductToCart,
  onDeleteWishListProduct,
  addedProduct,
}) => {
  const [markAddedToCartFromWish, setMarkAddedToCartFromWish] = useState(false);

  function addItemToCart() {
    onAddProductToCart(wishListItem);
    setMarkAddedToCartFromWish(true);
  }
  // const isAdded = addedProduct?.id === wishListItem.id;

  return (
    <>
      <React.Fragment key={wishListItem.id}>
        <div className="flex items-center gap-10 px-4 md:w-10/12 md:mx-auto md:gap-20 lg:justify-center lg:gap-32">
          <div className="w-2/5">
            <img src={wishListItem.image} alt="" className="md:h-48" />
          </div>
          <div className="flex flex-col gap-10 py-4">
            <div>
              <p className="font-bold text-sm md:text-lg lg:text-2xl">
                {wishListItem.name}
              </p>
            </div>
            <div>
              <p className="font-bold text-orange-500 text-sm md:text-lg lg:text-2xl">
                $ {wishListItem.price}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-10">
            <div>
              <button
                className="text-sm text-red-300 md:text-lg lg:text-2xl"
                onClick={() => onDeleteWishListProduct(wishListItem.id)}
              >
                remove
              </button>
            </div>
            <div className="">
              <button
                className="border-4 border-orange-200 px-5 py-2 text-sm md:text-lg rounded-md lg:text-2xl"
                onClick={addItemToCart}
              >
                {markAddedToCartFromWish ? (
                  <BsFillCartCheckFill className="text-orange-500 text-xl md:text-2xl" />
                ) : (
                  <FaCartPlus className="text-orange-500 text-xl" />
                )}
              </button>
            </div>
          </div>
        </div>
        <hr />
      </React.Fragment>
    </>
  );
};
export default WishListItem;
