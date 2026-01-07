export interface ProductTranslation {
  name: string;
  type: string;
  description: string;
}

export interface ProductVariant {
  id?: number;
  volume: string;
  price: number;
  originalPrice?: number | null;
  isActive?: boolean;
}

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
  volume?: string;
  brand?: string;
  brandId?: number;
  brandName?: string;
  type?: string;
  tags?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdOn?: string;
  updatedOn?: string;
  translations?: Record<string, ProductTranslation>;
  variants?: ProductVariant[];
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
  volume?: string;
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
  nameEn?: string;
  nameRu?: string;
  slug: string;
  image: string;
  imageUrl?: string;
  productCount: number;
  translations?: Record<string, string>;
}

export interface Brand {
  id: number;
  name: string;
  logo: string;
  logoUrl?: string;
  createdBy?: string;
  createdOn?: string;
  updatedBy?: string;
  updatedOn?: string;
  isDeleted?: boolean;
  productCount?: number;
}

export interface CreateBrandDTO {
  name: string;
  logo?: File;
}

export interface UpdateBrandDTO {
  id: number;
  name: string;
  logo?: File;
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

export interface ContactSettingTranslation {
  languageCode: string;
  supportDescription?: string;
  workingHoursWeekdays?: string;
  workingHoursSaturday?: string;
  workingHoursSunday?: string;
}

export interface ContactSetting {
  id: number;
  address: string;
  email: string;
  phone: string;
  whatsApp?: string;
  instagram?: string;
  workingHoursWeekdays?: string;
  workingHoursSaturday?: string;
  workingHoursSunday?: string;
  supportDescription?: string;
  contactImage?: string;
  latitude?: string;
  longitude?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedInUrl?: string;
  youTubeUrl?: string;
  createdOn: string;
  updatedOn: string;
  translations?: ContactSettingTranslation[] | Record<string, ContactSettingTranslation>;
}

export interface CreateContactSettingDTO {
  address: string;
  email: string;
  phone: string;
  whatsApp?: string;
  instagram?: string;
  workingHoursWeekdays?: string;
  workingHoursSaturday?: string;
  workingHoursSunday?: string;
  supportDescription?: string;
  contactImage?: File;
  latitude?: string;
  longitude?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedInUrl?: string;
  youTubeUrl?: string;
  // English Translations
  supportDescriptionEn?: string;
  workingHoursWeekdaysEn?: string;
  workingHoursSaturdayEn?: string;
  workingHoursSundayEn?: string;
  // Russian Translations
  supportDescriptionRu?: string;
  workingHoursWeekdaysRu?: string;
  workingHoursSaturdayRu?: string;
  workingHoursSundayRu?: string;
}
