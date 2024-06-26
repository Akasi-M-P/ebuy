import "./Hero.css";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

const Hero = () => {
  return (
    <div className="lg:bg-orange-100">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={false}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img
            src="/assets/heroimage1.jpg"
            alt="hero_image"
            className="md:w-full lg:w-3/5 lg:h-screen lg:mx-auto object-contain"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="/assets/heroimage2.jpg"
            alt="hero_image"
            className="md:w-full lg:w-3/5 lg:h-screen lg:mx-auto object-contain"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="/assets/heroimage3.png"
            alt="hero_image"
            className="md:w-full lg:w-3/5 lg:h-screen lg:mx-auto object-contain"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="/assets/heroimage4.jpg"
            alt="hero_image"
            className="md:w-full lg:w-3/5 lg:h-screen lg:mx-auto object-contain"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
export default Hero;
