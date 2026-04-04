import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Order } from "@/types";

/**
 * Fetch orders for a specific customer
 */
export const getCustomerOrders = async (userId: string) => {
  const ordersRef = collection(db, "orders");
  const q = query(
    ordersRef, 
    where("customerId", "==", userId),
    orderBy("createdAt", "desc")
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Order));
};

/**
 * Get customer statistics
 */
export const getCustomerStats = async (userId: string) => {
  const orders = await getCustomerOrders(userId);
  
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.deliveryStatus === "pending").length;
  
  return {
    totalSpent,
    totalOrders,
    pendingOrders
  };
};
