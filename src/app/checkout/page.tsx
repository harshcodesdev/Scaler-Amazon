"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { formatINR } from "@/lib/formatPrice";
import {
  CreditCard,
  Smartphone,
  Landmark,
  Wallet,
  Banknote,
  CheckCircle,
  AlertCircle,
  Truck,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import Image from "next/image";

type PaymentMethod = "UPI" | "CARD" | "NETBANKING" | "EMI" | "COD";

interface Provider {
  id: string;
  name: string;
  isMostlyUsed?: boolean;
}

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [selectedProvider, setSelectedProvider] = useState<string>("amazon_pay_upi");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    zip: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  if (cartItems.length === 0 && !orderConfirmed) {
    router.push("/cart");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const estimatedTax = cartTotal * 0.18;
  const shippingCharge = cartTotal > 500 ? 0 : 40;
  const orderTotal = cartTotal + estimatedTax + shippingCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      items: cartItems.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        imageUrl: item.product.imageUrl,
        quantity: item.quantity,
        unitPrice: item.product.price
      })),
      total: orderTotal,
      email: formData.email,
      name: formData.name,
      address: `${formData.address}, ${formData.city}, ${formData.zip}`,
      paymentMethod,
      paymentProvider: selectedProvider
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      setOrderConfirmed(data.orderId);
      clearCart();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const upiProviders: Provider[] = [
    { id: "amazon_pay_upi", name: "Amazon Pay UPI", isMostlyUsed: true },
    { id: "gpay", name: "Google Pay" },
    { id: "phonepe", name: "PhonePe" },
    { id: "paytm", name: "Paytm" },
  ];

  const cardProviders: Provider[] = [
    { id: "axis_bank", name: "Axis Bank Credit Card" },
    { id: "sbi_card", name: "SBI Credit Card" },
    { id: "other_card", name: "Other Credit/Debit Card" },
  ];

  const netBankingProviders: Provider[] = [
    { id: "sbi", name: "State Bank of India" },
    { id: "hdfc", name: "HDFC Bank" },
    { id: "icici", name: "ICICI Bank" },
    { id: "axis", name: "Axis Bank" },
  ];

  if (orderConfirmed) {
    return (
      <div className="max-w-[800px] mx-auto p-4 py-16 text-center">
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-center mb-6">
            <CheckCircle size={80} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-medium mb-4 text-green-700">Order Placed, thank you!</h1>
          <p className="text-gray-600 mb-6 text-lg">Confirmation will be sent to your email.</p>
          <div className="bg-gray-50 p-4 rounded mb-8 text-left inline-block w-full max-w-sm mx-auto border border-gray-200">
            <p className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">Order Number</p>
            <p className="font-mono text-lg font-bold">#{orderConfirmed}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/orders" className="text-sm font-medium text-[#007185] hover:underline">View your orders</Link>
            <Link href="/" className="bg-[#FF9900] hover:bg-[#F3A847] text-black border border-[#a88734] py-2 px-8 rounded shadow-sm font-medium">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Checkout Navbar */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-50">
        <div className="max-w-[1150px] mx-auto flex items-center justify-between">
          <Link href="/">
            <Image src="/amazon-logo.png" alt="Amazon" width={100} height={30} className="object-contain invert brightness-0" />
          </Link>
          <h1 className="text-2xl font-medium text-gray-800">Checkout</h1>
          <div className="hidden sm:block">
            <ShieldCheck size={28} className="text-gray-400" />
          </div>
        </div>
      </div>

      <div className="max-w-[1150px] mx-auto p-4 mt-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 border border-red-200 rounded-md mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Main Content */}
          <div className="flex-1 space-y-4">

            {/* 1. Shipping Section */}
            <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-gray-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <h2 className="text-xl font-bold">Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-gray-600 uppercase">Receiver Name</label>
                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(255,153,0,0.2)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-gray-600 uppercase">Mobile Number</label>
                    <input required name="mobile" value={formData.mobile} onChange={handleChange} placeholder="10-digit mobile number" className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(255,153,0,0.2)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-gray-600 uppercase">Email Address</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(255,153,0,0.2)] outline-none" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-gray-600 uppercase">Street Address</label>
                    <textarea required name="address" rows={2} value={formData.address} onChange={handleChange} className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(255,153,0,0.2)] outline-none resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold mb-1 text-gray-600 uppercase">City</label>
                      <input required name="city" value={formData.city} onChange={handleChange} className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(255,153,0,0.2)] outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-gray-600 uppercase">Pincode</label>
                      <input required name="zip" value={formData.zip} onChange={handleChange} className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(255,153,0,0.2)] outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Payment Section */}
            <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-gray-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <h2 className="text-xl font-bold">Select a Payment Method</h2>
              </div>

              <div className="ml-10 space-y-4">

                {/* UPI Options */}
                <div className={`border rounded-lg p-4 transition-all ${paymentMethod === "UPI" ? "border-[#e77600] bg-orange-50" : "border-gray-200"}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" checked={paymentMethod === "UPI"} onChange={() => setPaymentMethod("UPI")} className="w-4 h-4 text-[#e77600] focus:ring-[#e77600]" />
                    <div className="flex items-center gap-2">
                      <Smartphone size={18} className="text-gray-500" />
                      <span className="font-bold">Other UPI Apps</span>
                    </div>
                  </label>

                  {paymentMethod === "UPI" && (
                    <div className="mt-4 ml-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {upiProviders.map(p => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedProvider(p.id)}
                          className={`p-3 border rounded-md flex items-center justify-between text-left transition-all hover:bg-white ${selectedProvider === p.id ? "border-[#e77600] ring-1 ring-[#e77600] bg-white" : "border-gray-300 bg-gray-50 text-gray-600"}`}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{p.name}</span>
                            {p.isMostlyUsed && <span className="text-[10px] text-green-700 font-bold uppercase tracking-tight">Mostly Used</span>}
                          </div>
                          {selectedProvider === p.id && <CheckCircle size={16} className="text-[#e77600]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Options */}
                <div className={`border rounded-lg p-4 transition-all ${paymentMethod === "CARD" ? "border-[#e77600] bg-orange-50" : "border-gray-200"}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" checked={paymentMethod === "CARD"} onChange={() => setPaymentMethod("CARD")} className="w-4 h-4 text-[#e77600] focus:ring-[#e77600]" />
                    <div className="flex items-center gap-2">
                      <CreditCard size={18} className="text-gray-500" />
                      <span className="font-bold">Credit or Debit Card</span>
                    </div>
                  </label>

                  {paymentMethod === "CARD" && (
                    <div className="mt-4 ml-7 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {cardProviders.map(p => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedProvider(p.id)}
                            className={`px-4 py-2 border rounded-full text-xs font-bold transition-all ${selectedProvider === p.id ? "bg-[#e77600] text-white border-transparent" : "bg-white border-gray-300 text-gray-700"}`}
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                      <div className="relative max-w-sm">
                        <input placeholder="Card Number" className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-[#e77600]" />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                          <div className="w-6 h-4 bg-blue-800 rounded-sm" />
                          <div className="w-6 h-4 bg-orange-600 rounded-sm" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Net Banking */}
                <div className={`border rounded-lg p-4 transition-all ${paymentMethod === "NETBANKING" ? "border-[#e77600] bg-orange-50" : "border-gray-200"}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" checked={paymentMethod === "NETBANKING"} onChange={() => setPaymentMethod("NETBANKING")} className="w-4 h-4 text-[#e77600] focus:ring-[#e77600]" />
                    <div className="flex items-center gap-2">
                      <Landmark size={18} className="text-gray-500" />
                      <span className="font-bold">Net Banking</span>
                    </div>
                  </label>
                  {paymentMethod === "NETBANKING" && (
                    <select className="mt-3 ml-7 w-full sm:w-64 p-2 border border-gray-300 rounded text-sm bg-white outline-none cursor-pointer">
                      <option>Choose an Option</option>
                      {netBankingProviders.map(p => <option key={p.id}>{p.name}</option>)}
                    </select>
                  )}
                </div>

                {/* EMI */}
                <div className={`border rounded-lg p-4 transition-all ${paymentMethod === "EMI" ? "border-[#e77600] bg-orange-50" : "border-gray-200"}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" checked={paymentMethod === "EMI"} onChange={() => setPaymentMethod("EMI")} className="w-4 h-4 text-[#e77600] focus:ring-[#e77600]" />
                    <div className="flex items-center gap-2">
                      <Wallet size={18} className="text-gray-500" />
                      <span className="font-bold">EMI</span>
                    </div>
                  </label>
                  {paymentMethod === "EMI" && <p className="mt-2 ml-7 text-xs text-gray-500">EMI options are available on select cards. <span className="text-[#007185] hover:underline cursor-pointer">Details</span></p>}
                </div>

                {/* COD */}
                <div className={`border rounded-lg p-4 transition-all ${paymentMethod === "COD" ? "border-[#e77600] bg-orange-50" : "border-gray-200"}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} className="w-4 h-4 text-[#e77600] focus:ring-[#e77600]" />
                    <div className="flex items-center gap-2">
                      <Banknote size={18} className="text-gray-500" />
                      <span className="font-bold">Cash on Delivery</span>
                    </div>
                  </label>
                </div>

              </div>
            </div>

            {/* 3. Items Review Section */}
            <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-gray-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <h2 className="text-xl font-bold">Review Items and Delivery</h2>
              </div>

              <div className="ml-10 space-y-4">
                {cartItems.map(item => (
                  <div key={item.product.id} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="w-20 h-20 relative shrink-0">
                      <Image src={item.product.imageUrl} alt={item.product.title} fill className="object-contain" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold line-clamp-1">{item.product.title}</h4>
                      <p className="text-xs text-green-700 font-bold mt-1">In stock</p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-[#b12704] mt-1">{formatINR(item.product.price)}</p>
                    </div>
                    <div className="hidden sm:block text-xs text-gray-600">
                      <p className="font-bold">Delivery date:</p>
                      <p>Tomorrow, by 11pm</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Area */}
          <div className="lg:w-[350px]">
            <div className="bg-white p-6 rounded border border-gray-200 shadow-sm sticky top-[80px]">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black border border-[#FCD200] py-2.5 rounded-lg shadow-sm font-bold mb-4 disabled:opacity-50 transition-colors"
              >
                {loading ? "Processing..." : "Place your order"}
              </button>

              <p className="text-[10px] text-center text-gray-500 px-4 mb-6 leading-tight">
                By placing your order, you agree to Amazon's privacy notice and <span className="text-[#007185] hover:underline cursor-pointer">conditions of use</span>.
              </p>

              <div className="border-t border-gray-100 pt-4">
                <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-500">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium text-gray-800">{formatINR(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery:</span>
                    <span className={`font-medium ${shippingCharge === 0 ? "text-green-700" : "text-gray-800"}`}>
                      {shippingCharge === 0 ? "FREE" : formatINR(shippingCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated GST (18%):</span>
                    <span className="font-medium text-gray-800">{formatINR(estimatedTax)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-xl text-[#b12704]">
                    <span>Order Total:</span>
                    <span>{formatINR(orderTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gray-50 p-4 rounded border-t border-b border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-green-600 text-white p-1 rounded-full">
                    <ShieldCheck size={12} />
                  </div>
                  <span className="text-xs font-bold text-[#007185] hover:underline cursor-pointer">Secure Transaction</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-gray-400" />
                  <span className="text-[10px] text-gray-500">Free delivery on eligible orders over ₹499.</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
