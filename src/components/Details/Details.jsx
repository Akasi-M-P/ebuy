/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import "./Details.css";
import ProductDetails from "./ProductDetails";
import { FaWindowClose } from "react-icons/fa";

const Details = ({ onProductDetails, product }) => {
  return (
    <>
      <div>
        <div className="h-full mb-10">
          <div className="flex flex-row-reverse p-5">
            <FaWindowClose
              className=" text-orange-500 text-lg md:text-2xl lg:text-4xl cursor-pointer"
              onClick={onProductDetails}
            />
          </div>
          <ProductDetails
            product={product}
            onProductDetails={onProductDetails}
          />
        </div>
      </div>
    </>
  );
};
export default Details;
