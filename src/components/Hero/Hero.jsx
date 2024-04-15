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
    <div>
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
          <img src="/src/assets/heroimage1.jpg" alt="hero_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/src/assets/heroimage1.jpg" alt="hero_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/src/assets/heroimage1.jpg" alt="hero_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/src/assets/heroimage1.jpg" alt="hero_image" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
export default Hero;
