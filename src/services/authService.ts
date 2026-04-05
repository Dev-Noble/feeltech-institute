import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { UserRole, UserProfile } from "@/types";

export const registerUser = async (email: string, pass: string, name: string, role: UserRole) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  await updateProfile(user, { displayName: name });

  const profile: UserProfile = {
    id: user.uid,
    name,
    email,
    role,
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, "users", user.uid), profile);

  // If vendor, mark them as pending approval (vendors requires admin approval)
  if (role === "vendor") {
    await setDoc(doc(db, "vendors", user.uid), {
      userId: user.uid,
      storeName: name + "'s Tech Store", // default
      description: "Tech gadget store",
      isApproved: false,
      createdAt: serverTimestamp(),
    });
  }

  return { user, profile };
};

export const loginUser = async (email: string, pass: string) => {
  return await signInWithEmailAndPassword(auth, email, pass);
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const updateUserPassword = async (newPassword: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");
  const { updatePassword } = await import("firebase/auth");
  return await updatePassword(user, newPassword);
};

export const deleteUserAccount = async (userId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");
  
  const { deleteUser } = await import("firebase/auth");
  const { deleteDoc, doc } = await import("firebase/firestore");

  // 1. Delete Firestore user profile
  await deleteDoc(doc(db, "users", userId));
  
  // 2. Delete Firestore vendor profile if exists
  await deleteDoc(doc(db, "vendors", userId));

  // 3. Delete Firebase Auth user
  return await deleteUser(user);
};
