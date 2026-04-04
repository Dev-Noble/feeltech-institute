"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  Store,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Activity,
  ShieldCheck,
  Package
} from "lucide-react";
import { getAdminStats, getPendingVendors, updateVendorStatus, getRecentActivity } from "@/services/adminService";

export default function AdminDashboardPage() {
  const { user, profile, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ totalUsers: 0, totalVendors: 0, totalOrders: 0, totalRevenue: 0 });
  const [pendingVendors, setPendingVendors] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [loading, isAdmin, router]);

  const fetchData = async () => {
    try {
      const [s, v, a] = await Promise.all([
        getAdminStats(),
        getPendingVendors(),
        getRecentActivity()
      ]);
      setStats(s);
      setPendingVendors(v);
      setActivity(a);
    } catch (err) {
      console.error("Admin data fetch failed:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const handleVendorAction = async (vendorId: string, approve: boolean) => {
     try {
        await updateVendorStatus(vendorId, approve);
        // Refresh the list
        const updatedVendors = await getPendingVendors();
        setPendingVendors(updatedVendors);
     } catch (err) {
        alert("Failed to update vendor status");
     }
  };

  if (loading || !isAdmin) return null;

  const statCards = [
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign size={24} />, trend: "+12.5%", color: "text-emerald", bg: "bg-emerald/10", border: "border-emerald/20" },
    { label: "Active Vendors", value: stats.totalVendors, icon: <Store size={24} />, trend: "Total count", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { label: "Total Users", value: stats.totalUsers, icon: <Users size={24} />, trend: "Global registered", color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
    { label: "Total Orders", value: stats.totalOrders, icon: <Package size={24} />, trend: "Processed", color: "text-cyan", bg: "bg-cyan/10", border: "border-cyan/20" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
               <ShieldCheck size={20} />
             </div>
             Admin Control Center
          </h1>
          <p className="mt-2 text-text-secondary">Welcome back, {profile?.name}. Here's what's happening across the platform.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-3xl border border-white/5 bg-surface p-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 z-0 bg-carbon" />
            <div className="relative z-10">
               <div className="flex items-start justify-between">
                 <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${stat.bg} ${stat.color} ${stat.border}`}>
                   {stat.icon}
                 </div>
                 <span className="rounded-full bg-surface-elevated px-2.5 py-1 text-xs font-bold text-text-muted">
                   {stat.trend}
                 </span>
               </div>
               <div className="mt-4">
                 <h2 className="text-3xl font-extrabold text-white">{fetching ? "..." : stat.value}</h2>
                 <p className="text-sm font-bold text-text-muted uppercase tracking-widest mt-1">{stat.label}</p>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Vendor Approval Queue */}
         <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
               Pending Vendor Approvals <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">{pendingVendors.length}</span>
            </h2>
            <div className="space-y-4">
               {fetching ? (
                 <div className="h-40 w-full animate-pulse rounded-2xl bg-surface-elevated" />
               ) : pendingVendors.length > 0 ? (
                 pendingVendors.map((vendor) => (
                    <div key={vendor.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/5 bg-surface p-6 shadow-lg relative overflow-hidden group">
                       <div className="absolute inset-0 z-0 bg-carbon" />
                       <div className="relative z-10 flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-elevated text-text-muted">
                             <Store size={20} />
                          </div>
                          <div>
                             <h4 className="font-bold text-white">{vendor.storeName}</h4>
                             <p className="text-sm text-text-muted">{vendor.id} • Registered recently</p>
                          </div>
                       </div>
                       <div className="relative z-10 flex gap-2">
                          <button 
                            onClick={() => handleVendorAction(vendor.id, false)}
                            className="flex items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-2 hover:bg-destructive/20 text-sm font-bold text-destructive transition-colors"
                          >
                             <XCircle size={16} /> Reject
                          </button>
                          <button 
                            onClick={() => handleVendorAction(vendor.id, true)}
                            className="flex items-center justify-center gap-2 rounded-xl bg-emerald/10 border border-emerald/20 px-4 py-2 text-sm font-bold text-emerald hover:bg-emerald/20 transition-colors"
                          >
                             <CheckCircle2 size={16} /> Approve
                          </button>
                       </div>
                    </div>
                 ))
               ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-12 text-center text-text-muted">
                     <CheckCircle2 size={40} className="mb-4 opacity-50 text-emerald" />
                     <p>No pending vendor approvals. You're all caught up!</p>
                  </div>
               )}
            </div>
         </div>

         {/* System Activity */}
         <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
               Live Platform Activity
            </h2>
            <div className="rounded-3xl border border-white/5 bg-surface p-6 shadow-xl relative overflow-hidden">
               <div className="absolute inset-0 z-0 bg-carbon" />
               <div className="relative z-10 space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-white/5">
                  {fetching ? (
                    <div className="h-40 w-full animate-pulse rounded-2xl bg-surface-elevated" />
                  ) : activity.map((act, i) => (
                     <div key={i} className="relative flex items-center gap-4">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-surface bg-surface-elevated z-10
                           ${act.status === 'success' ? 'text-emerald' : 
                             act.status === 'warning' ? 'text-amber' : 
                             act.status === 'error' ? 'text-destructive' : 'text-primary'}`}
                        >
                           <Activity size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-bold text-white truncate">{act.msg}</p>
                           <p className="text-xs text-text-muted mt-0.5">{act.time.toLocaleTimeString()}</p>
                        </div>
                     </div>
                  ))}
               </div>
               <button className="relative z-10 mt-8 w-full rounded-xl border border-white/5 py-3 text-sm font-bold text-text-muted hover:bg-white/5 hover:text-white transition-colors">
                  View Full Audit Logs
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
