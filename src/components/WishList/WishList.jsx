/* eslint-disable react/prop-types */
import "./WishList.css";
import WishListItem from "./WishListItem";
import { FaWindowClose } from "react-icons/fa";

const WishList = ({
  onOpenWishList,
  wishList,
  onAddProductToCart,
  onDeleteWishListProduct,
  onClearWishList,
  addedProduct,
}) => {

  const wishListIsGreaterThanZero = wishList.length > 0;
  const emptyWishList = wishList.length === 0;
  const wishListContainerClasses = emptyWishList ? "h-screen" : "h-auto";
  return (
    <>
      <div className={`${wishListContainerClasses}`} data-aos="flip-up">
        <div className="w-full flex justify-between p-5 md:w-10/12 md:mx-auto">
          <p className="font-bold text-orange-500 text-sm md:text-lg lg:text-2xl">
            {emptyWishList ? "Your wish list is empty" : "Your wish list"}
          </p>
          <FaWindowClose
            className=" text-orange-500 text-lg md:text-2xl lg:text-4xl cursor-pointer"
            onClick={onOpenWishList}
          />
        </div>
        <div>
          {wishList.map((wishListItem) => (
            <WishListItem
              key={wishListItem.id}
              wishListItem={wishListItem}
              onAddProductToCart={onAddProductToCart}
              onDeleteWishListProduct={onDeleteWishListProduct}
              addedProduct={addedProduct}
            />
          ))}
        </div>

        <div className="w-full flex justify-center m-4 lg:m-8">
          {wishListIsGreaterThanZero && (
            <button
              className="border-2 border-orange-200 p-2 rounded-md text-sm text-red-400 md:text-lg"
              onClick={onClearWishList}
            >
              clear wish list
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default WishList;
