"use client";

import { useAuth } from "@/context/AuthContext";
import { formatINR } from "@/lib/formatPrice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: {
    id: string;
    title: string;
    imageUrl: string;
  };
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  address: string | null;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin?redirect=/orders");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/orders/list?email=${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(data => setOrders(data.orders || []))
      .finally(() => setFetching(false));
  }, [user]);

  if (isLoading || fetching) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    CONFIRMED: "bg-green-100 text-green-700",
    SHIPPED: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-purple-100 text-purple-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-medium mb-6">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-24 border border-gray-200 rounded-lg bg-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
          </svg>
          <p className="text-gray-500 text-lg mb-4">No orders yet.</p>
          <Link href="/" className="bg-[#FF9900] hover:bg-[#F3A847] text-black font-medium py-2 px-6 rounded shadow-sm">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-3 flex flex-wrap gap-4 justify-between items-center border-b border-gray-200 text-sm">
                <div className="flex flex-wrap gap-6">
                  <div>
                    <p className="text-gray-500 uppercase text-xs font-bold tracking-wide">Order placed</p>
                    <p className="font-medium">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 uppercase text-xs font-bold tracking-wide">Total</p>
                    <p className="font-medium">{formatINR(order.total)}</p>
                  </div>
                  {order.address && (
                    <div>
                      <p className="text-gray-500 uppercase text-xs font-bold tracking-wide">Ship to</p>
                      <p className="font-medium">{order.address}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                    {order.status}
                  </span>
                  <Link href={`/orders/${order.id}`} className="text-[#007185] hover:text-[#C7511F] hover:underline text-sm font-medium">
                    View order details
                  </Link>
                </div>
              </div>

              {/* Items preview */}
              <div className="px-6 py-4 flex gap-4 flex-wrap">
                {order.items.slice(0, 4).map(item => (
                  <div key={item.id} className="flex gap-3 items-start">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="w-16 h-16 object-contain border border-gray-100 rounded"
                    />
                    <div className="text-sm max-w-[200px]">
                      <p className="text-[#007185] line-clamp-2 hover:text-[#C7511F]">{item.product.title}</p>
                      <p className="text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="font-medium">{formatINR(item.unitPrice)}</p>
                    </div>
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div className="flex items-center text-gray-400 text-sm">+{order.items.length - 4} more</div>
                )}
              </div>

              {/* Footer actions */}
              <div className="px-6 py-3 border-t border-gray-100 flex gap-3">
                <Link href={`/orders/${order.id}`} className="text-sm bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-1.5 px-4 rounded border border-gray-300 shadow-sm">
                  View order details
                </Link>
                <button
                  onClick={() => {
                    // Logic to buy first item again as a shortcut or go to details
                    router.push(`/orders/${order.id}`);
                  }}
                  className="text-sm bg-[#FFD814] hover:bg-[#F7CA00] text-black font-medium py-1.5 px-4 rounded border border-[#FCD200] shadow-sm"
                >
                  Buy it again
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
