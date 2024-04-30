/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { FaHeart } from "react-icons/fa6";
import { CiStar } from "react-icons/ci";
import { FaRegHeart } from "react-icons/fa";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";

// import required modules
import { EffectCube, Pagination } from "swiper/modules";
import { useState } from "react";

const ProductDetails = ({ product, onAddProductToCart, onAddToWishList }) => {
  const [marked, setMarked] = useState(false);
  const [markWish, setMarkWish] = useState(false);
  const boxAvailable = product.box?.length > 0;

  function addToCart() {
    onAddProductToCart();
    setMarked(true);

    setTimeout(() => {
      setMarked(false);
    }, 2000);
  }

  function addToWishList() {
    onAddToWishList(product);
    setMarkWish(true);
  }
  return (
    <>
      <div>
        <div className="md:flex md:justify-center md:gap-5 md:px-8">
          <div className="mb-10 md:w-1/2 lg:w-1/2">
            <Swiper
              effect={"cube"}
              grabCursor={true}
              cubeEffect={{
                shadow: true,
                slideShadows: true,
                shadowOffset: 20,
                shadowScale: 0,
              }}
              pagination={true}
              modules={[EffectCube, Pagination]}
              className="mySwiper"
            >
              <SwiperSlide>
                <img
                  src={product.image}
                  alt={product.name}
                  className="lg:w-2/4 lg:mx-auto"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src={product.image}
                  alt={product.name}
                  className="lg:w-2/4 lg:mx-auto"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src={product.image}
                  alt={product.name}
                  className="lg:w-2/4 lg:mx-auto"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src={product.image}
                  alt={product.name}
                  className="lg:w-2/4 lg:mx-auto"
                />
              </SwiperSlide>
            </Swiper>
          </div>
          <div className="flex justify-between px-8 md:flex-col md:justify-center md:gap-16 md:px-10 border-l md:shadow-sm md:w-2/6 lg:w-1/2">
            <div className="flex flex-col gap-2">
              <p className="font-bold text-xl md:text-2xl lg:text-3xl">
                {product.name}
              </p>
              <p className="font-bold text-lg text-orange-500 md:text-xl lg:text-2xl">
                $ {product.price}
              </p>
              <p className="text-sm text-gray-400 md:text-lg lg:text-xl">
                In Stock
              </p>
            </div>
            <div className="flex flex-col gap-10">
              <div className="">
                {markWish ? (
                  <FaHeart
                    className=" text-red-500 cursor-pointer text-2xl md:text-3xl lg:text-4xl"
                    onClick={addToWishList}
                  />
                ) : (
                  <FaRegHeart
                    className=" text-red-500 cursor-pointer text-2xl md:text-3xl lg:text-4xl"
                    onClick={addToWishList}
                  />
                )}
              </div>
              <div className="flex gap-2 md:text-lg lg:text-2xl">
                <p>
                  Rating(
                  <span className="text-orange-500 ">3</span>)
                </p>
                <div className="flex items-center text-orange-500 md:text-lg lg:text-2xl">
                  <CiStar />
                  <CiStar />
                  <CiStar />
                  <CiStar />
                  <CiStar />
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="description px-5 py-5 lg:px-20">
          <div>
            <p className="font-bold md:text-xl lg:text-2xl">Description</p>
          </div>
          <div>
            <p className="md:text-lg lg:text-xl">{product.description}</p>
          </div>
        </div>
        <hr />
        <div className="In-Box  px-5 py-5 lg:px-20">
          <div>
            {boxAvailable ? (
              <p className="font-bold md:text-xl lg:text-2xl">In-Box</p>
            ) : (
              ""
            )}
          </div>
          <div>
            <ul className="md:text-lg lg:text-xl">
              {product.box?.map((item, index) => (
                <li key={index}>
                  <span>-</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <hr />
        <div className="reviews px-5 py-5 lg:px-20 flex flex-col gap-5">
          <div className="my-2">
            <p className="font-bold md:text-xl lg:text-2xl">Reviews</p>
          </div>
          <hr />
          <div className="review  px-4 py-2">
            <div className=" flex justify-between my-2">
              <div className="flex items-center text-orange-500 md:text-lg lg:text-2xl">
                <CiStar />
                <CiStar />
                <CiStar />
                <CiStar />
                <CiStar />
              </div>
              <p className="md:text-lg lg:text-xl">24/12/2023</p>
            </div>
            <div className="">
              <p className="text-md md:text-lg lg:text-xl">
                The XYZ Gaming Headset delivers immersive sound, perfect for
                gaming marathons. Comfortable fit and reliable performance make
                it a top choice for gamers.
              </p>
              <p className="text-sm font-bold text-green-400 my-2 md:text-lg lg:text-xl">
                by Sarah
              </p>
            </div>
          </div>
          <hr />
          <div className="review  px-4 py-2 ">
            <div className=" flex justify-between my-2">
              <div className="flex items-center text-orange-500 md:text-lg lg:text-2xl">
                <CiStar />
                <CiStar />
                <CiStar />
                <CiStar />
                <CiStar />
              </div>
              <p className="md:text-lg lg:text-xl">24/12/2023</p>
            </div>
            <div className="">
              <p className="text-md md:text-lg lg:text-xl">
                ABC Laptop is a powerhouse with lightning-fast speeds and a
                long-lasting battery. Sleek design and user-friendly interface
                make it a pleasure to use.
              </p>
              <p className="text-sm font-bold text-green-400 my-2 md:text-lg lg:text-xl">
                by David
              </p>
            </div>
          </div>
          <hr />
          <div className="review px-4 py-2 ">
            <div className=" flex justify-between my-2">
              <div className="flex items-center text-orange-500 md:text-lg lg:text-2xl">
                <CiStar />
                <CiStar />
                <CiStar />
                <CiStar />
                <CiStar />
              </div>
              <p className="md:text-lg lg:text-xl">24/12/2023</p>
            </div>
            <div className="">
              <p className="text-md md:text-lg lg:text-xl">
                QRS Wireless Speakers offer impressive audio quality with deep
                bass and crystal-clear highs. Easy setup and stylish design
                elevate any entertainment setup.
              </p>
              <p className="text-sm font-bold text-green-400 my-2 md:text-lg lg:text-xl">
                by Kwame
              </p>
            </div>
          </div>
          <hr />
        </div>
        <div className="w-full flex justify-center my-5 lg:mt-28 lg:mb-28">
          <button
            className="border p-3  w-2/3 rounded-xl bg-orange-600 lg:w-2/4"
            onClick={addToCart}
          >
            <p className="text-center text-lg text-white font-bold md:text-xl lg:text-2xl">
              {marked ? "Product Added" : "Add to Cart"}
            </p>
          </button>
        </div>
      </div>
    </>
  );
};
export default ProductDetails;
