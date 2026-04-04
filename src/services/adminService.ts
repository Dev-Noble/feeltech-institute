import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  updateDoc,
  doc,
  getCountFromServer,
  getDoc,
  deleteDoc,
  DocumentData,
  QueryDocumentSnapshot
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile, UserRole } from "@/types";

/**
 * Get global platform statistics
 */
export const getAdminStats = async () => {
  const usersRef = collection(db, "users");
  const vendorsRef = collection(db, "vendors");
  const ordersRef = collection(db, "orders");

  const [usersCount, vendorsCount, ordersSnapshot] = await Promise.all([
    getCountFromServer(usersRef),
    getCountFromServer(vendorsRef),
    getDocs(ordersRef)
  ]);

  const totalRevenue = ordersSnapshot.docs.reduce((sum: number, doc: QueryDocumentSnapshot<DocumentData>) => sum + (doc.data().totalAmount || 0), 0);

  return {
    totalUsers: usersCount.data().count,
    totalVendors: vendorsCount.data().count,
    totalOrders: ordersSnapshot.size,
    totalRevenue
  };
};

/**
 * Fetch pending vendors for approval
 */
export const getPendingVendors = async () => {
  const vendorsRef = collection(db, "vendors");
  const q = query(vendorsRef, where("isApproved", "==", false), orderBy("createdAt", "desc"));
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

/**
 * Approve or Reject a vendor
 */
export const updateVendorStatus = async (vendorId: string, isApproved: boolean) => {
  const vendorRef = doc(db, "vendors", vendorId);
  const userRef = doc(db, "users", vendorId);

  // Update vendor profile
  await updateDoc(vendorRef, { isApproved });
  
  // If approved, ensure user role is still 'vendor' (it should be)
  if (isApproved) {
    await updateDoc(userRef, { role: 'vendor' });
  }
};

/**
 * Fetch recent system activity (combined orders and new users)
 */
export const getRecentActivity = async (limitCount = 5) => {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, orderBy("createdAt", "desc"), limit(limitCount));
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    type: 'order',
    msg: `New order ${doc.id.slice(0, 8)} placed`,
    time: doc.data().createdAt?.toDate() || new Date(),
    status: 'success'
  }));
};

/**
 * Fetch all users on the platform
 */
export const getAllUsers = async () => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, orderBy("createdAt", "desc"));
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as UserProfile));
};

/**
 * Change a user's role
 */
export const updateUserRole = async (userId: string, newRole: UserRole) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { role: newRole });
};
