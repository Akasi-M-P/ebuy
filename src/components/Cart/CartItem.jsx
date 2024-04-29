import React from "react";

/* eslint-disable react/prop-types */
const CartItem = ({ cartProducts, onDeleteCartProduct, onProductQuantity }) => {
  return (
    <>
      {cartProducts.map((product) => (
        <React.Fragment key={product.id}>
          <div
            className="flex items-center gap-10 px-4 md:w-10/12 md:mx-auto md:gap-20 lg:justify-center lg:gap-32"
            key={product.id}
          >
            <div className="w-2/5">
              <img src={product.image} alt="" className="md:h-48" />
            </div>
            <div className="flex flex-col gap-10 py-4">
              <div>
                <p className="font-bold text-sm md:text-lg lg:text-2xl">
                  {product.name}
                </p>
              </div>
              <div>
                <p className="font-bold text-orange-500 text-sm md:text-lg lg:text-2xl">
                  $ {product.price}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-10">
              <div>
                <button
                  className="text-sm text-red-300 md:text-lg lg:text-2xl"
                  onClick={() => onDeleteCartProduct(product.id)}
                >
                  remove
                </button>
              </div>
              <div className="flex border justify-between items-center gap-2 p-0 rounded-md ">
                <button
                  className="border px-2 text-lg rounded-sm lg:text-2xl"
                  onClick={() =>
                    onProductQuantity(product.id, product.quantity - 1)
                  }
                >
                  -
                </button>
                <p className="lg:text-2xl w-4 text-center">
                  {product.quantity}
                </p>
                <button
                  className="border border-gray-400 px-2 text-lg rounded-sm lg:text-2xl"
                  onClick={() =>
                    onProductQuantity(product.id, product.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <hr />
        </React.Fragment>
      ))}
    </>
  );
};
export default CartItem;
