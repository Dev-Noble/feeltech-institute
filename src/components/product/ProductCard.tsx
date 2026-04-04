"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      productId: product.id,
      quantity: 1,
      price: product.price,
      title: product.title,
      imageUrl: product.imageUrls[0],
    });
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-surface transition-all duration-300 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-elevated/50 p-6">
        <Link href={`/products/${product.id}`} className="block h-full w-full">
          <Image
            src={product.imageUrls[0] || "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=1000&auto=format&fit=crop"}
            alt={product.title}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-110"
          />
        </Link>

        {/* Badge */}
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-white shadow-lg shadow-primary/20">
            NEW
          </span>
        </div>

        {/* Wishlist */}
        <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-text-muted backdrop-blur-md border border-white/10 transition-all hover:bg-white/10 hover:text-red-400 hover:border-red-400/20 hover:scale-110">
          <Heart size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{product.category}</span>
            <div className="flex items-center gap-1 text-xs font-bold text-amber">
              <Star size={12} fill="currentColor" /> 4.8
            </div>
          </div>
          <Link href={`/products/${product.id}`}>
            <h3 className="line-clamp-1 text-base font-bold text-text-primary transition-colors hover:text-primary">{product.title}</h3>
          </Link>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs text-text-muted">Price</span>
            <p className="text-xl font-extrabold text-primary">${product.price.toLocaleString()}</p>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 transition-all hover:scale-110 hover:shadow-primary/30 active:scale-95"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
