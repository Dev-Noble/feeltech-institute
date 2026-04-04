"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Package,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Car,
  ChevronDown,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { Order } from "@/types";

// Mock data representation
const MOCK_ORDERS = [
  { id: "ORD-9281A", customer: "Alex Johnson", date: "2026-04-04T10:24:00Z", status: "processing", amount: 1199, items: 1 },
  { id: "ORD-3452B", customer: "Sarah Miller", date: "2026-04-03T14:15:00Z", status: "shipped", amount: 349, items: 2 },
  { id: "ORD-1284C", customer: "Michael Chen", date: "2026-03-28T09:45:00Z", status: "delivered", amount: 2498, items: 3 },
  { id: "ORD-8821D", customer: "Emma Wilson", date: "2026-04-04T11:30:00Z", status: "processing", amount: 799, items: 1 },
];

export default function VendorOrdersPage() {
  const { user, loading, isVendor } = useAuth();
  const router = useRouter();
  
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!loading && !isVendor) {
      router.push("/");
    }
  }, [loading, isVendor, router]);

  if (loading || !isVendor) return null;

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) || order.customer.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || order.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'processing': return <Clock size={14} className="text-amber" />;
      case 'shipped': return <Car size={14} className="text-primary" />;
      case 'delivered': return <CheckCircle2 size={14} className="text-emerald" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'processing': return 'bg-amber/10 text-amber border-amber/20';
      case 'shipped': return 'bg-primary/10 text-primary border-primary/20';
      case 'delivered': return 'bg-emerald/10 text-emerald border-emerald/20';
      default: return 'bg-surface-elevated text-text-muted';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-8">
        <div>
           <Link href="/vendor/dashboard" className="text-sm font-bold text-text-muted hover:text-white flex items-center gap-2 mb-4 transition-colors">
              <LayoutDashboard size={16} /> Back to Dashboard
           </Link>
           <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
               <Package size={20} />
             </div>
             Order Management
           </h1>
           <p className="mt-2 text-text-secondary">Process and track customer orders for your store.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center justify-between rounded-3xl border border-white/5 bg-surface p-4 shadow-xl">
         <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
            <input
               type="text"
               placeholder="Search by Order ID or Customer..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="h-12 w-full rounded-2xl border border-white/10 bg-carbon pl-12 pr-4 text-sm text-white placeholder:text-text-placeholder focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
         </div>
         
         <div className="flex items-center gap-2">
            {['all', 'processing', 'shipped', 'delivered'].map((status) => (
               <button
                 key={status}
                 onClick={() => setFilter(status)}
                 className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                   filter === status 
                     ? 'bg-primary text-white shadow-lg shadow-primary/20'
                     : 'border border-white/10 bg-surface-elevated text-text-muted hover:text-white'
                 }`}
               >
                 {status}
               </button>
            ))}
         </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl border border-white/5 bg-surface shadow-xl overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="bg-carbon border-b border-white/5 text-xs font-bold uppercase tracking-widest text-text-muted">
                  <tr>
                     <th className="px-6 py-5">Order details</th>
                     <th className="px-6 py-5">Date</th>
                     <th className="px-6 py-5">Customer</th>
                     <th className="px-6 py-5">Status</th>
                     <th className="px-6 py-5 text-right">Total</th>
                     <th className="px-6 py-5 text-center">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, i) => (
                     <motion.tr 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: i * 0.05 }}
                       key={order.id} 
                       className="transition-colors hover:bg-white/5 group"
                     >
                        <td className="px-6 py-5">
                           <div className="font-bold text-white">{order.id}</div>
                           <div className="text-xs text-text-muted mt-1">{order.items} {order.items === 1 ? 'item' : 'items'}</div>
                        </td>
                        <td className="px-6 py-5 text-text-secondary">
                           {new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-5 font-medium text-white">{order.customer}</td>
                        <td className="px-6 py-5">
                           <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)} {order.status}
                           </div>
                        </td>
                        <td className="px-6 py-5 text-right font-black text-white">
                           ${order.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-5 text-center">
                           <button className="rounded-xl border border-white/10 bg-surface-elevated px-4 py-2 text-xs font-bold text-primary hover:bg-primary/10 transition-colors">
                              Update
                           </button>
                        </td>
                     </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                        No orders found matching your filters.
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
         {/* Footer Pagination Mock */}
         <div className="border-t border-white/5 bg-carbon px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-text-muted">Showing {filteredOrders.length} of {orders.length} orders</span>
            <div className="flex gap-2">
               <button className="rounded-lg border border-white/10 px-3 py-1 text-sm text-text-muted disabled:opacity-50">Prev</button>
               <button className="rounded-lg border border-white/10 bg-surface px-3 py-1 text-sm font-bold text-white">1</button>
               <button className="rounded-lg border border-white/10 px-3 py-1 text-sm text-text-muted disabled:opacity-50">Next</button>
            </div>
         </div>
      </div>
    </div>
  );
}
