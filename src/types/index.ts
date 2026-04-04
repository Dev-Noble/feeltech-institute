export type UserRole = "customer" | "vendor" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: any;
  photoURL?: string;
  isApproved?: boolean; // Optional flag for vendors/merchants
}

export interface VendorProfile {
  id: string;
  userId: string;
  storeName: string;
  description: string;
  isApproved: boolean;
  createdAt: any;
  logoUrl?: string;
}

export interface Product {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrls: string[];
  stock: number;
  createdAt: any;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  title: string;
  imageUrl?: string;
}

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  vendorId: string; // Multi-vendor might need split orders per vendor
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "failed";
  deliveryStatus: OrderStatus;
  status: OrderStatus; // General status
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: any;
}
