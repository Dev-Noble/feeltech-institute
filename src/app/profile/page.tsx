"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Camera, 
  Save, 
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { updateUserPassword, deleteUserAccount, logoutUser } from "@/services/authService";

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (profile) {
      setName(profile.name);
    }
  }, [loading, user, profile, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;

    setUpdating(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(user, { displayName: name });
      
      // Update Firestore profile
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { name });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Error updating profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) return;
    setUpdating(true);
    try {
      await updateUserPassword(newPassword);
      setPwSuccess(true);
      setNewPassword("");
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to update password. You may need to log out and back in to perform this action.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setUpdating(true);
    try {
      await deleteUserAccount(user.uid);
      router.push("/login");
    } catch (err: any) {
      alert(err.message || "Failed to delete account. This action requires a recent login.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
       <button 
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-sm font-bold text-text-muted hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Account Settings</h1>
          <p className="text-text-secondary text-lg">Manage your public profile and account security.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Sidebar: Profile Card */}
           <div className="space-y-6">
              <div className="rounded-3xl border border-white/5 bg-surface p-8 shadow-xl relative overflow-hidden text-center">
                 <div className="absolute inset-0 bg-carbon z-0" />
                 <div className="relative z-10 flex flex-col items-center">
                    <div className="relative group mb-6">
                       <div className="h-24 w-24 rounded-3xl bg-surface-elevated border border-white/5 flex items-center justify-center text-text-muted overflow-hidden">
                          {user.photoURL ? <img src={user.photoURL} alt="" /> : <User size={48} />}
                       </div>
                       <button className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-2 border-surface group-hover:scale-110 transition-transform">
                          <Camera size={14} />
                       </button>
                    </div>
                    <h3 className="text-xl font-bold text-white">{profile?.name || user.displayName}</h3>
                    <p className="text-sm text-text-muted mb-4">{user.email}</p>
                    
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                       <Shield size={12} /> {profile?.role || "Customer"}
                    </div>
                 </div>
              </div>

              <div className="rounded-3xl border border-white/5 bg-surface p-6 shadow-xl relative overflow-hidden">
                 <div className="absolute inset-0 bg-carbon z-0" />
                 <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3 text-text-muted">
                       <Calendar size={18} />
                       <span className="text-sm">Joined {new Date(user.metadata.creationTime || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-text-muted">
                       <Mail size={18} />
                       <span className="text-sm">Email Verified: {user.emailVerified ? "Yes" : "No"}</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Main: Edit Form */}
           <div className="md:col-span-2">
              <div className="rounded-3xl border border-white/5 bg-surface p-8 shadow-xl relative overflow-hidden">
                 <div className="absolute inset-0 bg-carbon z-0" />
                 <form onSubmit={handleUpdate} className="relative z-10 space-y-8">
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-text-muted uppercase tracking-widest">Display Name</label>
                          <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-14 rounded-2xl glass-input px-5 text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                            placeholder="Your Full Name"
                          />
                       </div>

                       <div className="space-y-2 opacity-60">
                          <label className="text-sm font-bold text-text-muted uppercase tracking-widest">Email Address (Managed by System)</label>
                          <input 
                            type="email" 
                            value={user.email || ""}
                            disabled
                            className="w-full h-14 rounded-2xl bg-white/5 border border-white/5 px-5 text-text-muted cursor-not-allowed"
                          />
                          <p className="text-xs text-text-muted">Contact support to change your primary email.</p>
                       </div>
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                       <button 
                        type="submit"
                        disabled={updating}
                        className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2"
                       >
                          {updating ? "Updating..." : <><Save size={18} /> Save Changes</>}
                       </button>
                    </div>

                    {success && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-4 rounded-2xl bg-emerald/10 border border-emerald/20 text-emerald text-sm font-bold"
                      >
                        <CheckCircle2 size={16} /> Profile updated successfully!
                      </motion.div>
                    )}
                 </form>
              </div>

              {/* Change Password Section */}
              <div className="mt-8 rounded-3xl border border-white/5 bg-surface p-8 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-carbon z-0" />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield className="text-primary" size={20} /> Security Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-text-muted uppercase tracking-widest pl-1">New Password</label>
                      <div className="flex gap-4">
                        <input 
                          type="password" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="flex-1 h-12 rounded-xl glass-input px-4 text-sm text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all font-mono"
                        />
                        <button 
                          onClick={handlePasswordChange}
                          disabled={!newPassword || newPassword.length < 6 || updating}
                          className="h-12 px-6 rounded-xl bg-surface-elevated border border-white/10 text-sm font-bold text-white hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Update Password
                        </button>
                      </div>
                      {pwSuccess && <p className="text-xs text-emerald font-bold mt-2 ml-1">Password updated successfully!</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="mt-8 rounded-3xl border border-destructive/10 bg-destructive/5 p-8 shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-destructive mb-2">Danger Zone</h3>
                  <p className="text-sm text-text-muted mb-6">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  
                  {!confirmDelete ? (
                    <button 
                      onClick={() => setConfirmDelete(true)}
                      className="h-12 px-6 rounded-xl bg-destructive text-white text-sm font-bold shadow-lg shadow-destructive/20 hover:scale-[1.02] active:scale-98 transition-all"
                    >
                      Delete Account
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-carbon/50 p-4 rounded-2xl border border-destructive/20">
                      <p className="text-sm font-bold text-white">Are you absolutely sure?</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={handleDeleteAccount}
                          disabled={updating}
                          className="h-10 px-4 rounded-lg bg-destructive text-white text-xs font-black uppercase tracking-widest"
                        >
                          Yes, Delete
                        </button>
                        <button 
                          onClick={() => setConfirmDelete(false)}
                          className="h-10 px-4 rounded-lg bg-surface-elevated text-white text-xs font-black uppercase tracking-widest"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
