"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ArrowRight, ShieldCheck, ShoppingBag, Zap } from "lucide-react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  const handleUpdateQuantity = (productId: string, currentAmount: number, change: number) => {
    const newAmount = currentAmount + change;
    if (newAmount >= 1) {
      updateQuantity(productId, newAmount);
    }
  };

  return (
    <div className="container mx-auto min-h-[calc(100vh-72px)] px-4 py-12 lg:px-8">
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
          <ShoppingBag size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">Shopping Cart</h1>
          <p className="text-text-secondary mt-1">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center space-y-6 rounded-[2.5rem] border border-dashed border-white/10 bg-surface/30 p-16 text-center shadow-xl"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-surface-elevated text-text-muted shadow-inner">
              <ShoppingBag size={48} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
              <p className="mx-auto max-w-sm text-text-muted">Currently, you have no items in your shopping cart. Discover premium tech gadgets today.</p>
            </div>
            <Link
              href="/products"
              className="mt-4 flex h-14 items-center justify-center rounded-2xl bg-primary px-8 text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="text-lg font-bold text-white">Items</h2>
                <button
                  onClick={clearCart}
                  className="flex items-center gap-2 text-sm font-bold text-destructive hover:text-destructive/80 transition-colors"
                >
                  <Trash2 size={16} /> Clear Cart
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group flex flex-col justify-between gap-6 rounded-3xl border border-white/5 bg-surface p-5 shadow-lg transition-all hover:border-primary/20 sm:flex-row sm:items-center"
                    >
                      <div className="flex flex-1 items-center gap-6">
                        <Link href={`/products/${item.productId}`}>
                          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-surface-elevated">
                            <Image
                              src={item.imageUrl || "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=1000&auto=format&fit=crop"}
                              alt={item.title}
                              fill
                              className="object-contain p-2 mix-blend-screen transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                        </Link>
                        <div className="space-y-2">
                          <Link href={`/products/${item.productId}`} className="inline-block transition-colors hover:text-primary">
                            <h3 className="line-clamp-2 text-lg font-bold text-white">{item.title}</h3>
                          </Link>
                          <p className="text-2xl font-extrabold text-primary">${item.price.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-6 sm:justify-end border-t border-white/5 sm:border-none pt-4 sm:pt-0">
                        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-surface-elevated p-1 shadow-inner">
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity, -1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-text-secondary hover:text-primary hover:bg-white/5 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity, 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-text-secondary hover:text-primary hover:bg-white/5 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive shadow-sm hover:text-white transition-all hover:scale-110"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-4"
            >
              <div className="sticky top-28 rounded-3xl border border-primary/20 bg-surface/50 backdrop-blur-xl shadow-2xl p-8 glow-blue">
                <h3 className="mb-6 text-xl font-extrabold text-white flex items-center gap-2"><Zap size={20} className="text-primary"/> Order Summary</h3>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal</span>
                    <span className="font-bold text-white">${totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Estimated Shipping</span>
                    <span className="font-bold text-emerald">Free</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Tax</span>
                    <span className="font-bold text-white uppercase text-xs tracking-wider border border-white/10 px-2 py-0.5 rounded">Calculated at checkout</span>
                  </div>
                  
                  <div className="my-6 border-t border-white/10"></div>
                  
                  <div className="flex items-end justify-between">
                    <span className="text-base font-bold text-white">Total</span>
                    <span className="text-4xl font-extrabold text-primary">${totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <Link
                    href="/checkout"
                    className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-100"
                  >
                     <span className="relative z-10 flex items-center gap-2">
                        Checkout Now <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                     </span>
                  </Link>

                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-text-muted mt-4">
                    <ShieldCheck size={16} className="text-emerald" />
                    <span>Secure encrypted checkout</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
