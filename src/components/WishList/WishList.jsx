/* eslint-disable react/prop-types */
import "./WishList.css";
import WishListItem from "./WishListItem";
import { FaWindowClose } from "react-icons/fa";

const WishList = ({ onOpenWishList }) => {
  return (
    <>
      <div className="h-full" data-aos="flip-up">
        <div className="w-full flex justify-between p-5 md:w-10/12 md:mx-auto">
          <p className="font-bold text-orange-500 text-sm md:text-lg lg:text-2xl">
            Your wish list Items
          </p>
          <FaWindowClose
            className=" text-orange-500 text-lg md:text-2xl lg:text-4xl cursor-pointer"
            onClick={onOpenWishList}
          />
        </div>
        <div>
          <WishListItem />
        </div>
        <div className="m-4">
          <p className="text-sm text-center font-bold md:text-xl lg:text-2xl">
            <span>Subtotal : </span>$ 32000.00
          </p>
        </div>
        <div className="w-full flex justify-center">
          <button className="border p-3  w-2/3 rounded-xl bg-orange-600">
            <p className="text-center text-lg text-white font-bold md:text-xl lg:text-2xl">
              Proceed to checkout
            </p>
          </button>
        </div>
        <div className="w-full flex justify-center m-4 lg:m-8">
          <button className="text-sm text-red-400 md:text-lg">
            ClearWishList
          </button>
        </div>
      </div>
    </>
  );
};
export default WishList;
