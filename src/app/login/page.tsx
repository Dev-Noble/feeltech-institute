"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  LogIn,
  Zap,
} from "lucide-react";
import { loginUser } from "@/services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginUser(email, password);
      router.push("/");
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="relative z-10 w-full max-w-md space-y-8 rounded-[2.5rem] border border-white/5 bg-surface/50 backdrop-blur-xl p-10 shadow-2xl shadow-carbon"
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-24 w-full max-w-[200px] items-center justify-center relative">
            <img 
              src="/images/logo.png" 
              alt="Feeltech Logo" 
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Welcome back</h1>
          <p className="text-text-secondary text-sm">Log in to manage your orders & preferences</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-destructive text-center">
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-5">
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
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 w-full rounded-2xl border border-white/5 bg-surface-elevated pl-14 pr-4 text-text-primary placeholder:text-text-placeholder transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2.5 text-text-muted cursor-pointer whitespace-nowrap">
              <input type="checkbox" className="h-4 w-4 rounded bg-surface border-white/10 text-primary focus:ring-primary accent-primary cursor-pointer border" />
              Remember me
            </label>
            <Link href="/forgot-password" title="Coming soon!" className="font-bold text-primary hover:text-primary-light transition-colors whitespace-nowrap">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-70"
          >
            <span className="relative z-10 flex items-center gap-2">
              {loading ? "Authenticating..." : "Login to Account"}
              {!loading && <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />}
            </span>
          </button>
        </form>

        <p className="text-center text-sm text-text-muted">
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-primary hover:text-primary-light transition-colors">
            Register for free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
