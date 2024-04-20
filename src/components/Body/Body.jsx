import Product from "../Product/Product";
import "./Body.css";
import { products } from "/src/components/Data/Data";

const Body = () => {
  return (
    <>
      <div className=" mt-4">
        <hr />
        <div className="grid grid-cols-2 gap-2 p-3 md:grid-cols-2 md:gap-4 md:px-4 md:py-5 lg:grid-cols-4 lg:py-10 lg:px-8 ">
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};
export default Body;
