import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { ToastProvider } from "@/context/ToastContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Amazon - Harsh",
  description: "A full-stack Amazon storefront experience by Harsh.",
  icons: {
    icon: "https://www.amazon.com/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-amazon-lightGray text-amazon-textPrimary`}>
        <AuthProvider>
          <ToastProvider>
            <WishlistProvider>
              <CartProvider>
                <React.Suspense fallback={<div>Loading mapping...</div>}>
                  <Navbar />
                </React.Suspense>
                <main className="min-h-screen">
                  {children}
                </main>
                <Footer />
              </CartProvider>
            </WishlistProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
