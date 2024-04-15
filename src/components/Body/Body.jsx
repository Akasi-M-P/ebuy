import Product from "../Product/Product";
import "./Body.css";
import { products } from "/src/components/Data/Data";

const Body = () => {
  return (
    <>
      <div className="products_container mt-4">
        <hr />
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </>
  );
};
export default Body;
