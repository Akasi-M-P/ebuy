import Product from "../Product/Product";
import "./Body.css";
import { products } from "/src/components/Data/Data";

const Body = () => {
  return (
    <>
      <div className="products_container">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
      <hr className="w-full" />
    </>
  );
};
export default Body;
