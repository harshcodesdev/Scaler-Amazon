"use client";

import { useEffect, useState, use } from "react";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/formatPrice";
import { Heart } from "lucide-react";



export default function ProductDetail({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImgSrc, setMainImgSrc] = useState("");
  const [selectedThumb, setSelectedThumb] = useState(0);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const isFashion = product?.category?.toLowerCase().includes("clothing");

  const sizes = isFashion
    ? ["S", "M", "L", "XL"]
    : ["Free Size"];
  const colors = ["Black", "White", "Grey", "Blue"];
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0]);
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]);

  const productHighlights = [
    "High-quality materials and durable build",
    "Designed for comfort and everyday use",
    "Modern design with premium finish",
    "Suitable for multiple use cases across categories",
  ];

  const highlights = product ? [
    { label: "Category", value: product.category },
    { label: "Rating", value: `${product.rating} / 5` },
    { label: "Availability", value: product.stock > 0 ? "In Stock" : "Out of Stock" },
    { label: "Quality", value: "Premium" },
  ] : [];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Product not found");
          throw new Error("Failed to fetch product details");
        }
        const data = await res.json();
        setProduct(data);
        setMainImgSrc(data.imageUrl);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-[1500px] mx-auto p-4 sm:p-8">
          {/* Skeleton Back Link */}
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-6" />

          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* Skeleton Image Panel */}
            <div className="md:w-1/2 lg:w-2/5">
              <div className="flex gap-3">
                <div className="flex flex-col gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-14 h-14 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
                <div className="flex-1 aspect-square bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Skeleton Info Panel */}
            <div className="md:w-1/2 lg:w-3/5 flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3" />
                <div className="h-10 bg-gray-200 rounded animate-pulse w-1/2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
              </div>
              {/* Skeleton Buy Box */}
              <div className="lg:w-1/3 xl:w-[300px]">
                <div className="border border-gray-200 rounded p-4 space-y-3">
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
                  <div className="h-10 bg-gray-200 rounded-full animate-pulse w-full" />
                  <div className="h-10 bg-gray-200 rounded-full animate-pulse w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto p-4 py-8">
        <Link href="/" className="text-[#007185] hover:text-[#C7511F] text-sm flex items-center mb-6">
          &larr; Back to results
        </Link>
        <div className="bg-red-100 text-red-700 p-4 border border-red-400 rounded">
          {error || "Product not found."}
        </div>
      </div>
    );
  }

  // Generate thumbnail variants from the main image URL
  const thumbnails = product ? [
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
  ] : [];

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };


  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1500px] mx-auto p-4 sm:p-8">

        <Link href="/" className="text-[#007185] hover:underline text-sm flex items-center mb-6">
          &larr; Back to results
        </Link>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-12">
          {/* Left: Image Panel with Thumbnails */}
          <div className="md:w-1/2 lg:w-2/5 md:sticky md:top-24 self-start">
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              {/* Thumbnail Strip */}
              <div className="flex sm:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                {thumbnails.map((thumb, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedThumb(i); setMainImgSrc(thumb); }}
                    className={`w-14 h-14 shrink-0 border-2 rounded overflow-hidden relative ${selectedThumb === i ? 'border-[#C45500]' : 'border-gray-200 hover:border-[#C45500]'}`}
                  >
                    <Image
                      src={thumb}
                      alt={`${product.title} view ${i + 1}`}
                      fill
                      className="object-contain p-1"
                      sizes="56px"
                    />
                  </button>
                ))}
              </div>
              {/* Main Image */}
              <div className="flex-1 relative aspect-square group overflow-hidden bg-gray-50 rounded">
                <Image
                  src={mainImgSrc || product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  priority
                />
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 mt-4">Roll over image to zoom in</p>
          </div>

          {/* Middle/Right: Details Panel */}
          <div className="md:w-1/2 lg:w-3/5 flex flex-col lg:flex-row gap-8">

            {/* Product Info */}
            <div className="flex-1 order-1 lg:order-none">
              <h1 className="text-xl sm:text-2xl font-medium leading-tight mb-2 text-[#0F1111]">
                {product.title}
              </h1>

              <div className="flex items-center gap-2 mb-2">
                <Link href={`/?category=${encodeURIComponent(product.category)}`} className="text-[#007185] hover:text-[#C7511F] hover:underline text-sm font-medium">
                  Visit the {product.category} store
                </Link>
                <div className="flex text-[#F3A847] items-center text-sm">
                  <span className="font-bold mr-1 text-black">{product.rating}</span>
                  {Array(Math.floor(product.rating))
                    .fill(1)
                    .map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  <span className="text-[#007185] ml-2 hover:underline">12,453 ratings</span>
                </div>
              </div>

              <div className="py-2 border-t border-b border-gray-100 flex gap-4 overflow-x-auto no-scrollbar">
                <div className="flex flex-col items-center min-w-[70px] text-center">
                  <div className="w-8 h-8 relative mb-1">
                    <Image src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-returns._CB562506492_.png" alt="Return" fill className="object-contain" />
                  </div>
                  <span className="text-[10px] text-[#007185] leading-tight">10 days Return & Exchange</span>
                </div>
                <div className="flex flex-col items-center min-w-[70px] text-center">
                  <div className="w-8 h-8 relative mb-1">
                    <Image src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/trust_icon_free_shipping_81px._CB562549966_.png" alt="Delivery" fill className="object-contain" />
                  </div>
                  <span className="text-[10px] text-[#007185] leading-tight">Free Delivery</span>
                </div>
                <div className="flex flex-col items-center min-w-[70px] text-center">
                  <div className="w-8 h-8 relative mb-1">
                    <Image src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-top-brand._CB562506657_.png" alt="Top Brand" fill className="object-contain" />
                  </div>
                  <span className="text-[10px] text-[#007185] leading-tight">Top Brand</span>
                </div>
                <div className="flex flex-col items-center min-w-[70px] text-center">
                  <div className="w-8 h-8 relative mb-1">
                    <Image src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-amazon-delivered._CB562550117_.png" alt="Amazon Delivered" fill className="object-contain" />
                  </div>
                  <span className="text-[10px] text-[#007185] leading-tight">Amazon Delivered</span>
                </div>
              </div>

              <div className="py-4">
                {product.isLimitedTimeDeal && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#B12704] text-white px-2 py-1 text-xs font-bold rounded-sm">
                      Limited time deal
                    </span>
                  </div>
                )}
                <div className="flex items-baseline gap-2 mb-1">
                  {product.discountPercentage && (
                    <span className="text-[#CC0C39] text-3xl font-light">-{product.discountPercentage}%</span>
                  )}
                  <div className="flex items-start">
                    <span className="text-xs mt-1.5 font-medium">₹</span>
                    <span className="text-3xl font-medium">{product.price.toLocaleString("en-IN")}</span>
                    <span className="text-xs mt-1.5 font-medium">00</span>
                  </div>
                </div>
                {product.oldPrice && (
                  <div className="text-sm text-gray-500">
                    M.R.P.: <span className="line-through">₹{product.oldPrice.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="text-sm text-gray-900 mt-1 font-medium">
                  Inclusive of all taxes
                </div>
                <div className="text-sm text-gray-900 mt-2">
                  <span className="font-bold">EMI</span> starts at ₹543. No Cost EMI available <span className="text-[#007185] hover:underline cursor-pointer">EMI options ▾</span>
                </div>
              </div>

              {/* Offers Section */}
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12.75 3.75a.75.75 0 0 0-1.5 0v3.75h-3.75a.75.75 0 0 0 0 1.5h3.75v3.75a.75.75 0 0 0 1.5 0v-3.75h3.75a.75.75 0 0 0 0-1.5h-3.75V3.75Z" /></svg>
                  <span className="font-bold text-sm">Save Extra with 4 offers</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="border border-gray-200 rounded p-3 hover:shadow-md cursor-pointer transition-shadow">
                    <h5 className="font-bold text-sm mb-1">Bank Offer</h5>
                    <p className="text-xs text-gray-700">Upto ₹1,500.00 discount on select Credit Cards</p>
                    <span className="text-[#007185] text-[10px] font-bold uppercase mt-2 block">11 offers ▾</span>
                  </div>
                  <div className="border border-gray-200 rounded p-3 hover:shadow-md cursor-pointer transition-shadow">
                    <h5 className="font-bold text-sm mb-1">Partner Offers</h5>
                    <p className="text-xs text-gray-700">Get GST invoice and save up to 28% on business purchases</p>
                    <span className="text-[#007185] text-[10px] font-bold uppercase mt-2 block">1 offer ▾</span>
                  </div>
                </div>
              </div>

              {/* Color/Size Selection */}
              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="text-sm font-bold mb-3 uppercase tracking-tight text-gray-600">Colour: <span className="text-black">{selectedColor}</span></h4>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(c => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-4 py-2 border rounded text-xs font-bold transition-all ${selectedColor === c ? 'border-[#C45500] bg-orange-50 ring-1 ring-[#C45500]' : 'border-gray-300 hover:border-gray-500'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-bold uppercase tracking-tight text-gray-600">Size: <span className="text-black">{selectedSize}</span></h4>
                    <span className="text-[#007185] text-xs font-bold hover:underline cursor-pointer">Size Chart ▾</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[60px] h-10 border rounded text-xs font-bold transition-all ${selectedSize === s ? 'border-[#C45500] bg-orange-50 ring-1 ring-[#C45500]' : 'border-gray-300 hover:border-gray-500'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Highlights
              <div className="mb-8">
                <h4 className="text-lg font-bold mb-4">Top highlights</h4>
                <div className="grid grid-cols-2 gap-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Weight</p>
                      <p className="text-xs text-gray-500">600 Grams</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Brand</p>
                      <p className="text-xs text-gray-500">Nike</p>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="grid grid-cols-2 gap-y-4">
                {highlights.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="py-4 border-t">
                <h3 className="font-bold text-lg mb-2">More about this product</h3>
                <ul className="list-disc ml-5 space-y-2 text-sm text-gray-800">
                  {productHighlights.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Side: Buy Box (lg screen) */}
            <div className="w-full lg:w-1/3 xl:w-[300px] order-2 lg:order-none mt-6 lg:mt-0">
              <div className="border border-gray-300 rounded-lg p-4 shadow-sm lg:sticky lg:top-24 bg-white">
                <div className="flex items-start mb-1">
                  <span className="text-xs mt-1.5 font-medium">₹</span>
                  <span className="text-2xl font-medium">{product.price.toLocaleString("en-IN")}</span>
                  <span className="text-xs mt-1.5 font-medium">00</span>
                </div>
                <div className="text-[#007185] text-sm hover:underline mb-4 cursor-pointer">
                  FREE Returns
                </div>
                <div className="text-xs mb-4">
                  <span className="text-[#007185] hover:underline cursor-pointer">FREE delivery</span> <span className="font-bold">Wednesday, 20 April</span>.<br />
                  Or fastest delivery <span className="font-bold">Tomorrow</span>. Order within <span className="text-green-700">22 hrs 14 mins</span>
                </div>

                <h4 className="text-green-700 text-lg mb-4 font-medium">
                  {product.stock > 0 ? "In Stock." : "Out of Stock"}
                </h4>

                {product.stock > 0 && (
                  <>
                    <div className="mb-4">
                      <label htmlFor="quantity" className="text-sm border border-gray-300 rounded bg-[#F0F2F2] hover:bg-[#E3E6E6] shadow-sm px-2 py-1 flex items-center w-full">
                        Qty:
                        <select
                          id="quantity"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value))}
                          className="bg-transparent border-none outline-none ml-2 w-full cursor-pointer font-bold"
                        >
                          {[...Array(Math.min(10, product.stock))].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={handleAddToCart}
                        className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] py-3 lg:py-2 rounded-full shadow-[0_2px_5px_0_rgba(213,217,217,0.5)] border border-[#FCD200] text-sm font-bold transition-colors"
                      >
                        Add to Cart
                      </button>

                      <button
                        onClick={handleBuyNow}
                        className="w-full bg-[#FFA41C] hover:bg-[#FA8900] text-[#0F1111] py-3 lg:py-2 rounded-full shadow-[0_2px_5px_0_rgba(213,217,217,0.5)] border border-[#FF8F00] text-sm font-bold transition-colors"
                      >
                        Buy Now
                      </button>
                    </div>

                    <div className="mt-4 pt-4 border-t space-y-4">
                      <button
                        onClick={() => product && toggleWishlist(product)}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 shadow-sm text-xs font-medium transition-colors ${isWishlisted ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
                      >
                        <Heart className={`w-3 h-3 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                        {isWishlisted ? "In Wishlist" : "Add to Wish List"}
                      </button>

                      {/* Limited Quantity Note */}
                      <div className="bg-blue-50/50 border border-blue-100 p-3 rounded text-[10px] text-gray-600 flex gap-2">
                        <div className="bg-blue-600 text-white px-1.5 py-0.5 h-fit text-[8px] font-bold uppercase rounded-sm">Limited Quantity</div>
                        <p>
                          <span className="font-bold block text-gray-800 mb-0.5">Note: The order quantity is limited to 3 units per customer.</span>
                          Please note that orders which exceed the quantity limit will be auto-canceled. This is applicable across sellers.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-500 text-[10px] mt-4 space-x-2 text-center w-full justify-center">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                      <span className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer">Secure transaction</span>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
