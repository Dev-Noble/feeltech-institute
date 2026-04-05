"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Zap,
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Simulated featured products fetch
    setFeaturedProducts([
      { id: "1", vendorId: "v1", title: "Midnight Pro Max", description: "Flagship", price: 1199, category: "Phones", imageUrls: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop"], stock: 10, createdAt: new Date() },
      { id: "2", vendorId: "v2", title: "Carbon Book Pro", description: "Laptop", price: 1999, category: "Laptops", imageUrls: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop"], stock: 5, createdAt: new Date() },
      { id: "3", vendorId: "v1", title: "Aero Pods Max", description: "Audio", price: 449, category: "Accessories", imageUrls: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop"], stock: 15, createdAt: new Date() },
      { id: "4", vendorId: "v3", title: "Nexus Watch V2", description: "Wearable", price: 399, category: "Smartwatch", imageUrls: ["https://images.unsplash.com/photo-1544117518-30dd5fc7a9ca?w=800&auto=format&fit=crop"], stock: 20, createdAt: new Date() },
    ]);
  }, []);

  const categories = [
    { name: "Phones", icon: <Smartphone size={24} />, count: "120+", color: "bg-cyan/10 text-cyan border-cyan/20" },
    { name: "Laptops", icon: <Laptop size={24} />, count: "80+", color: "bg-primary/10 text-primary border-primary/20" },
    { name: "Accessories", icon: <Headphones size={24} />, count: "250+", color: "bg-accent/10 text-accent border-accent/20" },
    { name: "Smartwatch", icon: <Watch size={24} />, count: "40+", color: "bg-emerald/10 text-emerald border-emerald/20" },
  ];

  const features = [
    { icon: <Truck size={24} />, title: "Global Express", desc: "Free shipping over $500" },
    { icon: <ShieldCheck size={24} />, title: "Secure Checkout", desc: "Encrypted payments" },
    { icon: <Zap size={24} />, title: "Instant Delivery", desc: "Digital goods instantly" },
    { icon: <CreditCard size={24} />, title: "Easy Returns", desc: "30-day money-back" },
  ];

  return (
    <div className="flex flex-col pb-20">
      {/* Option A Immersive Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-10">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 bg-carbon" />

        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="flex flex-col items-center text-center">

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-12 flex h-32 w-full max-w-[280px] items-center justify-center rounded-[2.5rem] bg-white/5 border border-white/10 shadow-2xl relative overflow-hidden"
            >
               <img 
                 src="/images/logo.png" 
                 alt="Feeltech Logo" 
                 className="h-full w-full object-contain p-6"
               />
               <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-8 max-w-5xl text-5xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl leading-[1.1]"
            >
              Premium Tech. <br className="hidden md:block" /> <span className="text-primary uppercase tracking-tighter">Global Standards.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 max-w-2xl text-lg text-text-secondary md:text-xl font-medium"
            >
              The ultimate destination for authentic smartphones, high-performance laptops, and premium gear from verified global vendors.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
            >
              <Link href="/products" className="group flex h-14 items-center gap-2 rounded-full bg-primary px-8 text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-100 shimmer overflow-hidden relative">
                <span className="relative z-10 flex items-center gap-2">
                  Explore Catalog <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <Link href="/register" className="flex h-14 items-center gap-2 rounded-full border border-white/10 glass px-8 text-lg font-bold text-text-primary transition-all hover:bg-white/5 hover:border-primary/30">
                Become a Vendor
              </Link>
            </motion.div>

            {/* Hero Image Collage */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-16 relative w-full h-[300px] md:h-[400px] max-w-5xl mx-auto rounded-3xl border border-white/10 glass-card overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1550009158-9effb6e97306?q=80&w=2000&auto=format&fit=crop"
                alt="Premium Gadgets Showcase"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-[#111827]/50 mix-blend-multiply" />
            </motion.div>
          </div>
        </div>
        {/* Bottom fade removed */}
      </section>

      {/* Trust Badges */}
      <section className="container relative z-30 mx-auto px-4 lg:px-8 mt-[-40px]">
        <div className="grid grid-cols-1 gap-6 rounded-3xl border border-white/5 bg-surface p-8 shadow-2xl md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-surface-elevated text-primary transition-colors group-hover:bg-primary/10 group-hover:text-primary-light border border-white/5">
                {f.icon}
              </div>
              <div>
                <h4 className="font-bold text-text-primary">{f.title}</h4>
                <p className="text-xs text-text-muted mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 lg:px-8 mt-24 space-y-10">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Browse Categories</h2>
            <p className="text-text-secondary">Find exactly what you're looking for</p>
          </div>
          <Link href="/categories" className="text-sm font-bold text-primary hover:text-primary-light flex items-center gap-1 transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/5 bg-surface p-8 transition-all duration-300 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border ${cat.color} transition-transform duration-500 group-hover:scale-110`}>
                {cat.icon}
              </div>
              <h3 className="mb-1 text-xl font-bold text-white">{cat.name}</h3>
              <p className="text-sm text-text-muted">{cat.count} Products</p>
              <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-surface-elevated text-text-muted opacity-0 transition-all duration-300 translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-primary">
                <ArrowRight size={18} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 lg:px-8 mt-24 space-y-10">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Featured Gadgets</h2>
            <p className="text-text-secondary">Handpicked premium selections</p>
          </div>
          <Link href="/products" className="text-sm font-bold text-primary hover:text-primary-light flex items-center gap-1 transition-colors">
            Browse All <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Brands Banner */}
      <section className="container mx-auto px-4 lg:px-8 mt-24">
        <div className="rounded-[2.5rem] border border-white/5 bg-surface p-10 py-12">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-text-muted mb-8">Trusted by Global Tech Brands</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50 grayscale">
            {/* Semantic placeholders for brands since we don't have SVGs */}
            {['Apple', 'Samsung', 'Sony', 'Asus', 'DJI', 'Bose'].map(brand => (
              <span key={brand} className="text-2xl font-black tracking-tighter text-white">{brand}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
