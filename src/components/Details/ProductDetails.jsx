/* eslint-disable react/prop-types */
import { FaHeart } from "react-icons/fa6";
import { CiStar } from "react-icons/ci";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';

// import required modules
import { EffectCube, Pagination } from 'swiper/modules';

const ProductDetails = ({ product }) => {
  return (
    <>
      <div>
        <div className="md:flex md:justify-center md:gap-5 md:px-8">
          <div className="mb-10 lg:w-1/2">
            <Swiper
              effect={"cube"}
              grabCursor={true}
              cubeEffect={{
                shadow: true,
                slideShadows: true,
                shadowOffset: 20,
                shadowScale: 0.94,
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
          <div className="flex justify-between px-8 md:flex-col md:justify-center md:gap-16 md:px-10 border-l md:shadow-sm lg:w-1/2">
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
                <FaHeart className=" text-red-500 cursor-pointer text-2xl md:text-3xl lg:text-4xl" />
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
        <div className="details px-5 py-5 lg:px-20">
          <div>
            <p className="font-bold md:text-xl lg:text-2xl">Description</p>
          </div>
          <div>
            <p className="md:text-lg lg:text-xl">{product.description}</p>
          </div>
        </div>
        <div className="w-full flex justify-center lg:mt-28 lg:mb-28">
          <button className="border p-3  w-2/3 rounded-xl bg-orange-600 lg:w-2/4">
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
