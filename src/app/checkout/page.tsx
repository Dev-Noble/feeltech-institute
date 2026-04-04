"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Use next/link directly
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/types";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  CreditCard,
  MapPin,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Lock,
  Wallet
} from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");
  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const shippingCost = deliveryMethod === "express" ? 15 : 0;
  const finalTotal = totalPrice + shippingCost;

  useEffect(() => {
    if (cartItems.length === 0 && !success) {
      router.push("/cart");
    }
  }, [cartItems, router, success]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Simulate network payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderRefId = `ORD-${Date.now().toString().slice(-6)}`;

      if (isFirebaseConfigured && user) {
        // 2. Create order in Firestore
        const orderData = {
          userId: user.uid,
          items: cartItems,
          totalAmount: finalTotal,
          status: "pending",
          shippingAddress: address,
          paymentMethod: "paystack",
          paymentReference: `SIM_REF_${Date.now()}`,
          createdAt: serverTimestamp(),
        };
        await addDoc(collection(db, "orders"), orderData);
      } else {
        console.warn("Running in demo mode without Firebase — order not saved.");
      }

      // 3. Success state
      setSuccess(true);
      clearCart();
      setTimeout(() => {
        router.push(`/orders/success?ref=${orderRefId}`);
      }, 1500);

    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Payment simulation failed. Please try again.");
    } finally {
      if(!success) {
        setLoading(false);
      }
    }
  };

  if (cartItems.length === 0 && !success) return null;

  if (success) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-32 w-32 items-center justify-center rounded-full bg-emerald/10 text-emerald shadow-lg shadow-emerald/20 border border-emerald/30"
        >
          <CheckCircle2 size={64} />
        </motion.div>
        <motion.h2
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="mt-8 text-3xl font-extrabold text-white"
        >
          Payment Successful!
        </motion.h2>
        <motion.p
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.3 }}
           className="mt-2 text-text-muted"
        >
          Creating your order and redirecting...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm font-bold text-text-muted">
        <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
        <ChevronRight size={16} />
        <span className="text-white">Checkout</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Checkout</h1>

          <form id="checkout-form" onSubmit={handleSimulatePayment} className="space-y-8">
            {/* Delivery Form */}
            <div className="rounded-3xl border border-white/5 bg-surface p-8 shadow-xl">
              <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white border-b border-white/5 pb-4">
                <MapPin className="text-primary" /> Delivery Details
              </h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-text-muted">Full Name</label>
                  <input
                    required
                    type="text"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleInputChange}
                    className="h-12 w-full rounded-xl border border-white/10 bg-surface-elevated px-4 text-white placeholder:text-text-placeholder focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-text-muted">Street Address</label>
                  <input
                    required
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleInputChange}
                    className="h-12 w-full rounded-xl border border-white/10 bg-surface-elevated px-4 text-white placeholder:text-text-placeholder focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-text-muted">City</label>
                  <input
                    required
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    className="h-12 w-full rounded-xl border border-white/10 bg-surface-elevated px-4 text-white placeholder:text-text-placeholder focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-text-muted">State/Province</label>
                  <input
                    required
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleInputChange}
                    className="h-12 w-full rounded-xl border border-white/10 bg-surface-elevated px-4 text-white placeholder:text-text-placeholder focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-text-muted">Zip Code</label>
                  <input
                    required
                    type="text"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleInputChange}
                    className="h-12 w-full rounded-xl border border-white/10 bg-surface-elevated px-4 text-white placeholder:text-text-placeholder focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-text-muted">Phone Number</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                    className="h-12 w-full rounded-xl border border-white/10 bg-surface-elevated px-4 text-white placeholder:text-text-placeholder focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="rounded-3xl border border-white/5 bg-surface p-8 shadow-xl">
              <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white border-b border-white/5 pb-4">
                <Truck className="text-primary" /> Delivery Method
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label
                  className={`relative flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all
                  ${deliveryMethod === "standard" ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-white/10 hover:border-white/20"}
                `}
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary mt-0.5">
                    {deliveryMethod === "standard" && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                  </div>
                  <input type="radio" className="hidden" checked={deliveryMethod === "standard"} onChange={() => setDeliveryMethod("standard")} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white">Standard</h4>
                      <span className="font-bold text-emerald">Free</span>
                    </div>
                    <p className="mt-1 text-xs text-text-muted">3-5 business days</p>
                  </div>
                </label>

                <label
                  className={`relative flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all
                  ${deliveryMethod === "express" ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-white/10 hover:border-white/20"}
                `}
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary mt-0.5">
                    {deliveryMethod === "express" && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                  </div>
                  <input type="radio" className="hidden" checked={deliveryMethod === "express"} onChange={() => setDeliveryMethod("express")} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white">Express</h4>
                      <span className="font-bold text-white">+$15.00</span>
                    </div>
                    <p className="mt-1 text-xs text-text-muted">1-2 business days</p>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 rounded-3xl border border-white/5 bg-surface p-8 shadow-xl">
            <h3 className="mb-6 text-xl font-extrabold text-white pb-4 border-b border-white/5">Order Summary</h3>
            
            <div className="mb-6 space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-elevated">
                    <img src={item.imageUrl || ""} alt={item.title} className="h-full w-full object-contain p-1" />
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <h4 className="line-clamp-1 text-sm font-bold text-white">{item.title}</h4>
                    <span className="text-sm text-text-muted">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Items Subtotal</span>
                <span className="font-bold text-white">${totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Shipping</span>
                <span className="font-bold text-white">{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="my-4 border-t border-white/10"></div>
              <div className="flex items-end justify-between">
                <span className="text-base font-bold text-white">Total</span>
                <span className="text-3xl font-extrabold text-primary">${finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#0EA5E9] text-lg font-bold text-white shadow-lg shadow-[#0EA5E9]/20 transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-70 shimmer overflow-hidden relative"
              >
                {!loading && <Wallet size={20} className="relative z-10" />}
                <span className="relative z-10">{loading ? "Processing..." : "Pay with Paystack"}</span>
              </button>

              <div className="flex justify-center pt-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-text-muted">
                  <Lock size={12} /> SSL Encrypted Connection
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
