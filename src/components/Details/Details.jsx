/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import "./Details.css";
import ProductDetails from "./ProductDetails";
import { FaWindowClose } from "react-icons/fa";

const Details = ({ onProductDetails, product }) => {
  const detailsRef = useRef(null);

  useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);
  return (
    <>
      <div ref={detailsRef}>
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
