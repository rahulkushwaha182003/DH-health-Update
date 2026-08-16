import React from "react";
import { useCart } from "@/context/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, ShoppingBag } from "lucide-react";

const CartStickyBanner = () => {
  const { cartItems, totalAmount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // Do not show the banner on the cart page or if the cart is empty
  if (cartItems.length === 0 || location.pathname === "/cart") {
    return null;
  }

  // Count items dynamically (distinguish between single and plural)
  const itemText = cartItems.length === 1 ? "Item added" : "Items added";

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-500 ease-out">
      <div 
        onClick={() => navigate("/cart")}
        className="bg-[#8be493] text-green-950 px-6 py-4 rounded-3xl flex items-center justify-between shadow-[0_12px_32px_rgba(34,197,94,0.35)] border border-[#7ad682] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/25 flex items-center justify-center text-green-950 shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs md:text-sm font-extrabold uppercase tracking-wide opacity-90">
              {cartItems.length} {itemText}
            </p>
            <p className="text-lg md:text-xl font-black leading-none mt-0.5">
              ₹{totalAmount}
            </p>
          </div>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate("/cart");
          }}
          className="bg-white text-green-950 px-5 py-2.5 rounded-2xl text-xs md:text-sm font-black flex items-center gap-1.5 shadow-sm hover:shadow-md hover:bg-slate-50 active:scale-95 transition-all"
        >
          View Cart
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default CartStickyBanner;
