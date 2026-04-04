import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Github, Mail, Phone, MapPin, Zap, ArrowRight } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-white/5 bg-surface pt-20 pb-10">
      {/* Top border handled by standard border class */}

      <div className="container mx-auto px-4 lg:px-8">
        {/* Newsletter Section */}
        <div className="mb-16 rounded-3xl bg-primary p-8 lg:p-12 relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-extrabold text-white lg:text-3xl">Stay in the Loop</h3>
              <p className="mt-2 text-white/70">Get the latest deals, new arrivals, and exclusive offers.</p>
            </div>
            <div className="flex w-full max-w-md gap-3">
              <input
                type="email"
                placeholder="Enter your email..."
                className="h-13 flex-1 rounded-2xl bg-white/10 px-5 text-sm text-white placeholder:text-white/50 backdrop-blur-md outline-none ring-2 ring-white/10 transition-all focus:ring-white/30"
              />
              <button className="flex h-13 items-center gap-2 rounded-2xl bg-white px-6 font-bold text-primary shadow-lg transition-all hover:scale-105 active:scale-100">
                Subscribe <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <Zap size={22} className="text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Feel<span className="text-primary">tech</span>
              </span>
            </Link>
            <p className="text-text-muted leading-relaxed text-sm">
              Premium tech gadgets for the modern world. Your one-stop marketplace for phones, laptops, and smart accessories.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Facebook size={16} />, href: "#" },
                { icon: <Twitter size={16} />, href: "#" },
                { icon: <Instagram size={16} />, href: "#" },
                { icon: <Github size={16} />, href: "#" },
              ].map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-text-muted transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary hover:scale-110"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-text-primary">Marketplace</h3>
            <ul className="space-y-4">
              {[
                { href: "/products", label: "Browse Products" },
                { href: "/categories", label: "Categories" },
                { href: "/deals", label: "Today's Deals" },
                { href: "/vendors", label: "Top Sellers" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-muted transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-text-primary">Support</h3>
            <ul className="space-y-4">
              {[
                { href: "/track-order", label: "Track Order" },
                { href: "/returns", label: "Returns & Refunds" },
                { href: "/shipping", label: "Shipping Info" },
                { href: "/help", label: "Help Center" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-muted transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-text-primary">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-text-muted">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="text-primary" size={14} />
                </div>
                <span>+234 800 FEELTECH</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-text-muted">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="text-primary" size={14} />
                </div>
                <span>hello@feeltech.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-text-muted">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="text-primary" size={14} />
                </div>
                <span>Lagos, Nigeria & Global</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Feeltech Marketplace. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-text-muted">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
