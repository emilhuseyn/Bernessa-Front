export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  rating?: number;
  reviewCount?: number;
  images: string[];
  imageUrls?: string[];
  category: string;
  categoryId?: string;
  categoryName?: string;
  inStock: boolean;
  stock?: number;
  volume?: string;
  brand?: string;
  type?: string;
  tags?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  total: number;
  shippingAddress: Address;
  paymentMethod: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  addresses: Address[];
  orders: Order[];
  role?: 'user' | 'admin';
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  permissions?: string[];
  lastLogin?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  productsChange: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  image: string;
  sales: number;
  revenue: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customer: string;
  date: string;
  status: Order['status'];
  total: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  imageUrl?: string;
  productCount: number;
}

export interface Filter {
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  rating: number;
}

export interface SortOption {
  value: string;
  label: string;
}
