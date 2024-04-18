/* eslint-disable react/prop-types */
import "./Cart.css";
import CartItem from "./CartItem";
import { FaWindowClose } from "react-icons/fa";

const Cart = ({ OnOpenCart }) => {
  return (
    <>
      <div className="h-screen" data-aos="flip-up">
        <div className="w-full flex justify-between p-5">
          <p className="font-bold text-orange-500">Your Cart Items</p>
          <FaWindowClose
            className=" text-orange-500 text-lg"
            onClick={OnOpenCart}
          />
        </div>
        <div>
          <CartItem />
        </div>
        <div className="m-4">
          <p className="text-sm text-center font-bold">
            <span>Subtotal : </span>$ 32000.00
          </p>
        </div>
        <div className="w-full flex justify-center">
          <button className="border p-2  w-2/3 rounded-xl bg-orange-600">
            <p className="text-center text-lg text-white font-bold">
              Proceed to checkout
            </p>
          </button>
        </div>
        <div className="w-full flex justify-center m-4">
          <button className="text-sm text-red-400">Clear cart</button>
        </div>
      </div>
    </>
  );
};
export default Cart;
