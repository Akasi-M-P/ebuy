import "./NavBar.css";
import { FaHeart } from "react-icons/fa6";
import { RiShoppingCartFill } from "react-icons/ri";
import { HiBars3 } from "react-icons/hi2";
const NavBar = () => {
  return (
    <>
      <div className="flex items-center justify-between py-4 px-8">
        <div>
          <h1 className="text-xl font-extrabold">
            <span className="text-orange-500">e</span>Buy
          </h1>
        </div>
        <div className="hidden gap-3 text-sm text-orange-500 font-bold">
          <div>
            <a href="">About</a>
          </div>
          <div>
            <a href="">Contact Us</a>
          </div>
        </div>
        <div className="flex gap-10">
          <div>
            <FaHeart className="text-orange-500 cursor-pointer text-xl" />
          </div>
          <div>
            <RiShoppingCartFill className="text-orange-500 cursor-pointer text-xl" />
          </div>
        </div>
        <div>
          <div>
            <HiBars3 className="text-orange-500 cursor-pointer text-xl" />
          </div>
        </div>
      </div>
      <hr />
    </>
  );
};
export default NavBar;
