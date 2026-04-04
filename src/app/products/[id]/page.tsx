"use client";

import React, { useState, useEffect, use } from "react"; // Added "use" API for unwrap
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Star,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Zap,
  Minus,
  Plus
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";

// Note: Next 15 page props.params is a Promise that must be unwrapped
export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    // Mock fetch based on ID. In reality, fetch from Firebase `products` collection.
    const fetchProduct = () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        const mockData: Product = {
          id: unwrappedParams.id, // Use unwrapped ID
          vendorId: "v1",
          title: "Premium Tech Gadget Max",
          description: "Experience the next generation of performance. This premium device combines cutting-edge technology with elegant design. Features ultra-fast processing, immersive display technology, and all-day battery life. Designed specifically for professionals who demand the absolute best from their tools.",
          price: 1299.00,
          category: "Electronics",
          stock: 12,
          imageUrls: [
            "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1621330396167-e31bdfce8718?q=80&w=800&auto=format&fit=crop"
          ],
          createdAt: new Date()
        };
        setProduct(mockData);
        setLoading(false);
      }, 500);
    };

    fetchProduct();
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-primary"></div>
          <p className="text-text-muted">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity: quantity,
      imageUrl: product.imageUrls[0]
    });
    // Visual feedback handled by cart context normally, but we could add a toast here
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      {/* Breadcrumb & Navigation */}
      <nav className="mb-8 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-surface px-4 text-sm font-bold text-text-secondary transition-all hover:border-primary/30 hover:text-white"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-2 text-sm font-bold text-text-muted">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-white/20">/</span>
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <span className="text-white/20">/</span>
          <span className="text-white line-clamp-1">{product.title}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
           <div className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/5 bg-surface-elevated">
              <Image 
                src={product.imageUrls[selectedImage]} 
                alt={`${product.title} view ${selectedImage + 1}`}
                fill
                className="object-contain p-8 mix-blend-screen transition-transform duration-500 hover:scale-105 cursor-zoom-in"
                priority
              />
              <button className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-surface/50 text-text-muted backdrop-blur-md transition-all hover:border-red-400/30 hover:text-red-400 hover:bg-white/5 hover:scale-110">
                <Heart size={22} />
              </button>
           </div>
           
           {/* Thumbnails */}
           {product.imageUrls.length > 1 && (
             <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {product.imageUrls.map((url, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedImage(i)}
                    className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border bg-surface-elevated transition-all ${
                      selectedImage === i ? 'border-primary shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-105' : 'border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'
                    }`}
                  >
                    <Image src={url} alt={`Thumbnail ${i}`} fill className="object-contain p-2 mix-blend-screen" />
                  </button>
                ))}
             </div>
           )}
        </div>

        {/* Right Column: Product Details */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 space-y-8">
             <div>
                <div className="mb-3 flex items-center justify-between">
                   <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                     {product.category}
                   </span>
                   <div className="flex items-center gap-1.5 text-sm font-bold text-amber">
                     <Star size={16} fill="currentColor" /> 
                     <span>4.8</span>
                     <span className="text-text-muted">(124 reviews)</span>
                   </div>
                </div>
                
                <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">{product.title}</h1>
                <div className="mt-4 flex items-end gap-3">
                   <p className="text-4xl font-black text-primary">${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                   {product.stock > 0 ? (
                     <span className="mb-1.5 flex items-center gap-1 text-sm font-bold text-emerald">
                        <CheckCircle2 size={16} /> In Stock ({product.stock})
                     </span>
                   ) : (
                     <span className="mb-1.5 text-sm font-bold text-destructive">Out of Stock</span>
                   )}
                </div>
             </div>

             <div className="border-y border-white/5 py-6">
                <p className="leading-relaxed text-text-secondary">{product.description}</p>
             </div>

             {/* Actions */}
             <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <label className="text-sm font-bold uppercase tracking-widest text-text-muted">Quantity</label>
                   <div className="flex h-14 items-center gap-4 rounded-xl border border-white/10 bg-surface px-2">
                     <button 
                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
                       disabled={quantity <= 1}
                       className="flex h-10 w-10 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-elevated hover:text-white disabled:opacity-50"
                     >
                       <Minus size={18} />
                     </button>
                     <span className="w-8 text-center text-lg font-bold text-white">{quantity}</span>
                     <button 
                       onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                       disabled={quantity >= product.stock}
                       className="flex h-10 w-10 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-elevated hover:text-white disabled:opacity-50"
                     >
                       <Plus size={18} />
                     </button>
                   </div>
                </div>

                <div className="flex gap-4">
                   <button 
                     onClick={handleAddToCart}
                     disabled={product.stock === 0}
                     className="flex flex-1 h-16 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-surface text-lg font-bold text-text-primary transition-all hover:bg-white/5 hover:border-primary/50 disabled:opacity-50"
                   >
                     <ShoppingCart size={20} /> Add to Cart
                   </button>
                   <button 
                     onClick={handleBuyNow}
                     disabled={product.stock === 0}
                     className="flex flex-1 h-16 items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50 shimmer overflow-hidden relative"
                   >
                     <span className="relative z-10 flex items-center gap-2">Buy Now <Zap size={20} /></span>
                   </button>
                </div>
             </div>

             {/* Guarantees */}
             <div className="rounded-2xl border border-white/5 bg-carbon p-6 space-y-4">
                {[
                  { icon: <Truck size={20} className="text-cyan" />, text: "Free priority shipping globally" },
                  { icon: <ShieldCheck size={20} className="text-emerald" />, text: "1-Year vendor warranty included" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-elevated border border-white/5">
                        {item.icon}
                     </div>
                     <span className="text-sm font-bold text-white">{item.text}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
