import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types";

/**
 * Fetch all products for a specific vendor
 */
export const getVendorProducts = async (vendorId: string) => {
  const productsRef = collection(db, "products");
  const q = query(productsRef, where("vendorId", "==", vendorId), orderBy("createdAt", "desc"));
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Product));
};

/**
 * Create a new product
 */
export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
  const productsRef = collection(db, "products");
  return await addDoc(productsRef, {
    ...productData,
    createdAt: serverTimestamp()
  });
};

/**
 * Update an existing product
 */
export const updateProduct = async (productId: string, data: Partial<Product>) => {
  const productRef = doc(db, "products", productId);
  return await updateDoc(productRef, data);
};

/**
 * Delete a product
 */
export const deleteProduct = async (productId: string) => {
  const productRef = doc(db, "products", productId);
  return await deleteDoc(productRef);
};
