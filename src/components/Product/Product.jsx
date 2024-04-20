/* eslint-disable react/prop-types */
import "./Product.css";
import { FaHeart } from "react-icons/fa6";
import { FaCartPlus } from "react-icons/fa";

const Product = ({ product }) => {
  return (
    <>
      <div className="product border rounded-md relative h-96  mt-4 md:border md:px-2 md:rounded-lg">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="h-64 object-contain mt-6"
          />
          <FaHeart className="absolute right-5 top-5 text-red-500 cursor-pointer text-2xl md:text-2xl lg:text-4xl" />
        </div>
        <div className="flex justify-between items-center px-2">
          <div className="flex flex-col gap-2 py-2">
            <p className="font-bold md:text-xl lg:text-2xl">{product.name}</p>
            <p className="text-orange-600 font-bold md:text-lg lg:text-xl">
              $ {product.price}
            </p>
          </div>
          <div className="">
            <button className="border-2 border-orange-200 px-2 py-2 text-sm md:text-lg rounded-md lg:text-2xl">
              <FaCartPlus className="text-orange-500 text-xl" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Product;
