"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Plus,
  Eye,
  ArrowRight,
  TrendingDown,
  LayoutDashboard
} from "lucide-react";

export default function VendorDashboardPage() {
  const { user, profile, loading, isVendor } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isVendor) {
      router.push("/");
    }
  }, [loading, isVendor, router]);

  if (loading || !isVendor) return null;

  const stats = [
    { label: "Total Sales", value: "$12,450", icon: <DollarSign size={24} />, trend: "+15%", isPositive: true, color: "text-emerald", bg: "bg-emerald/10", border: "border-emerald/20" },
    { label: "Active Products", value: "24", icon: <Package size={24} />, trend: "+2 this week", isPositive: true, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { label: "Total Orders", value: "156", icon: <ShoppingCart size={24} />, trend: "-4%", isPositive: false, color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
    { label: "Store Views", value: "4.2k", icon: <Eye size={24} />, trend: "+24%", isPositive: true, color: "text-cyan", bg: "bg-cyan/10", border: "border-cyan/20" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
               <LayoutDashboard size={20} />
             </div>
             Vendor Dashboard
          </h1>
          <p className="mt-2 text-text-secondary">Manage your store, products, and insights here.</p>
        </div>
        
        <div className="flex items-center gap-4">
           {profile?.isApproved ? (
              <Link
                href="/vendor/products/new"
                className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              >
                 <span className="relative z-10 flex items-center gap-2"><Plus size={18} /> Add Product</span>
              </Link>
           ) : (
              <div className="rounded-xl border border-amber/20 bg-amber/10 px-4 py-2 flex items-center gap-2 text-sm font-bold text-amber">
                 Account Pending Approval
              </div>
           )}
        </div>
      </div>

      {!profile?.isApproved && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 rounded-2xl border border-destructive/20 bg-destructive/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
             <h3 className="text-lg font-bold text-destructive">Your store is currently inactive</h3>
             <p className="text-sm text-destructive/80 mt-1">An administrator needs to approve your vendor application before you can list products.</p>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className={`mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 ${!profile?.isApproved ? 'opacity-50 pointer-events-none' : ''} lg:grid-cols-4`}>
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-3xl border border-white/5 bg-surface p-6 shadow-xl relative overflow-hidden group hover:border-white/10 transition-colors"
          >
            <div className="relative z-10">
               <div className="flex items-start justify-between mb-6">
                 <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${stat.bg} ${stat.color} ${stat.border} transition-transform group-hover:scale-110`}>
                   {stat.icon}
                 </div>
                 <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${stat.isPositive ? 'bg-emerald/10 text-emerald' : 'bg-red-500/10 text-red-400'}`}>
                   {stat.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                   {stat.trend}
                 </div>
               </div>
               <div>
                 <h2 className="text-3xl font-extrabold text-white">{stat.value}</h2>
                 <p className="text-sm font-bold text-text-muted uppercase tracking-widest mt-1">{stat.label}</p>
               </div>
            </div>
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 z-0 bg-carbon" />
          </motion.div>
        ))}
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${!profile?.isApproved ? 'opacity-50 pointer-events-none' : ''}`}>
         {/* Recent Orders List */}
         <div className="lg:col-span-2 rounded-3xl border border-white/5 bg-surface shadow-xl overflow-hidden">
            <div className="border-b border-white/5 p-6 flex items-center justify-between">
               <h2 className="text-xl font-bold text-white">Recent Orders</h2>
               <Link href="/vendor/orders" className="text-sm font-bold text-primary hover:text-primary-light transition-colors flex items-center gap-1">
                  View All <ArrowRight size={16} />
               </Link>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead className="bg-surface-elevated text-xs font-bold uppercase tracking-widest text-text-muted">
                     <tr>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {[
                        { id: "ORD-9281", date: "Today, 10:24 AM", status: "processing", amount: "$1,199" },
                        { id: "ORD-3452", date: "Yesterday", status: "shipped", amount: "$349" },
                        { id: "ORD-1284", date: "Oct 24, 2025", status: "delivered", amount: "$2,498" },
                     ].map((order, i) => (
                        <tr key={i} className="transition-colors hover:bg-white/5">
                           <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                           <td className="px-6 py-4 text-text-muted">{order.date}</td>
                           <td className="px-6 py-4">
                              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                                 order.status === 'processing' ? 'bg-amber/10 text-amber' :
                                 order.status === 'shipped' ? 'bg-primary/10 text-primary' :
                                 'bg-emerald/10 text-emerald'
                              }`}>
                                 {order.status}
                              </span>
                           </td>
                           <td className="px-6 py-4 font-bold text-white">{order.amount}</td>
                           <td className="px-6 py-4">
                              <button className="font-medium text-primary hover:text-primary-light transition-colors">Details</button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Store Insights */}
         <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Store Insights</h2>
            <div className="rounded-3xl border border-white/5 bg-surface p-6 shadow-xl space-y-6">
               <div>
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-sm font-bold text-text-secondary">Sales Goal</span>
                     <span className="text-sm font-bold text-emerald">85%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface-elevated overflow-hidden">
                     <div className="h-full bg-emerald w-[85%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  </div>
               </div>
               <div>
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-sm font-bold text-text-secondary">Product Rating</span>
                     <span className="text-sm font-bold text-amber">4.8/5.0</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface-elevated overflow-hidden">
                     <div className="h-full bg-amber w-[96%] rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                  </div>
               </div>
            </div>

            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 shadow-xl glow-blue relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-lg font-bold text-white mb-2">Boost Your Sales</h3>
                  <p className="text-sm text-text-secondary max-w-[200px] mb-4">Promote your top-selling items to reach more customers this holiday season.</p>
                  <button className="rounded-xl border border-white/10 bg-surface px-4 py-2 text-sm font-bold text-white hover:bg-white/5 transition-colors">
                     Create Campaign
                  </button>
               </div>
               <div className="absolute -right-10 -bottom-10 opacity-20 mix-blend-screen pointer-events-none">
                  <TrendingUp size={150} className="text-primary" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
