const CartItem = () => {
  return (
    <>
      <div className="flex items-center gap-10 px-4">
        <div className="w-2/5">
          <img src="/public/assets/s22.png" alt="" />
        </div>
        <div className="flex flex-col gap-10 py-4">
          <div>
            <p className="font-bold text-sm">Samsung s22</p>
          </div>
          <div>
            <p className="font-bold text-orange-500 text-sm">$ 1200</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-10">
          <div>
            <button className="text-sm text-red-300">remove</button>
          </div>
          <div className="flex border justify-between items-center gap-2 p-0 rounded-md ">
            <button className="border px-2 text-lg rounded-sm">-</button>
            <p>1</p>
            <button className="border border-gray-400 px-2 text-lg rounded-sm">
              +
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default CartItem;
