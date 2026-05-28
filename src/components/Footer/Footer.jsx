import "./Footer.css";
import { FaXTwitter, FaSquareInstagram, FaLinkedin } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <div className="footer bg-orange-500 text-white text-lg md:text-xl h-96">
        <div className="footer bg-orange-500 text-white text-lg md:text-xl lg:text-2xl h-80 flex items-center">
          <div className="mx-auto flex flex-col gap-4">
            <div>
              <a href="">About</a>
            </div>
            <div>
              <a href="">Contact Us</a>
            </div>
            <div className="flex gap-2 md:gap-4">
              <a href="">
                <FaXTwitter className="text-2xl md:text-3xl lg:text-4xl" />
              </a>
              <a href="">
                <FaFacebookSquare className="text-2xl md:text-3xl lg:text-4xl" />
              </a>
              <a href="">
                <FaSquareInstagram className="text-2xl md:text-3xl lg:text-4xl" />
              </a>
              <a href="">
                <FaLinkedin className="text-2xl md:text-3xl lg:text-4xl" />
              </a>
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
        <hr className="w-10/12 mx-auto p-1" />
        <div className="copyrights bg-orange-500 flex flex-col items-center text-lg  md:text-xl">
          <p>eBuy</p>
          <p>CopyRights @ 2024, ebuy.com</p>
        </div>
      </div>
    </>
  );
};
export default Footer;
