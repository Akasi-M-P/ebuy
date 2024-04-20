/* eslint-disable react/prop-types */
import "./Description.css";
import { FaHeart } from "react-icons/fa6";
import { CiStar } from "react-icons/ci";
import { FaWindowClose } from "react-icons/fa";

const Description = ({ onOpenProductDescription }) => {
  return (
    <>
      <div className="h-full mb-10" data-aos="flip-up">
        <div className="flex flex-row-reverse px-5 py-4">
          <FaWindowClose
            className=" text-orange-500 text-lg md:text-2xl lg:text-4xl cursor-pointer"
            onClick={onOpenProductDescription}
          />
        </div>
        <div>
          <img src="/public/assets/s22.png" alt="" />
        </div>
        <div className="flex justify-between px-8">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-xl">Samsung s22</p>
            <p className="font-bold text-lg text-orange-500">$ 12000</p>
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
        <div className="description px-5 py-5">
          <div>
            <p className="font-bold">Description</p>
          </div>
          <div>
            <p>
              Experience the future of mobile technology with our
              ultra-performance smartphone. Packed with cutting-edge features
              and powered by the latest processor, this phone is designed to
              elevate your mobile experience to new heights. The stunning AMOLED
              display delivers vibrant colors and sharp detail, perfect for
              streaming your favorite movies or gaming with immersive visuals.
              With a sleek and modern design, this phone not only looks great
              but also feels comfortable in your hand. Capture every moment in
              stunning clarity with the advanced triple-camera system, featuring
              ultra-wide, wide, and telephoto lenses for versatile photography
              options. Plus, with 8K video recording capabilities, you can
              create professional-quality videos right from your phone. Stay
              connected and productive with fast 5G connectivity, long-lasting
              battery life, and seamless multitasking capabilities. Whether you
              are a tech enthusiast, content creator, or business professional,
              our ultra-performance smartphone is the perfect companion for your
              mobile lifestyle.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
export default Description;
