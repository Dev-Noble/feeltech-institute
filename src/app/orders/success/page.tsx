"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Package, ArrowRight, Home, Receipt } from "lucide-react";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderRef = searchParams.get("ref") || "ORD-XXXXXX";
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden bg-background px-4 py-20">
      {/* Improvised CSS Confetti / Ambient Glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-0 bg-carbon transition-opacity duration-1000" style={{ opacity: showConfetti ? 1 : 0.5 }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        className="relative z-10 w-full max-w-lg space-y-8 rounded-[2.5rem] border border-emerald/20 bg-surface/80 backdrop-blur-xl p-10 text-center shadow-2xl shadow-emerald/5"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald/10 text-emerald border border-emerald/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
        >
          <CheckCircle2 size={48} />
        </motion.div>

        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Order Confirmed!</h1>
          <p className="text-text-secondary text-lg">Thank you for your purchase.</p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-carbon p-6 space-y-4 relative overflow-hidden">
          {/* subtle shine */}
          <div className="absolute top-0 left-[-100%] h-full w-1/2 bg-white/5 skew-x-12 animate-[shimmer_3s_infinite]" />
          
          <div className="flex items-center justify-center gap-2 text-text-muted mb-2">
            <Receipt size={16} /> <span className="text-sm font-bold uppercase tracking-widest">Order Reference</span>
          </div>
          <div className="text-2xl font-black text-primary tracking-wider">{orderRef}</div>
          <p className="text-xs text-text-muted mt-2 border-t border-white/5 pt-4">
             We've sent a confirmation email with your order details and tracking information.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Link
            href="/products"
            className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-surface-elevated border border-white/10 text-lg font-bold text-white transition-all hover:bg-white/5 hover:border-primary/30"
          >
            <Package size={20} className="text-text-muted transition-colors group-hover:text-primary" />
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-lg font-bold text-text-muted transition-colors hover:text-white"
          >
            <Home size={20} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
