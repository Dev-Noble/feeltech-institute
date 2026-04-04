"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";

// Mock data representation
const MOCK_VENDORS = [
  { id: "V-101", name: "Global Tech Inc.", email: "contact@globaltech.com", status: "approved", joined: "2025-10-12", products: 45 },
  { id: "V-102", name: "NextGen Electronics", email: "hello@nextgen.co", status: "pending", joined: "2026-04-03", products: 0 },
  { id: "V-103", name: "AudioPhile Hub", email: "sales@audiophile.hub", status: "approved", joined: "2026-01-20", products: 12 },
  { id: "V-104", name: "SmartWear Direct", email: "support@smartweardirect.com", status: "suspended", joined: "2025-11-05", products: 8 },
];

export default function AdminVendorsPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  
  const [vendors, setVendors] = useState(MOCK_VENDORS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [loading, isAdmin, router]);

  if (loading || !isAdmin) return null;

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || v.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-amber/10 text-amber border-amber/20';
      case 'approved': return 'bg-emerald/10 text-emerald border-emerald/20';
      case 'suspended': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-surface-elevated text-text-muted border-white/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock size={14} />;
      case 'approved': return <CheckCircle2 size={14} />;
      case 'suspended': return <XCircle size={14} />;
      default: return null;
    }
  };

  const handleAction = (id: string, newStatus: string) => {
    // In reality, this updates the `isApproved` flag in Firestore based on user document
    setVendors(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
  };

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-8">
        <div>
           <Link href="/admin/dashboard" className="text-sm font-bold text-text-muted hover:text-white flex items-center gap-2 mb-4 transition-colors">
              <LayoutDashboard size={16} /> Back to Dashboard
           </Link>
           <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
               <ShieldCheck size={20} />
             </div>
             Vendor Access Management
           </h1>
           <p className="mt-2 text-text-secondary">Approve, suspend, or remove marketplace vendors.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center justify-between rounded-3xl border border-white/5 bg-surface p-4 shadow-xl">
         <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
            <input
               type="text"
               placeholder="Search by Vendor Name or Email..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="h-12 w-full rounded-2xl border border-white/10 bg-carbon pl-12 pr-4 text-sm text-white placeholder:text-text-placeholder focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
         </div>
         
         <div className="flex items-center gap-2">
            {['all', 'pending', 'approved', 'suspended'].map((status) => (
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

      {/* Vendors Table */}
      <div className="rounded-3xl border border-white/5 bg-surface shadow-xl overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="bg-carbon border-b border-white/5 text-xs font-bold uppercase tracking-widest text-text-muted">
                  <tr>
                     <th className="px-6 py-5">Vendor Info</th>
                     <th className="px-6 py-5">Joined</th>
                     <th className="px-6 py-5 text-center">Active Products</th>
                     <th className="px-6 py-5">Status</th>
                     <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {filteredVendors.length > 0 ? (
                    filteredVendors.map((vendor, i) => (
                     <motion.tr 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: i * 0.05 }}
                       key={vendor.id} 
                       className="transition-colors hover:bg-white/5 group"
                     >
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-elevated border border-white/5 text-text-secondary">
                                 <Users size={18} />
                              </div>
                              <div>
                                 <div className="font-bold text-white">{vendor.name}</div>
                                 <div className="text-xs text-text-muted">{vendor.email}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-5 text-text-secondary">
                           {new Date(vendor.joined).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-5 text-center font-black text-white">
                           {vendor.products}
                        </td>
                        <td className="px-6 py-5">
                           <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${getStatusColor(vendor.status)}`}>
                              {getStatusIcon(vendor.status)} {vendor.status}
                           </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <div className="flex items-center justify-end gap-2">
                              {vendor.status === 'pending' && (
                                 <button onClick={() => handleAction(vendor.id, 'approved')} className="rounded-xl border border-emerald/20 bg-emerald/10 px-3 py-1.5 text-xs font-bold text-emerald hover:bg-emerald/20 transition-colors">
                                    Approve
                                 </button>
                              )}
                              {vendor.status === 'pending' && (
                                 <button onClick={() => handleAction(vendor.id, 'suspended')} className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/20 transition-colors">
                                    Reject
                                 </button>
                              )}
                              {vendor.status === 'approved' && (
                                 <button onClick={() => handleAction(vendor.id, 'suspended')} className="rounded-xl border border-amber/20 bg-amber/10 px-3 py-1.5 text-xs font-bold text-amber hover:bg-amber/20 transition-colors">
                                    Suspend
                                 </button>
                              )}
                              {vendor.status === 'suspended' && (
                                 <button onClick={() => handleAction(vendor.id, 'approved')} className="rounded-xl border border-emerald/20 bg-emerald/10 px-3 py-1.5 text-xs font-bold text-emerald hover:bg-emerald/20 transition-colors">
                                    Reactivate
                                 </button>
                              )}
                           </div>
                        </td>
                     </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                        No vendors found matching your filters.
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
         {/* Footer Pagination Mock */}
         <div className="border-t border-white/5 bg-carbon px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-text-muted">Showing {filteredVendors.length} of {vendors.length} vendors</span>
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
