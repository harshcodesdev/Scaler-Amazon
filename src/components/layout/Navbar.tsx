"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { Menu, Heart, ShoppingCart, User as UserIcon } from "lucide-react";
import LocationModal from "./LocationModal";
import SidebarMenu from "./SidebarMenu";

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { itemCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, signOutUser } = useAuth();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All Categories");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [location, setLocation] = useState("Nagpur 440022");
  const [language, setLanguage] = useState("EN");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const wishlistCount = wishlistItems.length;

  const languages = [
    { code: "EN", name: "English", flag: "🇮🇳" },
    { code: "HI", name: "Hindi - HI", flag: "🇮🇳" },
    { code: "TA", name: "Tamil - TA", flag: "🇮🇳" },
    { code: "TE", name: "Telugu - TE", flag: "🇮🇳" },
    { code: "KN", name: "Kannada - KN", flag: "🇮🇳" },
  ];

  const categories = [
    "All Categories",
    "Men's Clothing",
    "Women's Clothing",
    "Appliances",
    "Baby",
    "Beauty",
    "Books",
    "Shoes",
    "Electronics",
    "Furniture",
    "Home & Kitchen",
    "Bags",
    "Jewelery",
    "Toys & Games",
  ];

  const subNavLinks = [
    { label: "Electronics", value: "Electronics" },
    { label: "Baby", value: "Baby" },
    { label: "Beauty", value: "Beauty" },
    { label: "Books", value: "Books" },
    { label: "Appliances", value: "Appliances" },
    { label: "Men's", value: "Men's Clothing" },
    { label: "Women's", value: "Women's Clothing" },
    { label: "Toys & Games", value: "Toys & Games" },
    { label: "Home & Kitchen", value: "Home & Kitchen" },
    { label: "Shoes", value: "Shoes" },
    { label: "Bags", value: "Bags" },
    { label: "Today's Deals", value: "" },
    { label: "Best Sellers", value: "" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      localStorage.setItem("amazon-harshdeep-latest-search", search.trim());
    }
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category && category !== "All Categories") params.set("category", category);

    router.push(`/?${params.toString()}`);
  };

  return (
    <>
      <header className="flex flex-col sticky top-0 z-[100] shadow-md transition-all">
        {/* Top Main Nav */}
        <div className="bg-[#131921] px-4 py-2 flex items-center justify-between space-x-2 md:space-x-4">

          <div className="flex items-center space-x-1 md:space-x-4">
            {/* Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-1 border border-transparent hover:border-white rounded-sm text-white md:hidden"
            >
              <Menu size={28} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center pt-2 border border-transparent hover:border-white p-1 rounded-sm shrink-0">
              <Image
                src="/amazon-logo.png"
                alt="Amazon"
                width={85}
                height={25}
                className="object-contain md:w-[100px] md:h-[30px]"
              />
            </Link>

            {/* Location Selector */}
            <div
              onClick={() => setIsLocationOpen(true)}
              className="hidden lg:flex items-center gap-1 cursor-pointer border border-transparent hover:border-white p-1 rounded-sm text-white shrink-0"
            >
              <div className="pt-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-300 text-[11px] font-medium leading-none">Delivering to {location.split(' ')[0]}</p>
                <p className="font-bold text-sm leading-tight text-white">Update location</p>
              </div>
            </div>
          </div>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 mx-2 lg:mx-4 max-w-3xl">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-100 text-black px-2 py-2 rounded-l-md border-r border-gray-300 outline-none hover:bg-gray-200 text-xs max-w-[130px] truncate cursor-pointer font-medium"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search Amazon.in"
              className="flex-1 px-4 py-2 text-black bg-white outline-none placeholder:text-gray-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="bg-[#FEBD69] hover:bg-[#F3A847] px-4 py-2 rounded-r-md text-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </form>

          {/* Right Links */}
          <div className="flex items-center space-x-1 md:space-x-4 text-white text-sm shrink-0">

            {/* Language Switcher */}
            <div className="hidden lg:flex items-center gap-1 cursor-pointer border border-transparent hover:border-white p-2 rounded-sm relative group">
              <span className="text-base">🇮🇳</span>
              <span className="font-bold uppercase">{language}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>

              {/* Language Dropdown */}
              <div className="hidden group-hover:block absolute top-[90%] left-0 bg-white text-black p-4 shadow-xl rounded-sm mt-0.5 z-[150] min-w-[200px] border border-gray-200">
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 font-medium">Select Language</p>
                  {languages.map(lang => (
                    <label key={lang.code} className="flex items-center gap-2 cursor-pointer group/item">
                      <input
                        type="radio"
                        name="lang"
                        checked={language === lang.code}
                        onChange={() => setLanguage(lang.code)}
                        className="accent-[#e47911] w-4 h-4"
                      />
                      <span className="text-sm font-medium hover:text-[#e47911]">{lang.name}</span>
                    </label>
                  ))}
                  <div className="border-t border-gray-100 pt-2 mt-2">
                    <Link href="/" className="text-[11px] text-[#007185] hover:underline">Learn More ▾</Link>
                  </div>
                </div>
              </div>
            </div>

            {mounted && (
              user ? (
                <div className="cursor-pointer border border-transparent hover:border-white p-1 rounded-sm group relative">
                  <Link href="/profile" className="block">
                    <p className="text-[11px] text-gray-300 leading-none">Hello, {user.name?.split(' ')[0] || user.email.split('@')[0]}</p>
                    <p className="font-bold text-sm flex items-center gap-1">
                      Profile
                      {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg> */}
                    </p>
                  </Link>

                </div>
              ) : (
                <Link href="/signin" className="cursor-pointer border border-transparent hover:border-white p-1 rounded-sm">
                  <p className="text-[11px] text-gray-300 leading-none">Hello, sign in</p>
                  <p className="font-bold text-sm">Account & Lists</p>
                </Link>
              )
            )}

            <Link href="/orders" className="hidden lg:block cursor-pointer border border-transparent hover:border-white p-1 rounded-sm">
              <p className="text-[11px] text-gray-300 leading-none">Returns</p>
              <p className="font-bold text-sm">& Orders</p>
            </Link>

            <Link href="/wishlist" className="flex items-center cursor-pointer border border-transparent hover:border-white py-1 px-1 sm:px-2 rounded-sm relative group">
              <div className="relative pt-1">
                <Heart size={24} className={`sm:hidden ${wishlistCount > 0 ? "fill-red-500 text-red-500" : ""}`} />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 hidden sm:block">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.015-4.5-4.5-4.5-1.74 0-3.24 1-4 2.44-.76-1.44-2.26-2.44-4-2.44C5.015 3.75 3 5.765 3 8.25c0 6.75 9 11.25 9 11.25s9-4.5 9-11.25Z" />
                </svg>
                <span className="absolute -top-1 -right-2 text-[#e47911] font-bold text-xs px-1 bg-[#131921] rounded-full">
                  {mounted ? wishlistCount : 0}
                </span>
              </div>
              <span className="font-bold mt-2 ml-1 hidden lg:block">Wishlist</span>
            </Link>

            <Link href="/cart" className="flex items-center cursor-pointer border border-transparent hover:border-white py-1 px-1 sm:px-2 rounded-sm relative">
              <div className="relative pt-1">
                <ShoppingCart size={24} className="sm:hidden" />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 hidden sm:block">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                <span className="absolute -top-1 right-1 sm:right-2 text-[#e47911] font-bold text-xs px-1 bg-[#131921] rounded-full">
                  {mounted ? itemCount : 0}
                </span>
              </div>
              <span className="font-bold mt-2 hidden sm:block">Cart</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="bg-[#232F3E] p-2 sm:hidden flex">
          <form onSubmit={handleSearch} className="flex flex-1">
            <input
              type="text"
              placeholder="Search Amazon.in"
              className="flex-1 px-4 py-2 rounded-l-md text-black bg-white outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="bg-[#FEBD69] hover:bg-[#F3A847] px-4 py-2 rounded-r-md text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Category Links Band */}
        <div className="bg-[#232f3e] text-white text-[13px] px-4 py-1.5 flex items-center space-x-4 overflow-x-auto whitespace-nowrap scrollbar-hide border-t border-[#37475a]/30">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center space-x-1 cursor-pointer hover:border-white border border-transparent p-1 -ml-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <span className="font-bold">All</span>
          </button>
          {subNavLinks.map((link) => (
            <Link
              key={link.label}
              href={link.value ? `/?category=${encodeURIComponent(link.value)}` : "/"}
              className="cursor-pointer hover:border-white border border-transparent py-1 px-1.5 font-medium transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </header>

      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        onSelect={(loc) => {
          setLocation(loc);
          setIsLocationOpen(false);
        }}
      />

      <SidebarMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        categories={categories}
      />
    </>
  );
}
