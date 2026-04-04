"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Package, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  ChevronRight, 
  User as UserIcon,
  MapPin,
  CreditCard,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { getCustomerOrders, getCustomerStats } from "@/services/orderService";
import { Order } from "@/types";
import Link from "next/link";

export default function CustomerDashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalSpent: 0, totalOrders: 0, pendingOrders: 0 });
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const [fetchedOrders, fetchedStats] = await Promise.all([
            getCustomerOrders(user.uid),
            getCustomerStats(user.uid)
          ]);
          setOrders(fetchedOrders);
          setStats(fetchedStats);
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        } finally {
          setFetching(false);
        }
      }
    };
    fetchData();
  }, [user]);

  if (loading || !user) return null;

  const dashboardStats = [
    { label: "Total Spent", value: `$${stats.totalSpent.toLocaleString()}`, icon: <DollarSign size={20} />, color: "text-emerald", bg: "bg-emerald/10" },
    { label: "Total Orders", value: stats.totalOrders, icon: <Package size={20} />, color: "text-primary", bg: "bg-primary/10" },
    { label: "Pending", value: stats.pendingOrders, icon: <Clock size={20} />, color: "text-accent", bg: "bg-accent/10" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      {/* Welcome Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Customer Account</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{profile?.name.split(' ')[0]}</span>
          </h1>
          <p className="mt-2 text-text-secondary text-lg">Manage your orders, profile, and tech collection.</p>
        </div>
        
        <Link 
          href="/products" 
          className="flex items-center gap-2 rounded-2xl bg-surface-elevated border border-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/5 transition-colors"
        >
          Explore More Tech <ChevronRight size={16} />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {dashboardStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-3xl border border-white/5 bg-surface p-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-carbon z-0" />
            <div className="relative z-10 flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-text-muted uppercase tracking-wider">{stat.label}</p>
                <h2 className="text-2xl font-black text-white">{fetching ? "..." : stat.value}</h2>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
             <h3 className="text-xl font-bold text-white flex items-center gap-2">
               Recent Orders
             </h3>
             <Link href="/orders" className="text-sm font-bold text-text-muted hover:text-primary transition-colors">
               View All
             </Link>
          </div>

          <div className="space-y-4">
            {fetching ? (
              <div className="h-40 w-full animate-pulse rounded-3xl bg-surface-elevated" />
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="group relative rounded-3xl border border-white/5 bg-surface p-6 shadow-lg transition-all hover:border-primary/20">
                  <div className="absolute inset-0 bg-carbon rounded-3xl z-0" />
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-elevated text-primary">
                        <ShoppingBag size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">Order #{order.id.slice(-6).toUpperCase()}</h4>
                        <p className="text-sm text-text-muted">
                           {order.createdAt?.toDate().toLocaleDateString() || "Recent"} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 justify-between sm:justify-end">
                      <div className="text-right">
                        <p className="text-xl font-black text-white">${order.totalAmount.toLocaleString()}</p>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest
                          ${order.deliveryStatus === 'delivered' ? 'bg-emerald/10 text-emerald' : 
                            order.deliveryStatus === 'pending' ? 'bg-amber/10 text-amber' : 'bg-primary/10 text-primary'}`}
                        >
                          {order.deliveryStatus}
                        </span>
                      </div>
                      <Link 
                        href={`/orders/success?ref=${order.id}`}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-elevated text-text-muted hover:text-white transition-colors"
                      >
                        <ExternalLink size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 p-12 text-center text-text-muted">
                <Package size={40} className="mb-4 opacity-50" />
                <p className="font-bold">No orders found.</p>
                <Link href="/products" className="mt-4 text-primary font-bold hover:underline">Start shopping</Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Profile Summary */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">Account Overview</h3>
          
          <div className="rounded-3xl border border-white/5 bg-surface p-8 shadow-xl relative overflow-hidden">
             <div className="absolute inset-0 bg-carbon z-0" />
             <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                   <div className="h-16 w-16 rounded-2xl bg-surface-elevated border border-white/5 flex items-center justify-center text-text-muted overflow-hidden">
                      {profile?.photoURL ? <img src={profile.photoURL} alt="" /> : <UserIcon size={32} />}
                   </div>
                   <div>
                      <h4 className="text-xl font-extrabold text-white">{profile?.name}</h4>
                      <p className="text-sm text-text-muted">{profile?.email}</p>
                   </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                   <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-primary mt-0.5" />
                      <div>
                         <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Shipping Default</p>
                         <p className="text-sm text-white leading-relaxed">
                            {profile?.name}<br />
                            Enter your address in settings
                         </p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <CreditCard size={18} className="text-emerald" />
                      <div>
                         <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Card on File</p>
                         <p className="text-sm text-white">Visa ending in **** 4242</p>
                      </div>
                   </div>
                </div>

                <Link href="/profile" className="block w-full mt-4 rounded-2xl bg-surface-elevated border border-white/5 py-4 text-center text-sm font-bold text-white hover:bg-white/5 transition-all">
                   Manage Profile Account
                </Link>
             </div>
          </div>

          {/* Upgrade Prompt / Banner */}
          <div className="rounded-3xl bg-primary/10 border border-primary/20 p-8 shadow-xl relative overflow-hidden group cursor-pointer">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <ShieldCheck size={80} />
              </div>
              <h4 className="text-lg font-black text-white mb-2">Feeltech Prime</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                 Get unlimited free shipping and exclusive early access to next-gen hardware.
              </p>
              <button className="mt-6 text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                 Join Today <ChevronRight size={14} />
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
