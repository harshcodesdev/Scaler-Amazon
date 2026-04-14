"use client";

import Link from "next/link";
import Image from "next/image";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = [
    {
      title: "Get to Know Us",
      links: ["About Amazon", "Careers", "Press Releases", "Amazon Science"],
    },
    {
      title: "Connect with Us",
      links: ["Facebook", "Twitter", "Instagram"],
    },
    {
      title: "Make Money with Us",
      links: [
        "Sell on Amazon",
        "Sell under Amazon Accelerator",
        "Protect and Build Your Brand",
        "Become an Affiliate",
        "Fulfillment by Amazon",
      ],
    },
    {
      title: "Let Us Help You",
      links: [
        "Your Account",
        "Returns Centre",
        "100% Purchase Protection",
        "Amazon App Download",
        "Help",
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#232F3E] text-white mt-12">
      {/* Back to top */}
      <button
        onClick={scrollToTop}
        className="w-full py-4 bg-[#37475A] hover:bg-[#485769] transition-colors text-sm font-medium"
      >
        Back to top
      </button>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {footerLinks.map((section) => (
          <div key={section.title}>
            <h4 className="font-bold text-base mb-4">{section.title}</h4>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-sm text-gray-300 hover:underline hover:text-white"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Language and Brand */}
      <div className="border-t border-gray-700 py-8 flex flex-col items-center gap-6">
        <div className="flex items-center gap-12">
          <Link href="/">
            <Image
              src="/amazon-logo.png"
              alt="Amazon Logo"
              width={80}
              height={24}
              className="object-contain"
            />
          </Link>
          <div className="flex items-center gap-2 border border-gray-500 rounded px-3 py-1.5 cursor-pointer hover:border-gray-300">
            <GlobeAltIcon className="h-4 w-4 text-gray-300" />
            <span className="text-xs text-gray-300">English</span>
          </div>
        </div>
      </div>

      {/* Copyright and Legal */}
      <div className="bg-[#131A22] py-8 text-center">
        <div className="flex justify-center gap-6 text-xs text-gray-300 mb-4">
          <Link href="#" className="hover:underline">Conditions of Use & Sale</Link>
          <Link href="#" className="hover:underline">Privacy Notice</Link>
          <Link href="#" className="hover:underline">Interest-Based Ads</Link>
        </div>
        <p className="text-xs text-gray-400">
          © 1996-2026, Amazon - Harsh, Inc. or its affiliates
        </p>
      </div>
    </footer>
  );
}
