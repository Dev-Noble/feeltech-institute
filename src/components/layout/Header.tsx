"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  LogOut,
  LayoutDashboard,
  Store,
  ShieldCheck,
  X,
  Zap,
  Package,
} from "lucide-react";
import { logoutUser } from "@/services/authService";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const Header: React.FC = () => {
  const { user, profile, isAdmin, isVendor } = useAuth();
  const { totalItems } = useCart();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

    return (
      <>
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-carbon/80 backdrop-blur-xl">
          <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8 flex-nowrap">
            {/* Logo and Mobile Toggle Group */}
            <div className="flex items-center gap-4 flex-nowrap">
            <Link href="/" className="flex items-center group">
              <div className="relative flex h-14 w-40 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-2xl transition-all duration-300 group-hover:bg-white/[0.08] group-hover:scale-105 overflow-hidden">
                <img 
                  src="/images/logo.png" 
                  alt="Feeltech Logo" 
                  className="h-full w-full object-contain p-2"
                />
              </div>
            </Link>
          </div>

            {/* Desktop Search */}
            <div className="hidden flex-1 px-10 lg:flex">
              <div className={`relative w-full max-w-lg transition-all duration-300 ${searchFocused ? 'scale-[1.02]' : ''}`}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search phones, laptops, gadgets..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="h-11 w-full rounded-full glass-input pl-11 pr-4 text-sm text-text-primary placeholder:text-text-placeholder transition-all duration-300 focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <Link
                href="/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-surface-elevated group"
              >
                <ShoppingCart size={20} className="text-text-secondary group-hover:text-primary transition-colors" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-lg shadow-primary/20"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>
              {user ? (
                <div className="flex items-center gap-3 border-l border-white/10 pl-4">
                  {/* Dedicated Admin Panel Link for high visibility */}
                  {isAdmin && (
                    <Link 
                      href="/admin/dashboard"
                      className="flex h-10 items-center justify-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 px-4 text-xs font-black uppercase tracking-widest text-destructive hover:bg-destructive/20 transition-all shadow-lg shadow-destructive/5"
                    >
                      <ShieldCheck size={14} />
                      Admin Control
                    </Link>
                  )}

                  {/* Dashboard Link - visible from md Up */}
                  <Link 
                    href="/dashboard"
                    className="hidden sm:flex h-10 items-center justify-center gap-2 rounded-xl bg-surface-elevated border border-white/5 px-4 text-xs font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all shadow-lg"
                  >
                    <LayoutDashboard size={14} className="text-primary" />
                    Dashboard
                  </Link>

                  <div className="hidden flex-col items-end md:flex min-w-[60px]">
                    <span className="text-sm font-bold text-white truncate max-w-[120px]">{profile?.name || user.displayName || "Account"}</span>
                    <span className="text-[10px] font-black uppercase tracking-tight text-primary">{profile?.role || "Member"}</span>
                  </div>

                  <div className="relative">
                    <button 
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface transition-all hover:border-primary/30 hover:bg-surface-elevated"
                    >
                      <User size={18} className="text-text-muted transition-colors hover:text-primary" />
                    </button>

                    {/* Dropdown with state-controlled visibility */}
                    <AnimatePresence>
                      {(dropdownOpen || false) && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute right-0 top-full mt-3 w-52 rounded-2xl glass p-2 shadow-2xl z-[60]"
                        >
                          {isAdmin && (
                            <Link href="/admin/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-primary">
                              <ShieldCheck size={16} /> Admin Panel
                            </Link>
                          )}
                          {isVendor && (
                            <Link href="/vendor/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-primary">
                              <LayoutDashboard size={16} /> Vendor Dashboard
                            </Link>
                          )}
                          <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-primary">
                            <User size={16} /> My Profile
                          </Link>
                          <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-primary">
                            <LayoutDashboard size={16} /> My Dashboard
                          </Link>
                          <div className="my-1 border-t border-white/5" />
                          <button
                            onClick={() => { handleLogout(); setDropdownOpen(false); }}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                          >
                            <LogOut size={16} /> Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="hidden text-sm font-medium text-text-secondary hover:text-primary transition-colors md:block">
                  Login
                </Link>
                <Link href="/register" className="flex h-10 items-center rounded-full bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-100">
                  Join Free
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-elevated lg:hidden transition-colors"
            >
              <Menu size={22} className="text-text-secondary" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-carbon/95 backdrop-blur-xl"
          >
            <div className="flex h-full flex-col p-6">
              <div className="flex items-center justify-between mb-10">
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <div className="flex h-16 w-full items-center justify-center rounded-2xl bg-white/5 border border-white/10 overflow-hidden shadow-xl">
                    <img 
                      src="/images/logo.png" 
                      alt="Feeltech Logo" 
                      className="h-full w-full object-contain p-3"
                    />
                  </div>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-elevated">
                  <X size={22} className="text-text-secondary" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="text"
                  placeholder="Search gadgets..."
                  className="h-12 w-full rounded-2xl glass-input pl-11 pr-4 text-sm text-text-primary placeholder:text-text-placeholder outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <nav className="flex flex-col gap-2">
                {[
                  { href: "/products", label: "Browse Products", icon: <Store size={20} /> },
                  { href: "/cart", label: "Shopping Cart", icon: <ShoppingCart size={20} /> },
                ].map((item, i) => (
                  <motion.div key={item.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-2xl px-4 py-4 text-lg font-semibold text-text-secondary transition-all hover:bg-surface hover:text-primary"
                    >
                      {item.icon} {item.label}
                    </Link>
                  </motion.div>
                ))}

                {user && (
                  <div className="mt-4 space-y-2 border-t border-white/5 pt-4">
                    <p className="px-4 text-xs font-bold uppercase tracking-widest text-text-muted mb-2">My Account</p>
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-lg font-semibold text-text-secondary transition-all hover:bg-surface hover:text-primary"
                    >
                      <User size={20} /> My Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-lg font-semibold text-text-secondary transition-all hover:bg-surface hover:text-primary"
                    >
                      <LayoutDashboard size={20} /> My Dashboard
                    </Link>
                    
                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-lg font-semibold text-destructive transition-all hover:bg-destructive/10"
                      >
                        <ShieldCheck size={20} /> Admin Panel
                      </Link>
                    )}
                    {isVendor && (
                      <Link
                        href="/vendor/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-lg font-semibold text-primary transition-all hover:bg-primary/10"
                      >
                        <LayoutDashboard size={20} /> Vendor Dashboard
                      </Link>
                    )}
                  </div>
                )}
              </nav>

              <div className="mt-auto flex flex-col gap-3">
                {!user ? (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="flex h-14 items-center justify-center rounded-2xl border border-white/10 text-lg font-bold text-text-primary hover:bg-surface transition-all">
                      Login
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)} className="flex h-14 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-white shadow-lg shadow-primary/20">
                      Create Account
                    </Link>
                  </>
                ) : (
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-destructive/20 text-lg font-bold text-destructive hover:bg-destructive/10 transition-all">
                    <LogOut size={20} /> Logout
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
