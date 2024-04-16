/* eslint-disable react/prop-types */
import "./Product.css";
import { FaHeart } from "react-icons/fa6";

const Product = ({ product }) => {
  return (
    <>
      <div className="product relative h-96 mt-4 md:border md:px-2 md:rounded-lg">
        <div>
          <img src={product.image} alt={product.name} className="h-72" />
          <FaHeart className="absolute right-5 top-5 text-red-500 cursor-pointer text-2xl md:text-2xl lg:text-4xl" />
        </div>
        <div className="flex justify-between items-center px-5">
          <div className="flex flex-col gap-2 py-2">
            <p className="font-bold md:text-xl lg:text-2xl">{product.name}</p>
            <p className="text-orange-600 md:text-lg lg:text-xl">
              $ {product.price}
            </p>
          </div>
          <div>
            <button className="bg-orange-500 text-white font-bold px-6 py-1 rounded-md border-transparent md:text-lg lg:text-xl">
              Buy
            </button>
          </div>
        </div>
        <hr className="w-10/12 mx-auto text-orange-500 md:hidden" />
      </div>
    </>
  );
};
export default Product;