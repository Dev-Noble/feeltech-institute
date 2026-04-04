"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Store,
  ShieldCheck,
  Zap
} from "lucide-react";
import { registerUser } from "@/services/authService";
import { UserRole } from "@/types";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerUser(email, password, name, role);
      if (role === "vendor") {
        router.push("/vendor/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden bg-background px-4 py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-0 bg-carbon" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-xl space-y-8 rounded-[2.5rem] border border-white/5 bg-surface/50 backdrop-blur-xl p-10 shadow-2xl shadow-carbon"
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
            <Zap size={28} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Create an Account</h1>
          <p className="text-text-secondary text-sm">Join the next generation of tech marketplaces</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-destructive text-center">
            {error}
          </motion.div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all duration-300 ${
                role === "customer"
                  ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/5"
                  : "border-white/10 bg-surface-elevated text-text-muted hover:border-white/20 hover:text-white"
              }`}
            >
              <User size={24} />
              <span className="text-sm font-bold">Customer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("vendor")}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all duration-300 ${
                role === "vendor"
                  ? "border-accent bg-accent/10 text-accent shadow-lg shadow-accent/5"
                  : "border-white/10 bg-surface-elevated text-text-muted hover:border-white/20 hover:text-white"
              }`}
            >
              <Store size={24} />
              <span className="text-sm font-bold">Vendor</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="group relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" size={20} />
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 w-full rounded-2xl border border-white/5 bg-surface-elevated pl-14 pr-4 text-text-primary placeholder:text-text-placeholder transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div className="group relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" size={20} />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 w-full rounded-2xl border border-white/5 bg-surface-elevated pl-14 pr-4 text-text-primary placeholder:text-text-placeholder transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div className="group relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" size={20} />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 w-full rounded-2xl border border-white/5 bg-surface-elevated pl-14 pr-4 text-text-primary placeholder:text-text-placeholder transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>

          {role === "vendor" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
              <div className="flex items-start gap-3 rounded-2xl border border-accent/20 bg-accent/5 p-4 text-sm text-accent">
                <ShieldCheck className="shrink-0 mt-0.5" size={18} />
                <p>Vendor accounts require admin approval before you can start listing products. You'll be notified once approved.</p>
              </div>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-70"
          >
            <span className="relative z-10 flex items-center gap-2">
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />}
            </span>
          </button>
        </form>

        <p className="text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary hover:text-primary-light transition-colors">
            Log in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
