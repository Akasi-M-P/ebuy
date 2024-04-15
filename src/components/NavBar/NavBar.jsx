import "./NavBar.css";
import { FaHeart } from "react-icons/fa6";
import { RiShoppingCartFill } from "react-icons/ri";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
const NavBar = () => {
  return (
    <>
      <div className="flex items-center justify-between py-4 px-8 lg:py-8 lg:px-32 md:px-12 ">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-4xl font-extrabold">
            <span className="text-orange-500">e</span>Buy
          </h1>
        </div>
        <div className="hidden md:flex gap-3 md:gap-14 lg:gap-32 text-sm md:text-lg lg:text-3xl text-orange-500 font-bold">
          <div>
            <a href="">About</a>
          </div>
          <div>
            <a href="">Contact Us</a>
          </div>
        </div>
        <div className="flex gap-10 md:gap-20 lg:gap-32">
          <div className="relative">
            <FaHeart className="text-orange-500 cursor-pointer text-xl md:text-2xl lg:text-4xl" />
            <div className="absolute -top-2 -right-3 lg:-right-4 bg-orange-500  rounded-full flex justify-center w-4 h-4 lg:w-6 lg:h-6">
              <p className="text-sm lg:text-lg text-white font-bold">5</p>
            </div>
          </div>
          <div className="relative">
            <RiShoppingCartFill className="text-orange-500 cursor-pointer text-xl md:text-2xl lg:text-4xl" />
            <div className="absolute -top-2 -right-3 lg:-right-4 bg-orange-500  rounded-full flex justify-center w-4 h-4 lg:w-6 lg:h-6">
              <p className="text-sm lg:text-lg text-white font-bold">8</p>
            </div>
          </div>
        </div>
        <div className="md:hidden">
          <div>
            <FaBars className=" text-orange-500 cursor-pointer text-xl" />
            <IoMdClose className="hidden text-orange-500 cursor-pointer text-xl" />
          </div>
        </div>
      </div>
      <hr />
      {/* <div className="">
        <div className="h-32 flex flex-col justify-center items-center gap-3 text-sm text-orange-500 font-bold">
          <div>
            <a href="">About</a>
          </div>
          <div className="w-full py-2">
            <hr />
          </div>
          <div>
            <a href="">Contact Us</a>
          </div>
        </div>
        <hr />
      </div> */}
    </>
  );
};
export default NavBar;
