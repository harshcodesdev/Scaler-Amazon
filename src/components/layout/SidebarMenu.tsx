"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
}

export default function SidebarMenu({ isOpen, onClose, categories }: SidebarMenuProps) {
  const { user, signOutUser } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[1000] backdrop-blur-[1px]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[365px] max-w-[85%] bg-white z-[1001] shadow-2xl overflow-y-auto"
          >
            {/* User Profile Header */}
            <div className="bg-[#232f3e] text-white p-4 flex items-center justify-between sticky top-0 z-10">
              <Link href="/profile" onClick={onClose} className="flex items-center gap-3 decoration-0">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <User size={24} />
                </div>
                <span className="text-xl font-bold">Hello, {user?.name?.split(' ')[0] || "Harsh"}</span>
              </Link>
              <button
                onClick={onClose}
                className="hover:bg-white/10 p-1 rounded-sm transition-colors absolute -right-12 top-2 text-white"
              >
                <X size={32} />
              </button>
            </div>

            <div className="flex flex-col">
              {/* Section: Trending */}
              <div className="py-4 border-b border-gray-200">
                <h3 className="px-8 text-lg font-bold mb-2">Trending</h3>
                <MenuItem label="Bestsellers" href="/?isBestSeller=true" onClick={onClose} />
                <MenuItem label="Limited Time Deals" href="/?isLimitedTimeDeal=true" onClick={onClose} />
              </div>

              {/* Section: Digital Content and Devices */}
              <div className="py-4 border-b border-gray-200">
                <h3 className="px-8 text-lg font-bold mb-2">Digital Content and Devices</h3>
                <MenuItem label="Echo & Alexa" href="/?category=Electronics" onClick={onClose} hasChevron />
                <MenuItem label="Fire TV" href="/?category=Electronics" onClick={onClose} hasChevron />
                <MenuItem label="Kindle E-Readers & eBooks" href="/?category=Books" onClick={onClose} hasChevron />
                <MenuItem label="Audible Audiobooks" href="/?category=Books" onClick={onClose} hasChevron />
                <MenuItem label="Amazon Prime Video" href="/" onClick={onClose} hasChevron />
                <MenuItem label="Amazon Prime Music" href="/" onClick={onClose} hasChevron />
              </div>

              {/* Section: Shop by Category */}
              <div className="py-4 border-b border-gray-200">
                <h3 className="px-8 text-lg font-bold mb-2">Shop by Category</h3>
                {categories.slice(1, 8).map(cat => (
                  <MenuItem key={cat} label={cat} href={`/?category=${encodeURIComponent(cat)}`} onClick={onClose} hasChevron />
                ))}

                {/* Expandable Categories could go here */}
                <button className="w-full text-left px-8 py-3 hover:bg-gray-100 flex items-center gap-2 group">
                  <span className="text-sm font-medium group-hover:text-black">See all</span>
                  <ChevronRight size={16} className="rotate-90 text-gray-400" />
                </button>
              </div>

              {/* Section: Help & Settings */}
              <div className="py-4 mb-10">
                <h3 className="px-8 text-lg font-bold mb-2">Help & Settings</h3>
                <MenuItem label="Your Account" href="/profile" onClick={onClose} />
                <MenuItem label="Customer Service" href="/" onClick={onClose} />
                {user ? (
                  <button onClick={() => { signOutUser(); onClose(); }} className="w-full text-left px-8 py-3 hover:bg-gray-100 text-sm font-medium text-[#c45500]">Sign Out</button>
                ) : (
                  <MenuItem label="Sign In" href="/signin" onClick={onClose} />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MenuItem({ label, href, onClick, hasChevron }: { label: string; href: string; onClick: () => void; hasChevron?: boolean }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between px-8 py-3 hover:bg-gray-100 transition-colors group"
    >
      <span className="text-sm font-medium text-gray-700 group-hover:text-black">{label}</span>
      {hasChevron && <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600" />}
    </Link>
  );
}
