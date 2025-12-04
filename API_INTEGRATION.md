# API İnteqrasiya Bələdçisi

Bu sənəd frontend (React) və backend (.NET) arasında API inteqrasiyasını izah edir.

## 📋 İçindəkilər

1. [Ümumi Konfiqurasiya](#ümumi-konfiqurasiya)
2. [API Xidmətləri](#api-xidmətləri)
3. [Zustand Store İnteqrasiyası](#zustand-store-inteqrasiyası)
4. [Komponentlərdə İstifadə](#komponentlərdə-istifadə)
5. [Error Handling](#error-handling)

---

## 🔧 Ümumi Konfiqurasiya

### Environment Variables

`.env` faylı yaradın:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Axios İnstansı

`src/services/api.ts` - Bütün API çağırışları üçün əsas konfiqurasiya:

```typescript
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Admin token əlavə etmək üçün
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// Response interceptor - Error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin-token');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error.response?.data || error.message);
  }
);
```

---

## 🛠 API Xidmətləri

### 1. Category Service

**Backend Endpoints:**
```
GET    /api/categories              - Bütün kateqoriyalar
GET    /api/categories/{id}         - ID-yə görə kateqoriya
GET    /api/categories/slug/{slug}  - Slug-a görə kateqoriya
POST   /api/categories              - Kateqoriya yarat (Admin)
PUT    /api/categories/{id}         - Kateqoriya yenilə (Admin)
DELETE /api/categories/{id}         - Kateqoriya sil (Admin)
```

**Frontend Service:**
```typescript
// src/services/categoryService.ts
export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    return api.get('/categories');
  },
  
  getById: async (id: string): Promise<Category> => {
    return api.get(`/categories/${id}`);
  },
  
  getBySlug: async (slug: string): Promise<Category> => {
    return api.get(`/categories/slug/${slug}`);
  },
  
  create: async (data: CreateCategoryDTO): Promise<Category> => {
    return api.post('/categories', data);
  },
  
  update: async (id: string, data: UpdateCategoryDTO): Promise<Category> => {
    return api.put(`/categories/${id}`, data);
  },
  
  delete: async (id: string): Promise<void> => {
    return api.delete(`/categories/${id}`);
  },
};
```

### 2. Product Service

**Backend Endpoints:**
```
GET    /api/products                    - Bütün məhsullar (filter ilə)
GET    /api/products/{id}               - ID-yə görə məhsul
GET    /api/products/slug/{slug}        - Slug-a görə məhsul
GET    /api/products/featured           - Seçilmiş məhsullar
GET    /api/products/deals              - Endirimli məhsullar
GET    /api/products/search?q={query}   - Məhsul axtarışı
GET    /api/products/category/{id}      - Kateqoriyaya görə məhsullar
POST   /api/products                    - Məhsul yarat (Admin)
PUT    /api/products/{id}               - Məhsul yenilə (Admin)
DELETE /api/products/{id}               - Məhsul sil (Admin)
```

**Frontend Service:**
```typescript
// src/services/productService.ts
export const productService = {
  getAll: async (params?: ProductFilterParams): Promise<Product[]> => {
    return api.get('/products', { params });
  },
  
  getById: async (id: string): Promise<Product> => {
    return api.get(`/products/${id}`);
  },
  
  getBySlug: async (slug: string): Promise<Product> => {
    return api.get(`/products/slug/${slug}`);
  },
  
  getFeatured: async (): Promise<Product[]> => {
    return api.get('/products/featured');
  },
  
  getDeals: async (): Promise<Product[]> => {
    return api.get('/products/deals');
  },
  
  search: async (query: string): Promise<Product[]> => {
    return api.get('/products/search', { params: { q: query } });
  },
  
  getByCategory: async (categoryId: string): Promise<Product[]> => {
    return api.get(`/products/category/${categoryId}`);
  },
  
  create: async (data: CreateProductDTO): Promise<Product> => {
    return api.post('/products', data);
  },
  
  update: async (id: string, data: UpdateProductDTO): Promise<Product> => {
    return api.put(`/products/${id}`, data);
  },
  
  delete: async (id: string): Promise<void> => {
    return api.delete(`/products/${id}`);
  },
};
```

### 3. Order Service

**Backend Endpoints:**
```
POST   /api/orderses                     - Sifariş yarat (Guest)
GET    /api/orderses/{id}                - ID-yə görə sifariş
GET    /api/orderses/track/{orderNumber} - Order number ilə izləmə
GET    /api/admin/orders                 - Bütün sifarişlər (Admin)
PUT    /api/admin/orders/{id}/status     - Status yenilə (Admin)
GET    /api/admin/orders/stats           - Sifariş statistikası (Admin)
```

**Frontend Service:**
```typescript
// src/services/orderService.ts
const normalizeOrder = (raw: any): OrderSummary => ({
  id: raw?.id ?? raw?.orderId ?? '',
  orderNumber: raw?.orderNumber ?? raw?.orderNo ?? '',
  status: raw?.status ?? raw?.orderStatus ?? 'pending',
  totalAmount: Number(raw?.totalAmount ?? raw?.total ?? 0),
  currency: raw?.currency ?? raw?.currencyCode ?? 'AZN',
  paymentMethod: raw?.paymentMethod ?? raw?.paymentType ?? 'card',
  customerName: raw?.customerName ?? raw?.customer?.name ?? '',
  customerEmail: raw?.customerEmail ?? raw?.customer?.email ?? '',
  customerPhone: raw?.customerPhone ?? raw?.customer?.phone ?? '',
  shippingAddress: raw?.shippingAddress ?? raw?.address ?? '',
  customerNote: raw?.customerNote ?? raw?.note ?? '',
  createdAt: raw?.createdAt ?? raw?.createdOn ?? new Date().toISOString(),
  items: Array.isArray(raw?.items)
    ? raw.items.map((item: any) => ({
        productId: item?.productId ?? item?.id ?? '',
        name: item?.name ?? item?.productName ?? '',
        quantity: Number(item?.quantity ?? 0),
        price: Number(item?.price ?? item?.unitPrice ?? 0),
        image: item?.image ?? item?.imageUrl ?? '',
      }))
    : [],
});

export const orderService = {
  create: async (data: CreateOrderDTO): Promise<OrderSummary> => {
    const payload = {
      CustomerName: data.customerName,
      CustomerEmail: data.customerEmail,
      CustomerPhone: data.customerPhone,
      ShippingAddress: data.shippingAddress,
      CustomerNote: data.customerNote,
      DiscountCode: data.discountCode,
      PaymentMethod: data.paymentMethod,
      Items: data.items.map((item) => ({
        ProductId: item.productId,
        Quantity: item.quantity,
      })),
    };

    const response = await api.post('/orderses', payload);
    return normalizeOrder(response);
  },

  getById: async (id: string | number): Promise<OrderSummary> => {
    const response = await api.get(`/orderses/${id}`);
    return normalizeOrder(response);
  },

  getByOrderNumber: async (orderNumber: string): Promise<OrderSummary> => {
    const response = await api.get(`/orderses/track/${orderNumber}`);
    return normalizeOrder(response);
  },

  getAllAdmin: async (status?: string): Promise<OrderSummary[]> => {
    const response = await api.get('/admin/orders', { params: { status } });
    return Array.isArray(response) ? response.map((item) => normalizeOrder(item)) : [];
  },

  updateStatus: async (id: string | number, data: UpdateOrderStatusDTO): Promise<OrderSummary> => {
    const response = await api.put(`/admin/orders/${id}/status`, data);
    return normalizeOrder(response);
  },

  getStats: async () => {
    return api.get('/admin/orders/stats');
  },
};
```

### 4. Admin Service

**Backend Endpoints:**
```
POST   /api/admin/auth/login          - Admin login
GET    /api/analyticses/dashboard     - Dashboard statistikası
```

**Frontend Service:**
```typescript
// src/services/adminService.ts
export const adminService = {
  login: async (data: AdminLoginDTO): Promise<AdminLoginResponse> => {
    const response = await api.post('/admin/auth/login', data);
    if (response.token) {
      localStorage.setItem('admin-token', response.token);
    }
    return response;
  },
  
  logout: () => {
    localStorage.removeItem('admin-token');
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('admin-token');
  },

  getDashboard: async (): Promise<DashboardAnalytics> => {
    return api.get('/analyticses/dashboard');
  },
};
```

---

## 🗂 Zustand Store İnteqrasiyası

### Cart Store ilə API

Mock datanı real API ilə əvəz edin:

```typescript
// src/store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { productService } from '../services';
import type { Product, CartItem } from '../types';

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      addItem: async (productId: string, quantity = 1) => {
        set({ isLoading: true, error: null });
        try {
          // Fetch product from API
          const product = await productService.getById(productId);
          
          const { items } = get();
          const existingItem = items.find((item) => item.id === productId);

          if (existingItem) {
            set({
              items: items.map((item) =>
                item.id === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isLoading: false,
            });
          } else {
            set({
              items: [...items, { ...product, quantity }],
              isLoading: false,
            });
          }
        } catch (error) {
          set({ 
            error: 'Məhsul əlavə edilərkən xəta baş verdi', 
            isLoading: false 
          });
        }
      },

      removeItem: (productId: string) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),

      updateQuantity: (productId: string, quantity: number) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

### Auth Store ilə API

```typescript
// src/store/authStore.ts (Admin üçün)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminService } from '../services';

interface AuthStore {
  isAuthenticated: boolean;
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      admin: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await adminService.login({ email, password });
          set({
            isAuthenticated: true,
            admin: response.admin,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Giriş uğursuz oldu',
            isLoading: false,
          });
        }
      },

      logout: () => {
        adminService.logout();
        set({ isAuthenticated: false, admin: null });
      },

      checkAuth: () => {
        const isAuth = adminService.isAuthenticated();
        if (!isAuth) {
          set({ isAuthenticated: false, admin: null });
        }
        return isAuth;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

---

## 🎨 Komponentlərdə İstifadə

### 1. HomePage - Məhsulları yüklə

```typescript
// src/pages/HomePage.tsx
import { useEffect, useState } from 'react';
import { productService, categoryService } from '../services';
import type { Product, Category } from '../types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getFeatured(),
          categoryService.getAll(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    // ... render products and categories
  );
}
```

### 2. ProductPage - Məhsul detalları

```typescript
// src/pages/ProductPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services';
import { useCartStore } from '../store/cartStore';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const data = await productService.getById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (product) {
      await addItem(product.id, 1);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    // ... render product details
  );
}
```

### 3. CheckoutPage - Sifariş yarat

```typescript
// src/pages/CheckoutPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services';
import { useCartStore } from '../store/cartStore';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      const orderData = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      };

      const order = await orderService.create(orderData);
      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Sifariş yaradılarkən xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ... render checkout form
  );
}
```

### 4. AdminLogin - Admin girişi

```typescript
// src/pages/admin/AdminLogin.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData.email, formData.password);
    
    if (!error) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Şifrə"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Giriş edilir...' : 'Daxil ol'}
      </button>
    </form>
  );
}
```

### 5. AdminProducts - Məhsulları idarə et

```typescript
// src/pages/admin/AdminProducts.tsx
import { useEffect, useState } from 'react';
import { productService } from '../../services';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Məhsulu silmək istədiyinizdən əminsiniz?')) return;
    
    try {
      await productService.delete(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleCreate = async (data: CreateProductDTO) => {
    try {
      const newProduct = await productService.create(data);
      setProducts([...products, newProduct]);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    // ... render products table with CRUD operations
  );
}
```

---

## ⚠️ Error Handling

### Global Error Handler

```typescript
// src/utils/errorHandler.ts
export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error
    const status = error.response.status;
    const message = error.response.data?.message || 'Xəta baş verdi';
    
    switch (status) {
      case 400:
        return 'Yanlış məlumat göndərildi';
      case 401:
        return 'Giriş tələb olunur';
      case 403:
        return 'Bu əməliyyata icazəniz yoxdur';
      case 404:
        return 'Məlumat tapılmadı';
      case 500:
        return 'Server xətası';
      default:
        return message;
    }
  } else if (error.request) {
    // Request made but no response
    return 'Serverə qoşulmaq mümkün olmadı';
  } else {
    // Something else happened
    return error.message || 'Naməlum xəta';
  }
};
```

### Use in Components

```typescript
import { handleApiError } from '../utils/errorHandler';

try {
  await productService.create(data);
} catch (error) {
  const errorMessage = handleApiError(error);
  alert(errorMessage); // or show toast notification
}
```

---

## 📦 Paket Quraşdırması

```bash
npm install axios
```

## 🔐 CORS Konfiqurasiyası

Backend-də CORS konfiqurasiyası (.NET):

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
    {
        builder.WithOrigins("http://localhost:5173") // React dev server
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

app.UseCors("AllowFrontend");
```

---

## ✅ Test Edilməli Ssenarilar

1. ✅ Məhsulları yüklə və göstər
2. ✅ Kateqoriya filteri
3. ✅ Axtarış funksiyası
4. ✅ Səbətə əlavə et
5. ✅ Checkout prosesi
6. ✅ Admin login
7. ✅ CRUD əməliyyatları (Admin)
8. ✅ Error handling
9. ✅ Loading states
10. ✅ Token refresh

---

## 🚀 Production Hazırlığı

1. Environment variables production üçün:
```env
VITE_API_BASE_URL=https://api.yoursite.com/api
```

2. Error tracking (Sentry):
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: import.meta.env.MODE,
});
```

3. API caching (React Query tövsiyə olunur):
```bash
npm install @tanstack/react-query
```

---

**Artıq bütün API-lər inteqrasiya edilmişdir!** 🎉
