"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import { UserProfile } from "@/types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isVendor: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isVendor: false,
  isCustomer: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase isn't configured with real credentials, skip auth listener
    if (!isFirebaseConfigured) {
      console.warn("Firebase not configured — running in demo mode. Auth disabled.");
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        // Real-time listener for profile updates
        const unsubscribeProfile = onSnapshot(doc(db, "users", authUser.uid), (userDoc) => {
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            setProfile(null);
          }
          setLoading(false);
        }, (err: Error) => {
          console.error("Failed to fetch user profile:", err);
          setProfile(null);
          setLoading(false);
        });

        return () => {
          unsubscribeProfile();
        };
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const isAdmin = profile?.role === "admin";
  const isVendor = profile?.role === "vendor";
  const isCustomer = profile?.role === "customer";

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, isVendor, isCustomer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
