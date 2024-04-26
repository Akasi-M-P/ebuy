/* eslint-disable react/prop-types */
import { FaHeart } from "react-icons/fa6";
import { CiStar } from "react-icons/ci";

const ProductDetails = ({ product }) => {
  return (
    <>
      <div>
        <div className="flex flex-row-reverse px-5 py-4"></div>
        <div>
          <img src={product.image} alt={product.name} data-aos="flip-up" />
        </div>
        <div className="flex justify-between px-8">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-xl">{product.name}</p>
            <p className="font-bold text-lg text-orange-500">
              $ {product.price}
            </p>
            <p className="text-sm text-gray-400">In Stock</p>
          </div>
          <div className="flex flex-col gap-10">
            <div className="">
              <FaHeart className=" text-red-500 cursor-pointer text-2xl md:text-2xl lg:text-4xl" />
            </div>
            <div className="flex gap-2">
              <p>
                Rating(<span className="text-orange-500">3</span>)
              </p>
              <div className="flex items-center text-orange-500">
                <CiStar />
                <CiStar />
                <CiStar />
                <CiStar />
                <CiStar />
              </div>
            </div>
          </div>
        </div>
        <div className="details px-5 py-5">
          <div>
            <p className="font-bold">Description</p>
          </div>
          <div>
            <p>{product.description}</p>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <button className="border p-3  w-2/3 rounded-xl bg-orange-600">
            <p className="text-center text-lg text-white font-bold md:text-xl lg:text-2xl">
              Add to Cart
            </p>
          </button>
        </div>
      </div>
    </>
  );
};
export default ProductDetails;
