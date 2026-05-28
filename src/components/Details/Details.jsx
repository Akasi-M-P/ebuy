/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import "./Details.css";
import ProductDetails from "./ProductDetails";
import { FaWindowClose } from "react-icons/fa";


const Details = ({
  onProductDetails,
  product,
  onAddProductToCart,
  onAddToWishList,
}) => {

  

  return (
    <>
      <div >
        <div className="h-full mb-10 block">
          <div className="flex flex-row-reverse px-8 py-4">
            <FaWindowClose
              className=" text-orange-500 text-xl md:text-2xl lg:text-4xl cursor-pointer"
              onClick={onProductDetails}
            />
          </div>
        </div>
        <div >
          <ProductDetails
            product={product}
            onProductDetails={onProductDetails}
            onAddProductToCart={onAddProductToCart}
            onAddToWishList={onAddToWishList}
          />
        </div>
      </div>
    </>
  );
};
export default Details;
