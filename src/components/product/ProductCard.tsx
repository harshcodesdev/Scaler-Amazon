"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@prisma/client";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatINR } from "@/lib/formatPrice";
import { useState } from "react";
import { Heart } from "lucide-react";



export default function ProductCard({ product, priority = false }: { product: Product, priority?: boolean }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="flex flex-col bg-white z-20 p-4 rounded-none sm:rounded-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative group min-h-[420px]">
      
      {/* Best Seller Badge */}
      {product.isBestSeller && (
        <div className="absolute top-0 left-0 bg-[#E67A00] text-white text-[11px] font-bold px-2 py-1 z-40 rounded-br-sm shadow-sm flex items-center">
          Best seller
        </div>
      )}



      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-gray-100 z-40 transition-all shadow-sm border border-gray-100 scale-110"
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <Heart 
          className={`w-6 h-6 transition-all ${isWishlisted ? "fill-red-500 text-red-500 scale-110" : "text-gray-300 hover:text-gray-400"}`} 
        />
      </button>
      
      <Link href={`/product/${product.id}`} className="flex flex-col flex-1 items-center">
        <div className="w-full aspect-square relative mb-4 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300">
          <Image 
            src={product.imageUrl} 
            alt={product.title} 
            fill 
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
          />
        </div>
        
        <div className="w-full text-left flex-1">
          {/* Category Heading Moved Below Image */}
          <div className="text-[11px] uppercase font-bold text-gray-400 tracking-tight mb-1">
            {product.category}
          </div>
          <h4 className="text-[15px] leading-snug font-medium line-clamp-2 hover:text-[#C7511F] mb-1">{product.title}</h4>
          
          <div className="flex items-center my-1 text-sm">
            <div className="flex text-[#F3A847]">
              {Array(Math.floor(product.rating))
                .fill(1)
                .map((_, i) => (
                  <span key={i}>★</span>
                ))}
               {product.rating % 1 !== 0 && <span>☆</span>}
            </div>
            <span className="text-[#007185] ml-2 font-medium hover:underline text-xs">{product.rating}</span>
          </div>
          
          {product.isLimitedTimeDeal && (
            <div className="flex items-center gap-2 mb-1">
              {product.discountPercentage && (
                <span className="bg-[#B12704] text-white px-2 py-0.5 text-[12px] font-bold rounded-sm">
                  {product.discountPercentage}% off
                </span>
              )}
              <span className="text-[#B12704] text-[12px] font-bold">Limited time deal</span>
            </div>
          )}
          
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-medium">{formatINR(product.price)}</span>
            {product.oldPrice && (
              <span className="text-gray-500 text-xs line-through block">
                M.R.P: {formatINR(product.oldPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center mt-1">
            <span className="text-[#00A8E1] font-bold italic text-sm tracking-tight mr-1"><span className="text-[#FF9900]">✓</span>prime</span>
            <span className="text-gray-500 text-xs">FREE Delivery</span>
          </div>

          <p className="text-[#565959] text-sm mt-1">
            {Math.floor(product.rating * 1.5)}K+ bought in past month
          </p>

          <div className="mt-2 p-1.5 bg-gray-50 rounded border border-gray-100 text-[11px] text-[#565959]">
            <span className="font-bold text-black">Save with offers: </span>
            Up to 5% back with Amazon Pay ICICI card
          </div>
        </div>
      </Link>
      
      <button 
        onClick={() => addToCart(product, 1)}
        className="w-full mt-auto bg-[#FFD814] hover:bg-[#F7CA00] text-black text-sm font-medium border border-[#FCD200] mt-3 py-2 rounded-full shadow-sm"
      >
        Add to Cart
      </button>
    </div>
  );
}
