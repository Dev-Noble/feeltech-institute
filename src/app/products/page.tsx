"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Search,
  ChevronDown,
  LayoutGrid,
  List,
  Trash2,
  X
} from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types";

// Mock data for initial UI implementation
const MOCK_PRODUCTS: Product[] = [
  { id: "1", vendorId: "v1", title: "iPhone 16 Pro Max", description: "The ultimate iPhone.", price: 1199, category: "Phones", imageUrls: ["https://images.unsplash.com/photo-1726053331459-2ca5f67a2f5f?q=80&w=2070&auto=format&fit=crop"], stock: 10, createdAt: new Date() },
  { id: "2", vendorId: "v2", title: "MacBook Pro M3", description: "Power for pros.", price: 1999, category: "Laptops", imageUrls: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop"], stock: 5, createdAt: new Date() },
  { id: "3", vendorId: "v1", title: "Apple Watch Ultra 2", description: "Rugged and capable.", price: 799, category: "Accessories", imageUrls: ["https://images.unsplash.com/photo-1544117518-30dd5fc7a9ca?q=80&w=1000&auto=format&fit=crop"], stock: 15, createdAt: new Date() },
  { id: "4", vendorId: "v3", title: "Sony WH-1000XM5", description: "Best noise canceling.", price: 349, category: "Accessories", imageUrls: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"], stock: 20, createdAt: new Date() },
  { id: "5", vendorId: "v2", title: "Dell XPS 15", description: "Windows perfection.", price: 1499, category: "Laptops", imageUrls: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000&auto=format&fit=crop"], stock: 8, createdAt: new Date() },
  { id: "6", vendorId: "v1", title: "Samsung S24 Ultra", description: "AI enabled smartphone.", price: 1299, category: "Phones", imageUrls: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop"], stock: 12, createdAt: new Date() },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(5000);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["All", "Phones", "Laptops", "Accessories", "Smartwatch"];

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesPrice = p.price <= priceRange;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <div className="flex flex-col gap-10">
        {/* Header & Page Title */}
        <div className="space-y-4 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl text-white">Explore Our <span className="text-primary uppercase tracking-tighter">Catalog</span></h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto lg:mx-0">
            Premium gadgets from verified vendors worldwide. Authenticity guaranteed.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 sticky top-24 z-40 bg-surface/80 backdrop-blur-xl p-4 rounded-3xl border border-white/5 shadow-2xl shadow-carbon lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-4">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search premium tech..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-2xl border border-white/5 bg-carbon/50 pl-12 pr-4 text-text-primary placeholder:text-text-placeholder transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex h-12 items-center gap-2 rounded-2xl border px-6 font-bold transition-all ${
                showFilters
                  ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20'
                  : 'border-white/10 bg-surface text-text-primary hover:border-primary/30 hover:bg-white/5'
              }`}
            >
              <Filter size={18} /> Filters
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm font-bold text-text-muted">
            <span>Showing <span className="text-white">{filteredProducts.length}</span> results</span>
            <div className="h-6 w-[1px] bg-white/10"></div>
            <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
              Sort by: Recommended <ChevronDown size={14} />
            </div>
            <div className="hidden lg:flex items-center gap-2 ml-4">
              <button className="p-2 rounded-lg bg-primary/20 text-primary border border-primary/20"><LayoutGrid size={20} /></button>
              <button className="p-2 rounded-lg hover:bg-white/5 text-text-muted transition-colors"><List size={20} /></button>
            </div>
          </div>
        </div>

        {/* Categories / Quick Filters Area */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-3xl border border-white/5 bg-surface p-8 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-xl">
                <div className="space-y-4">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-text-muted">Categories</h4>
                  <div className="flex flex-wrap gap-3">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
                          selectedCategory === cat
                            ? 'bg-primary text-white shadow-lg shadow-primary/20 border border-transparent'
                            : 'border border-white/10 bg-surface-elevated text-text-secondary hover:border-primary/30 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-text-muted">Price Range</h4>
                    <span className="font-extrabold text-primary">${priceRange.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full accent-primary h-2 bg-surface-elevated rounded-full cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-text-muted font-bold">
                    <span>$0</span>
                    <span>$5,000</span>
                  </div>
                </div>

                <div className="flex flex-col justify-end gap-3">
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearch("");
                      setPriceRange(5000);
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 py-3 text-sm font-bold text-destructive hover:bg-destructive/20 transition-all"
                  >
                    <Trash2 size={16} /> Reset Filters
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white hover:scale-[1.02] transition-all shadow-lg shadow-primary/20"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-40 rounded-[2.5rem] border border-dashed border-white/10 bg-surface/50 space-y-6"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-surface-elevated text-text-muted shadow-inner">
              <X size={48} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white">No products found</h3>
              <p className="text-text-secondary max-w-sm">
                Try adjusting your search filters or browse other categories.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearch("");
                setPriceRange(5000);
              }}
              className="text-primary font-bold hover:text-primary-light transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
