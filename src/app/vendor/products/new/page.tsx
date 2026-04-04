"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { motion } from "framer-motion";
import {
  PackagePlus,
  Image as ImageIcon,
  DollarSign,
  Tag,
  AlignLeft,
  ArrowRight,
  UploadCloud,
  X,
  Layers
} from "lucide-react";

export default function NewProductPage() {
  const { user, profile, loading, isVendor } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Phones");
  const [stock, setStock] = useState("10");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (loading || !isVendor) return null;

  if (!profile?.isApproved) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber/10 text-amber border border-amber/20">
          <Layers size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Account Pending Approval</h2>
        <p className="max-w-md text-text-muted">You cannot add products until an administrator approves your vendor account.</p>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (!imageFile) throw new Error("Please select a product image");
      if (!user) throw new Error("Not logged in");

      // 1. Upload image to Cloudinary
      const imageUrl = await uploadToCloudinary(imageFile);

      // 2. Save product to Firestore
      const productData = {
        vendorId: user.uid,
        title,
        description,
        price: parseFloat(price),
        category,
        stock: parseInt(stock),
        imageUrls: [imageUrl],
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "products"), productData);
      router.push("/vendor/dashboard");
      
    } catch (err: any) {
       console.error("Error adding product:", err);
       setError(err.message || "Failed to add product.");
    } finally {
       setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
             <PackagePlus size={20} />
           </div>
           Add New Product
        </h1>
        <p className="mt-2 text-text-secondary">Create a new listing for the marketplace.</p>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-destructive">
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Basic Info */}
            <div className="space-y-6 rounded-3xl border border-white/5 bg-surface p-8 shadow-xl">
               <h3 className="text-xl font-bold text-white border-b border-white/5 pb-4 mb-6">Basic Information</h3>
               
               <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-2">Product Title</label>
                  <div className="relative group">
                     <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" size={18} />
                     <input
                        required
                        type="text"
                        placeholder="e.g. iPhone 16 Pro Max"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="h-12 w-full rounded-2xl border border-white/5 bg-carbon pl-12 pr-4 text-white placeholder:text-text-placeholder focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-2">Price ($)</label>
                     <div className="relative group">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" size={18} />
                        <input
                           required
                           type="number"
                           min="0"
                           step="0.01"
                           placeholder="0.00"
                           value={price}
                           onChange={(e) => setPrice(e.target.value)}
                           className="h-12 w-full rounded-2xl border border-white/5 bg-carbon pl-12 pr-4 text-white placeholder:text-text-placeholder focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                        />
                     </div>
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-2">Stock</label>
                     <div className="relative group">
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" size={18} />
                        <input
                           required
                           type="number"
                           min="0"
                           value={stock}
                           onChange={(e) => setStock(e.target.value)}
                           className="h-12 w-full rounded-2xl border border-white/5 bg-carbon pl-12 pr-4 text-white placeholder:text-text-placeholder focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                     </div>
                  </div>
               </div>

               <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-2">Category</label>
                  <select
                     required
                     value={category}
                     onChange={(e) => setCategory(e.target.value)}
                     className="h-12 w-full rounded-2xl border border-white/5 bg-carbon px-4 text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                  >
                     <option value="Phones">Phones</option>
                     <option value="Laptops">Laptops</option>
                     <option value="Accessories">Accessories</option>
                     <option value="Smartwatch">Smartwatch</option>
                     <option value="Audio">Audio</option>
                  </select>
               </div>

               <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-2">Description</label>
                  <div className="relative group">
                     <AlignLeft className="absolute left-4 top-4 text-text-muted transition-colors group-focus-within:text-primary" size={18} />
                     <textarea
                        required
                        rows={5}
                        placeholder="Describe the product in detail..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-2xl border border-white/5 bg-carbon pl-12 pr-4 pt-4 text-white placeholder:text-text-placeholder focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                     />
                  </div>
               </div>
            </div>

            {/* Right Column: Media */}
            <div className="space-y-6 rounded-3xl border border-white/5 bg-surface p-8 shadow-xl flex flex-col">
               <h3 className="text-xl font-bold text-white border-b border-white/5 pb-4 mb-2">Product Media</h3>
               <p className="text-sm text-text-muted mb-4">High-quality images increase sales. First image will be the cover.</p>
               
               <div className="flex-1 flex flex-col">
                  {previewUrl ? (
                     <div className="relative flex-1 min-h-[300px] w-full overflow-hidden rounded-2xl border border-white/10 bg-surface-elevated group">
                        <img 
                           src={previewUrl} 
                           alt="Product Preview" 
                           className="h-full w-full object-contain p-4 mix-blend-screen"
                        />
                        <button
                           type="button"
                           onClick={handleRemoveImage}
                           className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/80 text-white backdrop-blur-md transition-transform hover:scale-110 opacity-0 group-hover:opacity-100"
                        >
                           <X size={18} />
                        </button>
                     </div>
                  ) : (
                     <label className="relative flex flex-1 min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-surface-elevated/50 transition-all hover:border-primary/50 hover:bg-surface-elevated group overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 flex flex-col items-center gap-4">
                           <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-text-muted group-hover:text-primary transition-colors group-hover:scale-110 duration-300">
                              <UploadCloud size={32} />
                           </div>
                           <div className="text-center">
                              <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Click to upload image</p>
                              <p className="mt-1 text-xs text-text-muted">PNG, JPG up to 5MB</p>
                           </div>
                        </div>
                        <input
                           type="file"
                           accept="image/*"
                           onChange={handleImageChange}
                           className="hidden"
                        />
                     </label>
                  )}
               </div>
            </div>
         </div>

         {/* Actions */}
         <div className="flex items-center justify-end gap-4 rounded-3xl border border-white/5 bg-surface p-6 shadow-xl">
            <button
               type="button"
               onClick={() => router.back()}
               className="rounded-xl px-6 py-3 text-sm font-bold text-text-secondary hover:text-white transition-colors"
            >
               Cancel
            </button>
            <button
               type="submit"
               disabled={isSubmitting || !imageFile}
               className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
            >
               <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? "Publishing Product..." : "Publish Product"}
                  {!isSubmitting && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
               </span>
            </button>
         </div>
      </form>
    </div>
  );
}
