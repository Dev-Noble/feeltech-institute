"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Box } from "lucide-react";

export default function CategoriesPage() {
  const categories = [
    {
      id: "phones",
      name: "Phones & Tablets",
      description: "Next-gen communication devices",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=2070&auto=format&fit=crop",
      count: 124,
    },
    {
      id: "laptops",
      name: "Laptops & Computers",
      description: "Unprecedented processing power",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2000&auto=format&fit=crop",
      count: 86,
    },
    {
      id: "audio",
      name: "Audio & Headphones",
      description: "Immersive high-fidelity sound",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2000&auto=format&fit=crop",
      count: 215,
    },
    {
      id: "smartwatch",
      name: "Wearables & Smartwatches",
      description: "Track your life effortlessly",
      image: "https://images.unsplash.com/photo-1544117518-30dd5fc7a9ca?q=80&w=2000&auto=format&fit=crop",
      count: 64,
    },
    {
      id: "accessories",
      name: "Cables & Accessories",
      description: "Essential additions to your tech",
      image: "https://images.unsplash.com/photo-1621330396167-e31bdfce8718?q=80&w=2000&auto=format&fit=crop",
      count: 340,
    },
    {
      id: "gaming",
      name: "Gaming Consoles",
      description: "Next level entertainment",
      image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=2000&auto=format&fit=crop",
      count: 42,
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl flex items-center gap-3">
             <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-surface-elevated text-primary">
               <Box size={24} />
             </div>
             Categories
          </h1>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl">
            Browse through our curated collection of premium technology categories, sourced directly from verified global vendors.
          </p>
        </div>
        <Link 
          href="/products" 
          className="group flex items-center gap-2 text-sm font-bold text-primary hover:text-white transition-colors"
        >
          View All Products <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, i) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <Link 
              href={`/products?category=${category.name.split(' ')[0]}`}
              className="group relative block h-[350px] w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-surface transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20"
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover opacity-60 mix-blend-screen"
                />
              </div>
              <div className="absolute inset-0 z-10 bg-carbon/60" />

              {/* Content Box */}
              <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end p-8">
                <div className="flex items-center justify-between">
                   <h2 className="text-2xl font-bold text-white transition-colors group-hover:text-primary">
                     {category.name}
                   </h2>
                   <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all group-hover:bg-primary group-hover:-rotate-45">
                     <ArrowRight size={18} />
                   </div>
                </div>
                
                <p className="mt-2 text-sm text-text-secondary line-clamp-1">{category.description}</p>
                
                <div className="mt-4 flex items-center gap-2">
                   <span className="rounded-full bg-surface-elevated/80 px-3 py-1.5 text-xs font-bold text-text-muted backdrop-blur-md">
                     {category.count} Products
                   </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
