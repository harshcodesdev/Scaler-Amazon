"use client";

import { useEffect, useState, use, useRef } from "react";
import { Product } from "@prisma/client";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

import { motion, AnimatePresence } from "framer-motion";
import CategoryGridCard from "@/components/home/CategoryGridCard";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const CAROUSEL_ITEMS = [
  { image: "/a1.jpg", link: "/?category=Women%27s%20Clothing" },
  { image: "/a2.png", link: "/?category=Beauty" },
  { image: "/a3.jpg", link: "/?category=Men%27s+Clothing" },
  { image: "/a4.jpg", link: "/?category=jewelery" },
  { image: "/a5.jpg", link: "/?category=Electronics" },
];

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const unwrappedParams = use(searchParams);
  const { user } = useAuth();
  const pageParam = typeof unwrappedParams.page === "string" ? unwrappedParams.page : "1";
  const searchParam = typeof unwrappedParams.search === "string" ? unwrappedParams.search : "";
  const categoryParam = typeof unwrappedParams.category === "string" ? unwrappedParams.category : "";
  const sortParam = typeof unwrappedParams.sort === "string" ? unwrappedParams.sort : "newest";
  const bestSellerParam = unwrappedParams.isBestSeller === "true";
  const dealParam = unwrappedParams.isLimitedTimeDeal === "true";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);

  const [currentPage, setCurrentPage] = useState(parseInt(pageParam));
  const [totalPages, setTotalPages] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [sortBy, setSortBy] = useState(sortParam);
  const [bestSellerOnly, setBestSellerOnly] = useState(bestSellerParam);
  const [dealsOnly, setDealsOnly] = useState(dealParam);

  const [gridData, setGridData] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [recTitle, setRecTitle] = useState("Recommended for You");

  const resultsRef = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);
  const prevParams = useRef<{
    category?: string;
    search?: string;
    page?: number;
    bestSeller?: boolean;
    deals?: boolean;
    sort?: string;
  }>({});

  const nextSlide = () => {
    setCurrentImageIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
  };

  const prevSlide = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? CAROUSEL_ITEMS.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const buildQueryUrl = (params: any) => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", params.page.toString());
    if (params.search) q.set("search", params.search);
    if (params.category && params.category !== "All Categories") q.set("category", params.category);
    if (params.sort && params.sort !== "newest") q.set("sort", params.sort);
    if (params.bestSeller) q.set("isBestSeller", "true");
    if (params.deals) q.set("isLimitedTimeDeal", "true");
    return "?" + q.toString();
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      query.set("page", currentPage.toString());
      if (searchParam) query.set("search", searchParam);
      if (categoryParam && categoryParam !== "All Categories") query.set("category", categoryParam);
      if (sortBy !== "newest") query.set("sort", sortBy);
      if (bestSellerOnly) query.set("isBestSeller", "true");
      if (dealsOnly) query.set("isLimitedTimeDeal", "true");

      const res = await fetch(`/api/products?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setTotalProducts(data.total || 0);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchParam, categoryParam, sortBy, bestSellerOnly, dealsOnly]);

  // Centralized Smooth Scroll to Results Header
  useEffect(() => {
    // Skip scroll on landing (initial render)
    if (isInitialRender.current) {
      isInitialRender.current = false;
      // Initialize prevParams to avoid double-firing on mount effects
      prevParams.current = { 
        category: categoryParam, 
        search: searchParam, 
        page: currentPage, 
        bestSeller: bestSellerOnly, 
        deals: dealsOnly, 
        sort: sortBy 
      };
      return;
    }

    // Check if any significant parameter has changed from the last known state
    const hasChanged = 
      prevParams.current.category !== categoryParam ||
      prevParams.current.search !== searchParam ||
      prevParams.current.page !== currentPage ||
      prevParams.current.bestSeller !== bestSellerOnly ||
      prevParams.current.deals !== dealsOnly ||
      prevParams.current.sort !== sortBy;

    // We scroll whenever filters or pagination change after initial mount
    if (hasChanged && resultsRef.current) {
      // Small timeout to allow the new data to start rendering or URL to update
      const timer = setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      
      // Update the reference with the new state
      prevParams.current = { 
        category: categoryParam, 
        search: searchParam, 
        page: currentPage, 
        bestSeller: bestSellerOnly, 
        deals: dealsOnly, 
        sort: sortBy 
      };

      return () => clearTimeout(timer);
    }
  }, [categoryParam, searchParam, currentPage, bestSellerOnly, dealsOnly, sortBy]);

  // Sync state if URL changes directly
  useEffect(() => {
    setCurrentPage(parseInt(pageParam));
    setSortBy(sortParam);
    setBestSellerOnly(bestSellerParam);
    setDealsOnly(dealParam);
  }, [pageParam, sortParam, bestSellerParam, dealParam]);

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    const newUrl = buildQueryUrl({ page: 1, search: searchParam, category: categoryParam, sort: newSort, bestSeller: bestSellerOnly, deals: dealsOnly });
    window.history.pushState(null, '', newUrl);
    setCurrentPage(1);
  };

  const toggleBestSeller = () => {
    const newValue = !bestSellerOnly;
    setBestSellerOnly(newValue);
    const newUrl = buildQueryUrl({ page: 1, search: searchParam, category: categoryParam, sort: sortBy, bestSeller: newValue, deals: dealsOnly });
    window.history.pushState(null, '', newUrl);
    setCurrentPage(1);
  };

  const toggleDeals = () => {
    const newValue = !dealsOnly;
    setDealsOnly(newValue);
    const newUrl = buildQueryUrl({ page: 1, search: searchParam, category: categoryParam, sort: sortBy, bestSeller: bestSellerOnly, deals: newValue });
    window.history.pushState(null, '', newUrl);
    setCurrentPage(1);
  };

  // Fetch data for category grids & personalized cards
  useEffect(() => {
    const categoriesToFetch = ["Electronics", "Jewelery", "Women's Clothing"];

    async function fetchGrids() {
      try {
        const results = await Promise.all(
          categoriesToFetch.map(async (cat) => {
            const res = await fetch(`/api/products?category=${encodeURIComponent(cat)}&limit=4`);
            const data = await res.json();
            return {
              title: cat.includes("Clothing") ? cat.replace("'s Clothing", "'s Fashion") : cat,
              category: cat,
              items: (data.products || []).slice(0, 4)
            };
          })
        );
        setGridData(results);
      } catch (err) {
        console.error("Failed to fetch grid data", err);
      }
    }

    async function fetchCardExtraData() {
      try {
        // Fetch Best Sellers for the guest card
        const bsRes = await fetch("/api/products?isBestSeller=true&limit=4");
        const bsData = await bsRes.json();
        setBestSellers(bsData.products || []);

        // Fetch Recommendations for the logged-in card
        const latestSearch = localStorage.getItem("amazon-harshdeep-latest-search");
        if (latestSearch) {
          setRecTitle(`Inspired by: ${latestSearch}`);
          const recRes = await fetch(`/api/products?search=${encodeURIComponent(latestSearch)}&limit=4`);
          const recData = await recRes.json();
          setRecommendations(recData.products || []);
        } else {
          // Fallback to top rated
          const recRes = await fetch("/api/products?sort=rating_desc&limit=4");
          const recData = await recRes.json();
          setRecommendations(recData.products || []);
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchGrids();
    fetchCardExtraData();
  }, [user]);

  return (
    <div className="max-w-[1500px] mx-auto bg-[#EAEDED]">
      <div className="relative w-full overflow-hidden group" style={{ WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)", maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)" }}>
        <div className="w-full h-[250px] sm:h-[400px] md:h-[600px] relative">
          <AnimatePresence>
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <Link
                href={CAROUSEL_ITEMS[currentImageIndex].link}
              >
                <Image
                  src={CAROUSEL_ITEMS[currentImageIndex].image}
                  alt="Banner Carousel"
                  fill
                  className="object-cover cursor-pointer"
                  priority
                />
              </Link>
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#EAEDED] to-transparent z-10 pointer-events-none" />

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-4 top-[40%] -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 md:p-5 opacity-0 group-hover:opacity-100 transition-opacity z-20 focus:outline-none border border-transparent rounded shadow-sm hover:border-black cursor-pointer"
          >
            <ChevronLeftIcon className="h-8 w-8 text-black" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-4 top-[40%] -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 md:p-5 opacity-0 group-hover:opacity-100 transition-opacity z-20 focus:outline-none border border-transparent rounded shadow-sm hover:border-black cursor-pointer"
          >
            <ChevronRightIcon className="h-8 w-8 text-black" />
          </button>
        </div>
      </div>

      {/* Category Grid Cards - Overlapping the carousel */}
      <div className="relative z-30 px-4 mt-[-100px] sm:mt-[-180px] md:mt-[-320px] max-w-[1500px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {gridData.map((grid, idx) => (
            <CategoryGridCard
              key={idx}
              title={grid.title}
              category={grid.category}
              items={grid.items}
            />
          ))}

          {/* User Specific 4th Card */}
          {(!user || user.id === "demo-user-123") ? (
            /* Guest / Demo User Card */
            <div className="bg-white p-5 flex flex-col shadow-sm border border-gray-100 h-full">
              <h2 className="text-xl font-bold mb-4 leading-tight">Sign in for your best experience</h2>
              <Link
                href="/signin"
                className="bg-[#FFD814] hover:bg-[#F7CA00] text-black py-2 rounded-lg text-center font-medium shadow-sm transition-colors text-sm mb-6"
              >
                Sign in securely
              </Link>

              <div className="flex-grow flex flex-col">
                <p className="text-sm font-bold mb-2">Trendings in Best Sellers</p>
                <div className="grid grid-cols-2 gap-2 flex-grow">
                  {bestSellers.slice(0, 4).map(item => (
                    <Link key={item.id} href={`/product/${item.id}`} className="relative aspect-square bg-gray-50 rounded overflow-hidden group">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-contain p-2 group-hover:scale-105 transition-transform" />
                    </Link>
                  ))}
                  {bestSellers.length === 0 && Array(4).fill(0).map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded" />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Authenticated Regular User Card */
            <div className="bg-white p-5 flex flex-col shadow-sm border border-gray-100 h-full">
              <h2 className="text-xl font-bold mb-4 leading-tight">{recTitle}</h2>
              <div className="grid grid-cols-2 gap-2 flex-grow">
                {recommendations.slice(0, 4).map(item => (
                  <Link key={item.id} href={`/product/${item.id}`} className="flex flex-col gap-1 group">
                    <div className="relative aspect-square bg-gray-50 rounded overflow-hidden">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-contain p-2 group-hover:scale-105 transition-transform" />
                    </div>
                    <span className="text-[10px] text-gray-500 line-clamp-1">{item.title}</span>
                  </Link>
                ))}
                {recommendations.length === 0 && Array(4).fill(0).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded" />
                ))}
              </div>
              <Link href="/" className="text-xs text-[#007185] hover:underline mt-4">See more recommendations</Link>
            </div>
          )}

          {/* Skeleton Loaders for grids */}
          {gridData.length === 0 && Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-5 shadow-sm border border-gray-100 h-[420px] animate-pulse rounded">
              <div className="h-8 bg-gray-200 w-3/4 mb-4 rounded" />
              <div className="grid grid-cols-2 gap-4">
                {Array(4).fill(0).map((_, j) => (
                  <div key={j} className="aspect-square bg-gray-100 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results Header Bar */}
      <div ref={resultsRef} className="relative z-20 bg-white border-b border-gray-200 py-3 px-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm scroll-mt-24">
        <div className="text-[14px] text-gray-700">
          <span className="font-medium">1-{products.length}</span> of over <span className="font-medium">{totalProducts}</span> results
          {searchParam && <span> for <span className="text-[#C45500] font-bold">"{searchParam}"</span></span>}
          {categoryParam && categoryParam !== "All Categories" && <span> in <span className="font-bold underline">{categoryParam}</span></span>}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-gray-100 border border-gray-300 rounded-md text-sm py-1 px-2 outline-none focus:ring-1 focus:ring-[#e77600] cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Avg. Customer Review</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 px-4 pb-12 mt-4">

        {/* Sidebar Filters */}
        <aside className="hidden md:block w-[240px] flex-shrink-0 space-y-6">
          <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
            <h3 className="font-bold text-sm mb-3 uppercase tracking-wider text-gray-500">Refine by</h3>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={bestSellerOnly}
                  onChange={toggleBestSeller}
                  className="w-4 h-4 rounded border-gray-300 text-[#e77600] focus:ring-[#e77600]"
                />
                <span className={`text-sm ${bestSellerOnly ? 'font-bold text-black' : 'text-gray-700 group-hover:text-[#C45500]'}`}>Best Sellers</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={dealsOnly}
                  onChange={toggleDeals}
                  className="w-4 h-4 rounded border-gray-300 text-[#e77600] focus:ring-[#e77600]"
                />
                <span className={`text-sm ${dealsOnly ? 'font-bold text-black' : 'text-gray-700 group-hover:text-[#C45500]'}`}>Limited Time Deals</span>
              </label>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="font-bold text-sm mb-3">Customer Review</h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((stars) => (
                  <button key={stars} className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#C45500] w-full text-left">
                    <span className="text-[#F3A847]">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
                    <span>& Up</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#FEBD69]/10 p-4 border border-[#FEBD69]/30 rounded">
            <p className="text-xs font-medium text-gray-800">
              <span className="font-bold">Prime Members:</span> Enjoy FREE Delivery and early access to deals.
            </p>
          </div>
        </aside>

        {/* Main Product Area */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 border border-red-400 rounded">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-12 text-center rounded shadow-sm flex flex-col items-center">
              <div className="text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">No items match your filters.</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search criteria or clearing filters.</p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-[#FFD814] hover:bg-[#F7CA00] text-black px-6 py-2 rounded-full shadow-sm text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 4} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12 mb-6 space-x-2">
                  <button
                    onClick={() => {
                      const newPage = Math.max(1, currentPage - 1);
                      setCurrentPage(newPage);
                      const newUrl = buildQueryUrl({ page: newPage, search: searchParam, category: categoryParam, sort: sortBy, bestSeller: bestSellerOnly, deals: dealsOnly });
                      window.history.pushState(null, '', newUrl);
                    }}
                    disabled={currentPage === 1}
                    className="px-6 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 flex items-center disabled:opacity-50 shadow-sm transition-all"
                  >
                    <ChevronLeftIcon className="h-5 w-5 mr-1" />
                    Previous
                  </button>
                  <div className="flex items-center px-6 py-2 font-medium">
                    Page <span className="mx-1 text-[#C45500] font-bold">{currentPage}</span> of {totalPages}
                  </div>
                  <button
                    onClick={() => {
                      const newPage = Math.min(totalPages, currentPage + 1);
                      setCurrentPage(newPage);
                      const newUrl = buildQueryUrl({ page: newPage, search: searchParam, category: categoryParam, sort: sortBy, bestSeller: bestSellerOnly, deals: dealsOnly });
                      window.history.pushState(null, '', newUrl);
                    }}
                    disabled={currentPage === totalPages}
                    className="px-6 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 flex items-center disabled:opacity-50 shadow-sm transition-all"
                  >
                    Next
                    <ChevronRightIcon className="h-5 w-5 ml-1" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
