"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Package, 
  Plus, 
  Search, 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  MoreVertical,
  Layers,
  Tag,
  AlertTriangle
} from "lucide-react";
import { getVendorProducts, deleteProduct } from "@/services/productService";
import { Product } from "@/types";

export default function VendorProductsPage() {
  const { user, loading, isVendor } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loading && !isVendor) {
      router.push("/");
      return;
    }

    const fetchProducts = async () => {
      if (user?.uid) {
        try {
          const data = await getVendorProducts(user.uid);
          setProducts(data);
        } catch (err) {
          console.error("Failed to fetch vendor products:", err);
        } finally {
          setFetching(false);
        }
      }
    };

    fetchProducts();
  }, [user, loading, isVendor, router]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || !isVendor) return null;

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 lg:px-8">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button 
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-sm font-bold text-text-muted hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
               <Package size={22} />
             </div>
             Store Inventory
          </h1>
          <p className="mt-2 text-text-secondary">Manage your product listings and stock levels.</p>
        </div>

        <Link
          href="/vendor/products/new"
          className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={18} /> Add New Listing
        </Link>
      </div>

      {/* Control Bar */}
      <div className="mb-8 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text"
            placeholder="Search your inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 w-full rounded-2xl glass-input pl-11 pr-4 text-sm text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 bg-surface-elevated p-1 rounded-xl border border-white/5 w-full sm:w-auto">
           <div className="px-4 py-2 text-xs font-bold text-text-muted uppercase tracking-widest">
              Total: {filteredProducts.length}
           </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-3xl border border-white/5 bg-surface shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-carbon z-0" />
        <div className="relative z-10 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-[11px] font-black uppercase tracking-[0.2em] text-text-muted">
                <th className="px-8 py-5">Product Details</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5">Stock Level</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {fetching ? (
                 [...Array(3)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                       <td colSpan={5} className="px-8 py-8 h-20 bg-white/[0.01]" />
                    </tr>
                 ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 shrink-0 rounded-xl bg-surface-elevated border border-white/5 overflow-hidden">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-text-muted">
                               <Package size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{product.title}</p>
                          <p className="text-xs text-text-muted uppercase tracking-widest font-bold mt-1">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-white">${product.price.toLocaleString()}</span>
                        {product.discountPrice && (
                          <span className="text-xs text-text-muted line-through">${product.discountPrice.toLocaleString()}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${product.stock <= 5 ? 'text-amber' : 'text-white'}`}>
                             {product.stock} units
                          </span>
                          {product.stock <= 5 && <AlertTriangle size={14} className="text-amber" />}
                       </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest
                        ${product.stock > 0 ? 'bg-emerald/10 text-emerald' : 'bg-destructive/10 text-destructive'}`}
                      >
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/vendor/products/edit/${product.id}`}
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-surface-elevated border border-white/5 text-text-muted hover:text-white hover:border-primary/30 transition-all shadow-lg"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-surface-elevated border border-white/5 text-text-muted hover:text-destructive hover:border-destructive/30 transition-all shadow-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={5} className="px-8 py-20 text-center text-text-muted">
                      <Layers size={40} className="mx-auto mb-4 opacity-50" />
                      <p className="font-bold">No products found in your inventory.</p>
                      <Link href="/vendor/products/new" className="mt-4 inline-block text-primary font-bold hover:underline">
                         Create your first listing
                      </Link>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
