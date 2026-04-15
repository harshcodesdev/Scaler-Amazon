"use client";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/formatPrice";

export default function Cart() {
  const { cartItems, updateQty, removeFromCart, cartTotal, itemCount } = useCart();
  const { addToWishlist } = useWishlist();
  const router = useRouter();

  const moveToWishlist = (product: any) => {
    addToWishlist(product);
    removeFromCart(product.id);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-[1500px] mx-auto p-4 sm:p-8 min-h-[60vh] flex flex-col justify-center items-center bg-white mt-8 rounded">
        <h2 className="text-3xl font-medium mb-6">Your Amazon Cart is empty.</h2>
        <Link 
          href="/" 
          className="text-[#007185] hover:text-[#C7511F] hover:underline"
        >
          Shop today's deals
        </Link>
      </div>
    );
  }

  const estimatedTax = cartTotal * 0.08; // 8% tax
  const orderTotal = cartTotal + estimatedTax;

  return (
    <div className="max-w-[1500px] mx-auto p-4 bg-[#EAEDED] min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left: Cart Items */}
        <div className="flex-1 bg-white p-8 rounded shadow-sm">
          <h1 className="text-3xl font-medium mb-2 border-b pb-4">Shopping Cart</h1>
          <p className="text-right text-gray-600 text-sm mb-4">Price</p>

          <div className="flex flex-col space-y-6">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex flex-col sm:flex-row border-b pb-6">
                <div className="sm:w-1/4 lg:w-1/5 flex justify-center mb-4 sm:mb-0">
                  <div className="relative w-[150px] h-[150px]">
                    <Image 
                      src={item.product.imageUrl} 
                      alt={item.product.title} 
                      fill 
                      className="object-contain" 
                    />
                  </div>
                </div>

                <div className="sm:w-3/4 lg:w-4/5 sm:pl-6 flex flex-col sm:flex-row justify-between">
                  <div className="flex-1">
                    <Link href={`/product/${item.product.id}`} className="text-xl font-medium line-clamp-2 hover:underline">
                      {item.product.title}
                    </Link>
                    <p className="text-green-700 text-sm my-1">{item.product.stock > 0 ? "In Stock" : "Out of stock"}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                       <input type="checkbox" className="h-4 w-4" />
                       <span>This is a gift <span className="text-[#007185] hover:underline cursor-pointer hover:text-[#C7511F]">Learn more</span></span>
                    </div>

                    <div className="flex items-center mt-2 space-x-4">
                      {/* Quantity Selector */}
                      <label htmlFor={`qty-${item.product.id}`} className="text-sm border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 shadow-sm px-2 py-1 flex items-center">
                        Qty: 
                        <select 
                          id={`qty-${item.product.id}`}
                          value={item.quantity}
                          onChange={(e) => updateQty(item.product.id, parseInt(e.target.value))}
                          className="bg-transparent border-none outline-none ml-1 cursor-pointer"
                        >
                          {[...Array(Math.min(10, item.product.stock))].map((_, i) => (
                            <option key={i+1} value={i+1}>{i+1}</option>
                          ))}
                        </select>
                      </label>
                      <span className="text-gray-300">|</span>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#007185] hover:text-[#C7511F] hover:underline text-sm"
                      >
                        Delete
                      </button>
                      <span className="text-gray-300">|</span>
                      <button 
                        onClick={() => moveToWishlist(item.product)}
                        className="text-[#007185] hover:text-[#C7511F] hover:underline text-sm hidden sm:inline"
                      >
                        Save for later
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 text-right">
                     <p className="text-xl font-bold">
                       {formatINR(item.product.price)}
                     </p>
                     {item.product.oldPrice && (
                       <p className="text-gray-500 text-xs line-through whitespace-nowrap">
                         M.R.P: {formatINR(item.product.oldPrice)}
                       </p>
                     )}
                     {item.product.isLimitedTimeDeal && (
                       <p className="text-[#B12704] text-[11px] font-bold mt-1">Limited time deal</p>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-right mt-4">
            <p className="text-lg">
              Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''}): <span className="font-bold">{formatINR(cartTotal)}</span>
            </p>
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:w-1/3 xl:w-[350px]">
          <div className="bg-white p-6 rounded shadow-sm sticky top-4">
            
            <div className="flex text-green-700 text-sm mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>Part of your order qualifies for FREE Delivery. <br/><span className="text-gray-500">Choose FREE Delivery at checkout.</span></span>
            </div>

            <h2 className="text-xl mb-4">
              Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''}): <span className="font-bold whitespace-nowrap">{formatINR(cartTotal)}</span>
            </h2>

            <div className="flex items-center space-x-2 text-sm text-gray-700 mb-6 border-b pb-4">
              <input type="checkbox" id="gift" className="h-4 w-4" />
              <label htmlFor="gift">This order contains a gift</label>
            </div>

            <div className="space-y-2 mb-4 text-sm text-gray-700">
               <div className="flex justify-between">
                 <span>Items:</span>
                 <span>{formatINR(cartTotal)}</span>
               </div>
               <div className="flex justify-between">
                 <span>Estimated Tax:</span>
                 <span>{formatINR(estimatedTax)}</span>
               </div>
               <div className="flex justify-between font-bold text-[#b12704] text-lg py-2 border-t mt-2">
                 <span>Total:</span>
                 <span>{formatINR(orderTotal)}</span>
               </div>
            </div>

            <button 
              onClick={() => router.push("/checkout")}
              className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black text-sm font-medium border border-[#FCD200] py-2 rounded-full shadow-sm"
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
