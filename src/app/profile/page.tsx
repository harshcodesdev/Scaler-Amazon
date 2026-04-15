"use client";

import { useAuth } from "@/context/AuthContext";
import { formatINR } from "@/lib/formatPrice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import LocationModal from "@/components/layout/LocationModal";

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(true);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [userAddress, setUserAddress] = useState("123, Amazon Colony, Civil Lines, Nagpur, MS - 440001");
  const { signOutUser } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin?redirect=/profile");
    }
  }, [user, isLoading, router]);

  // Fetch recent orders preview
  useEffect(() => {
    if (!user) return;
    fetch(`/api/orders/list?email=${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(data => {
        setOrders(data.orders?.slice(0, 3) || []);
      })
      .finally(() => setFetchingOrders(false));
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e47911]"></div>
      </div>
    );
  }

  const accountCards = [
    {
      title: "Your Orders",
      desc: "Track, return, or buy things again",
      icon: "https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/Box._CB485935122_.png",
      link: "/orders"
    },
    {
      title: "Login & security",
      desc: "Edit login, name, and mobile number",
      icon: "https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/sign-in-lock._CB485931504_.png",
      onClick: () => { if (confirm("Do you want to sign out?")) signOutUser(); }
    },
    {
      title: "Your Wishlist",
      desc: "View and edit your liked items",
      icon: "https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/amazon_pay._CB485946870_.png",
      link: "/wishlist"
    },
    {
      title: "Prime",
      desc: "View benefit and payment settings",
      icon: "https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/rc_prime._CB485946870_.png",
      link: "#"
    },
    {
      title: "Your Addresses",
      desc: "Edit addresses for orders and gifts",
      icon: "https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/address-map-pin._CB485934183_.png",
      onClick: () => setIsAddressOpen(true)
    },
    {
      title: "Contact Us",
      desc: "Contact us through our mail",
      icon: "https://m.media-amazon.com/images/G/31/x-locale/cs/help/images/gateway/self-service/contact_us._CB623781998_.png",
      onClick: () => {
        window.open(
          "https://mail.google.com/mail/?view=cm&fs=1&to=support@yourdomain.com&su=Support&body=Hi",
          "_blank"
        );
      }
    }
  ];


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-medium mb-8">Your Account</h1>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {accountCards.map((card, i) => (
            card.link ? (
              <Link
                key={i}
                href={card.link}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="shrink-0 w-16 h-16 relative">
                  <Image src={card.icon} alt={card.title} fill className="object-contain" />
                </div>
                <div>
                  <h3 className="text-lg font-medium group-hover:text-[#c45500]">{card.title}</h3>
                  <p className="text-sm text-gray-500">{card.desc}</p>
                </div>
              </Link>
            ) : (
              <button
                key={i}
                onClick={card.onClick}
                className="flex items-center text-left gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="shrink-0 w-16 h-16 relative">
                  <Image src={card.icon} alt={card.title} fill className="object-contain" />
                </div>
                <div>
                  <h3 className="text-lg font-medium group-hover:text-[#c45500]">{card.title}</h3>
                  <p className="text-sm text-gray-500">{card.desc}</p>
                </div>
              </button>
            )
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Details & Address */}
          <div className="lg:col-span-2 space-y-8">
            <section className="border border-gray-200 rounded-lg p-6 bg-gray-50/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Personal Information</h2>
                <button className="text-[#007185] hover:text-[#C7511F] text-sm font-medium hover:underline">Edit</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Full Name</p>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Email Address</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Phone Number</p>
                  <p className="font-medium text-gray-900">+91 98765 43210</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Account Type</p>
                  <p className="font-medium text-gray-900">Personal Account</p>
                </div>
              </div>
            </section>

            <section className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-[#F0F2F2] px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-bold">Your Addresses</h2>
                <button onClick={() => setIsAddressOpen(true)} className="text-[#007185] text-sm font-medium hover:underline">Add Address</button>
              </div>
              <div className="p-6">
                <div className="border-2 border-[#e47911] rounded-lg p-4 bg-orange-50/30 relative">
                  <span className="absolute top-2 right-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Default</span>
                  <p className="font-bold mb-1">{user.name}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {userAddress}
                  </p>
                  <p className="text-sm mt-2 font-medium">Phone: +91 98765 43210</p>
                  <div className="mt-4 flex gap-4 text-xs font-medium text-[#007185]">
                    <button className="hover:underline">Edit</button>
                    <span className="text-gray-300">|</span>
                    <button className="hover:underline">Remove</button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Recent Orders Sidebar */}
          <div className="space-y-6">
            <section className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-[#F0F2F2] px-6 py-3 border-b border-gray-200">
                <h2 className="font-bold">Recent Orders</h2>
              </div>
              <div className="p-4 space-y-4">
                {fetchingOrders ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-10 bg-gray-100 rounded" />
                    <div className="h-10 bg-gray-100 rounded" />
                  </div>
                ) : orders.length > 0 ? (
                  <>
                    {orders.map(order => (
                      <div key={order.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className={`font-bold ${order.status === 'DELIVERED' ? 'text-green-600' : 'text-blue-600'}`}>{order.status}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-sm">{formatINR(order.total)}</p>
                          <Link href={`/orders/${order.id}`} className="text-[#007185] text-xs hover:underline">View</Link>
                        </div>
                      </div>
                    ))}
                    <Link href="/orders" className="block text-center text-sm font-medium text-[#007185] hover:underline pt-2">View all orders</Link>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 italic">No orders found.</p>
                )}
              </div>
            </section>

            <section className="bg-gradient-to-br from-[#131921] to-[#232F3E] rounded-lg p-6 text-white text-center">
              <p className="text-xs uppercase font-bold tracking-[0.2em] mb-2 text-gray-400">Recommended</p>
              <div className="w-12 h-12 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#FFD814]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>
              </div>
              <h4 className="font-bold mb-2">Prime Membership</h4>
              <p className="text-xs text-gray-400 mb-6">Enjoy unlimited free fast delivery, video streaming and more.</p>
              <button className="w-full bg-[#FFD814] text-black py-2 rounded font-bold text-xs hover:bg-[#F7CA00] transition-colors">Start your trial</button>
            </section>
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      {isAddressOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-[500px] rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#F0F2F2] px-6 py-4 flex justify-between items-center border-b border-gray-300">
              <h2 className="font-bold text-lg">Add a new address</h2>
              <button onClick={() => setIsAddressOpen(false)} className="text-gray-500 hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                <svg className="w-5 h-5 text-[#e47911]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                Use current location (precise map)
              </button>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">OR ENTER MANUALLY</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Full Name</label>
                  <input type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#e47911] outline-none" defaultValue={user.name || ""} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Address Line 1</label>
                  <input type="text" id="manual_address" className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#e47911] outline-none text-sm" placeholder="Flat, House no., Building, Company, Apartment" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Pincode</label>
                    <input type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#e47911] outline-none" placeholder="6-digit Pincode" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">City</label>
                    <input type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#e47911] outline-none" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  const val = (document.getElementById("manual_address") as HTMLInputElement)?.value;
                  if (val) setUserAddress(val);
                  setIsAddressOpen(false);
                }}
                className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black py-2.5 rounded shadow-sm border border-[#FCD200] font-bold transition-colors mt-2"
              >
                Add Address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Location Modal Overlay for Profile Page specifically */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelect={(loc: string) => {
          setUserAddress(`Location selected via Map: ${loc}`);
          setIsLocationModalOpen(false);
          setIsAddressOpen(false);
        }}
      />
    </div>
  );
}
