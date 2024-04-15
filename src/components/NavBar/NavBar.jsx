import "./NavBar.css";
import { FaHeart } from "react-icons/fa6";
import { RiShoppingCartFill } from "react-icons/ri";
import { HiBars3 } from "react-icons/hi2";
const NavBar = () => {
  return (
    <>
      <div>
        <h1>
          <span>e</span>Buy
        </h1>
      </div>
      <div>
        <div>
          <a href="">About</a>
        </div>
        <div>
          <a href="">Contact Us</a>
        </div>
      </div>
      <div>
        <div>
          <FaHeart />
        </div>
        <div>
          <RiShoppingCartFill />
        </div>
      </div>
      <div>
        <div>
          <HiBars3 />
        </div>
      </div>
    </>
  );
};
export default NavBar;
