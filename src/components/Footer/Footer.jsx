import "./Footer.css";
import { FaXTwitter, FaSquareInstagram, FaLinkedin } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <div className="footer bg-orange-500 text-white text-lg h-64 flex items-center">
        <div className="mx-auto flex flex-col gap-4">
          <div>
            <a href="">About</a>
          </div>
          <div>
            <a href="">Contact Us</a>
          </div>
          <div className="flex gap-2">
            <FaXTwitter className="text-xl" />
            <FaFacebookSquare className="text-xl" />
            <FaSquareInstagram className="text-xl" />
            <FaLinkedin className="text-xl" />
          </div>
        </div>
        <div className="mx-auto flex flex-col gap-4">
          <div>
            <a href="">Payments</a>
          </div>
          <div>
            <a href="">Delivery</a>
          </div>
          <div>
            <a href="">FAQs</a>
          </div>
        </div>
      </div>
    </>
  );
};
export default Footer;
