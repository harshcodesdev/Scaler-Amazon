"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/formatPrice";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const moveToCart = (product: any) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  return (
    <div className="bg-[#EAEDED] min-h-screen pb-10">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-sm shadow-sm">
          <h1 className="text-3xl font-medium border-b border-gray-200 pb-4 mb-6">Your Wishlist</h1>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-xl text-gray-600 mb-4">Your wishlist is empty.</h2>
              <Link
                href="/"
                className="bg-[#FF9900] hover:bg-[#F3A847] text-black font-medium py-2 px-8 rounded shadow-sm transition-colors"
              >
                Go shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded p-4 flex flex-col bg-white hover:shadow-md transition-shadow">
                  <Link href={`/product/${product.id}`} className="block aspect-square relative mb-4">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-contain"
                    />
                  </Link>

                  <div className="flex-1">
                    <Link href={`/product/${product.id}`} className="text-[#007185] hover:text-[#C7511F] hover:underline font-medium line-clamp-2 text-sm mb-2">
                      {product.title}
                    </Link>
                    <div className="flex flex-col mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold">{formatINR(product.price)}</span>
                        {product.oldPrice && (
                          <span className="text-gray-500 text-xs line-through">
                            M.R.P: {formatINR(product.oldPrice)}
                          </span>
                        )}
                      </div>
                      {product.isLimitedTimeDeal && (
                        <span className="text-[#B12704] text-[10px] font-bold">Limited time deal</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-auto">
                    <button
                      onClick={() => moveToCart(product)}
                      className="flex items-center justify-center gap-2 bg-[#FF9900] hover:bg-[#F3A847] text-black text-sm font-medium py-2 rounded shadow-sm transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 rounded border border-gray-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
