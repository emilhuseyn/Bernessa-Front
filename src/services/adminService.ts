import api from './api';
import type { AdminUser } from '../types';

export interface AdminLoginDTO {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  admin: AdminUser;
}

export interface DashboardRecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  customerEmail?: string;
  customerPhone?: string;
  paymentMethod?: string;
  itemCount?: number;
}

export interface DashboardTopProduct {
  id: string;
  name: string;
  salesCount: number;
  revenue: number;
  imageUrl?: string;
  brand?: string;
  categoryName?: string;
  currentStock?: number;
  price?: number;
}

export interface OrderStatusBreakdown {
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  pendingRevenue: number;
  processingRevenue: number;
  shippedRevenue: number;
  deliveredRevenue: number;
  cancelledRevenue: number;
}

export interface CategoryPerformance {
  categoryId: string;
  categoryName: string;
  productCount: number;
  totalSold: number;
  revenue: number;
  orderCount: number;
}

export interface LowStockProduct {
  productId: string;
  productName: string;
  productBrand?: string;
  currentStock: number;
  isOutOfStock: boolean;
  price: number;
}

export interface PaymentMethodStats {
  paymentMethod: string;
  orderCount: number;
  totalRevenue: number;
  percentage: number;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface MonthlyRevenue {
  year: number;
  month: number;
  monthName: string;
  revenue: number;
  orderCount: number;
}

export interface GrowthMetrics {
  revenueGrowthWeek: number;
  revenueGrowthMonth: number;
  ordersGrowthWeek: number;
  ordersGrowthMonth: number;
  customersGrowthWeek: number;
  customersGrowthMonth: number;
  averageOrderValueGrowth: number;
}

export interface DashboardAnalytics {
  totalRevenue: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  yearRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
  yearOrders: number;
  orderStatusBreakdown: OrderStatusBreakdown;
  totalCustomers: number;
  newCustomersToday: number;
  newCustomersWeek: number;
  newCustomersMonth: number;
  returningCustomers: number;
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  featuredProducts: number;
  totalCategories: number;
  topCategories: CategoryPerformance[];
  topProducts: DashboardTopProduct[];
  topSellingProducts: DashboardTopProduct[];
  topRevenueProducts: DashboardTopProduct[];
  lowStockAlerts: LowStockProduct[];
  recentOrders: DashboardRecentOrder[];
  pendingOrders: DashboardRecentOrder[];
  paymentMethodStats: PaymentMethodStats[];
  last7DaysRevenue: DailyRevenue[];
  last12MonthsRevenue: MonthlyRevenue[];
  growthMetrics: GrowthMetrics;
}

type RawDashboardResponse = {
  totalRevenue?: number;
  TotalRevenue?: number;
  todayRevenue?: number;
  TodayRevenue?: number;
  weekRevenue?: number;
  WeekRevenue?: number;
  monthRevenue?: number;
  MonthRevenue?: number;
  yearRevenue?: number;
  YearRevenue?: number;
  averageOrderValue?: number;
  AverageOrderValue?: number;
  totalOrders?: number;
  TotalOrders?: number;
  todayOrders?: number;
  TodayOrders?: number;
  weekOrders?: number;
  WeekOrders?: number;
  monthOrders?: number;
  MonthOrders?: number;
  yearOrders?: number;
  YearOrders?: number;
  totalCustomers?: number;
  TotalCustomers?: number;
  newCustomersToday?: number;
  NewCustomersToday?: number;
  newCustomersWeek?: number;
  NewCustomersWeek?: number;
  newCustomersMonth?: number;
  NewCustomersMonth?: number;
  returningCustomers?: number;
  ReturningCustomers?: number;
  totalProducts?: number;
  TotalProducts?: number;
  activeProducts?: number;
  ActiveProducts?: number;
  inactiveProducts?: number;
  InactiveProducts?: number;
  outOfStockProducts?: number;
  OutOfStockProducts?: number;
  lowStockProducts?: number;
  LowStockProducts?: number;
  featuredProducts?: number;
  FeaturedProducts?: number;
  totalCategories?: number;
  TotalCategories?: number;
  recentOrders?: RawDashboardOrder[];
  RecentOrders?: RawDashboardOrder[];
  topProducts?: RawDashboardProduct[];
  TopProducts?: RawDashboardProduct[];
  topSellingProducts?: RawDashboardProduct[];
  TopSellingProducts?: RawDashboardProduct[];
  topRevenueProducts?: RawDashboardProduct[];
  TopRevenueProducts?: RawDashboardProduct[];
  orderStatusBreakdown?: RawOrderStatusBreakdown;
  OrderStatusBreakdown?: RawOrderStatusBreakdown;
  topCategories?: RawCategoryPerformance[];
  TopCategories?: RawCategoryPerformance[];
  lowStockAlerts?: RawLowStockProduct[];
  LowStockAlerts?: RawLowStockProduct[];
  pendingOrders?: RawDashboardOrder[];
  PendingOrders?: RawDashboardOrder[];
  paymentMethodStats?: RawPaymentMethodStat[];
  PaymentMethodStats?: RawPaymentMethodStat[];
  last7DaysRevenue?: RawDailyRevenue[];
  Last7DaysRevenue?: RawDailyRevenue[];
  last12MonthsRevenue?: RawMonthlyRevenue[];
  Last12MonthsRevenue?: RawMonthlyRevenue[];
  growthMetrics?: RawGrowthMetrics;
  GrowthMetrics?: RawGrowthMetrics;
};

type RawDashboardOrder = {
  id?: string | number;
  Id?: string | number;
  orderId?: string | number;
  OrderId?: string | number;
  orderNumber?: string;
  OrderNumber?: string;
  customerName?: string;
  CustomerName?: string;
  customerEmail?: string;
  CustomerEmail?: string;
  customerPhone?: string;
  CustomerPhone?: string;
  total?: number;
  Total?: number;
  totalAmount?: number;
  TotalAmount?: number;
  status?: string;
  Status?: string;
  createdAt?: string;
  CreatedAt?: string;
  createdOn?: string;
  CreatedOn?: string;
  paymentMethod?: string;
  PaymentMethod?: string;
  itemCount?: number;
  ItemCount?: number;
};

type RawDashboardProduct = {
  id?: string | number;
  Id?: string | number;
  productId?: string | number;
  ProductId?: string | number;
  name?: string;
  Name?: string;
  productName?: string;
  ProductName?: string;
  productBrand?: string;
  ProductBrand?: string;
  brand?: string;
  Brand?: string;
  categoryName?: string;
  CategoryName?: string;
  sales?: number;
  Sales?: number;
  salesCount?: number;
  SalesCount?: number;
  totalSales?: number;
  TotalSales?: number;
  revenue?: number;
  Revenue?: number;
  totalRevenue?: number;
  TotalRevenue?: number;
  image?: string;
  Image?: string;
  imageUrl?: string;
  ImageUrl?: string;
  stock?: number;
  Stock?: number;
  currentStock?: number;
  CurrentStock?: number;
  price?: number;
  Price?: number;
};

type RawOrderStatusBreakdown = {
  pending?: number;
  Pending?: number;
  processing?: number;
  Processing?: number;
  shipped?: number;
  Shipped?: number;
  delivered?: number;
  Delivered?: number;
  cancelled?: number;
  Cancelled?: number;
  pendingRevenue?: number;
  PendingRevenue?: number;
  processingRevenue?: number;
  ProcessingRevenue?: number;
  shippedRevenue?: number;
  ShippedRevenue?: number;
  deliveredRevenue?: number;
  DeliveredRevenue?: number;
  cancelledRevenue?: number;
  CancelledRevenue?: number;
};

type RawCategoryPerformance = {
  categoryId?: string | number;
  CategoryId?: string | number;
  categoryName?: string;
  CategoryName?: string;
  productCount?: number;
  ProductCount?: number;
  totalSold?: number;
  TotalSold?: number;
  revenue?: number;
  Revenue?: number;
  orderCount?: number;
  OrderCount?: number;
};

type RawLowStockProduct = {
  productId?: string | number;
  ProductId?: string | number;
  productName?: string;
  ProductName?: string;
  productBrand?: string;
  ProductBrand?: string;
  brand?: string;
  Brand?: string;
  currentStock?: number;
  CurrentStock?: number;
  stock?: number;
  Stock?: number;
  isOutOfStock?: boolean;
  IsOutOfStock?: boolean;
  price?: number;
  Price?: number;
};

type RawPaymentMethodStat = {
  paymentMethod?: string;
  PaymentMethod?: string;
  orderCount?: number;
  OrderCount?: number;
  totalRevenue?: number;
  TotalRevenue?: number;
  percentage?: number;
  Percentage?: number;
};

type RawDailyRevenue = {
  date?: string;
  Date?: string;
  revenue?: number;
  Revenue?: number;
  orderCount?: number;
  OrderCount?: number;
};

type RawMonthlyRevenue = {
  year?: number;
  Year?: number;
  month?: number;
  Month?: number;
  monthName?: string;
  MonthName?: string;
  revenue?: number;
  Revenue?: number;
  orderCount?: number;
  OrderCount?: number;
};

type RawGrowthMetrics = {
  revenueGrowthWeek?: number;
  RevenueGrowthWeek?: number;
  revenueGrowthMonth?: number;
  RevenueGrowthMonth?: number;
  ordersGrowthWeek?: number;
  OrdersGrowthWeek?: number;
  ordersGrowthMonth?: number;
  OrdersGrowthMonth?: number;
  customersGrowthWeek?: number;
  CustomersGrowthWeek?: number;
  customersGrowthMonth?: number;
  CustomersGrowthMonth?: number;
  averageOrderValueGrowth?: number;
  AverageOrderValueGrowth?: number;
};

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  return 0;
};

const coalesce = <T>(...values: Array<T | undefined>): T | undefined => {
  for (const value of values) {
    if (value !== undefined && value !== null) {
      return value;
    }
  }

  return undefined;
};

const toBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
  }
  return false;
};

const normalizeDateString = (value?: string): string => {
  if (!value) {
    return new Date().toISOString();
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toISOString();
};

const extractDashboardPayload = (payload: unknown): RawDashboardResponse => {
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const nestedData = record.data;
    if (nestedData && typeof nestedData === 'object' && !Array.isArray(nestedData)) {
      return nestedData as RawDashboardResponse;
    }
  }

  return (payload ?? {}) as RawDashboardResponse;
};

const normalizeDashboardResponse = (data: RawDashboardResponse): DashboardAnalytics => {
  const rawRecentOrders = coalesce(data.recentOrders, data.RecentOrders) ?? [];
  const rawPendingOrders = coalesce(data.pendingOrders, data.PendingOrders) ?? [];
  const rawTopProducts = coalesce(data.topProducts, data.TopProducts) ?? [];
  const rawTopSellingProducts = coalesce(data.topSellingProducts, data.TopSellingProducts, rawTopProducts) ?? [];
  const rawTopRevenueProducts = coalesce(data.topRevenueProducts, data.TopRevenueProducts, rawTopSellingProducts) ?? [];
  const rawCategories = coalesce(data.topCategories, data.TopCategories) ?? [];
  const rawLowStock = coalesce(data.lowStockAlerts, data.LowStockAlerts) ?? [];
  const rawPaymentMethods = coalesce(data.paymentMethodStats, data.PaymentMethodStats) ?? [];
  const rawLast7Days = coalesce(data.last7DaysRevenue, data.Last7DaysRevenue) ?? [];
  const rawLast12Months = coalesce(data.last12MonthsRevenue, data.Last12MonthsRevenue) ?? [];
  const rawStatus = coalesce(data.orderStatusBreakdown, data.OrderStatusBreakdown) ?? {};
  const rawGrowth = coalesce(data.growthMetrics, data.GrowthMetrics) ?? {};

  const normalizeOrder = (order: RawDashboardOrder, index: number, prefix: string): DashboardRecentOrder => {
    const id =
      coalesce(order.id, order.Id, order.orderId, order.OrderId, order.orderNumber, order.OrderNumber) ??
      `${prefix}-${index}`;
    const paymentMethodRaw = coalesce(order.paymentMethod, order.PaymentMethod);

    return {
      id: String(id),
      orderNumber: String(coalesce(order.orderNumber, order.OrderNumber, id) ?? ''),
      customerName: String(coalesce(order.customerName, order.CustomerName, 'Naməlum müştəri')),
      customerEmail: coalesce(order.customerEmail, order.CustomerEmail),
      customerPhone: coalesce(order.customerPhone, order.CustomerPhone),
      totalAmount: toNumber(coalesce(order.totalAmount, order.TotalAmount, order.total, order.Total, 0)),
      status: String(coalesce(order.status, order.Status, 'pending')).toLowerCase(),
      createdAt: normalizeDateString(coalesce(order.createdAt, order.CreatedAt, order.createdOn, order.CreatedOn)),
      paymentMethod: paymentMethodRaw != null ? String(paymentMethodRaw) : undefined,
      itemCount: toNumber(coalesce(order.itemCount, order.ItemCount, 0)),
    };
  };

  const normalizeProduct = (product: RawDashboardProduct, index: number, prefix: string): DashboardTopProduct => {
    const id = coalesce(product.id, product.Id, product.productId, product.ProductId, product.name, product.Name) ?? `${prefix}-${index}`;
    const stockRaw = coalesce(product.currentStock, product.CurrentStock, product.stock, product.Stock);
    const priceRaw = coalesce(product.price, product.Price);
    return {
      id: String(id),
      name: String(coalesce(product.name, product.Name, product.productName, product.ProductName, 'Naməlum məhsul')),
      brand: coalesce(product.productBrand, product.ProductBrand, product.brand, product.Brand),
      categoryName: coalesce(product.categoryName, product.CategoryName),
      salesCount: toNumber(
        coalesce(product.salesCount, product.SalesCount, product.sales, product.Sales, product.totalSales, product.TotalSales, 0)
      ),
      revenue: toNumber(coalesce(product.revenue, product.Revenue, product.totalRevenue, product.TotalRevenue, 0)),
      imageUrl: coalesce(product.imageUrl, product.ImageUrl, product.image, product.Image),
      currentStock: stockRaw !== undefined ? toNumber(stockRaw) : undefined,
      price: priceRaw !== undefined ? toNumber(priceRaw) : undefined,
    };
  };

  const recentOrders = rawRecentOrders.map((order, index) => normalizeOrder(order, index, 'recent-order'));
  const pendingOrders = rawPendingOrders.map((order, index) => normalizeOrder(order, index, 'pending-order'));

  const baseTopProductsSource = rawTopProducts.length > 0 ? rawTopProducts : rawTopSellingProducts;
  const topProducts = baseTopProductsSource.map((product, index) => normalizeProduct(product, index, 'top-product'));
  const topSellingProducts = rawTopSellingProducts.map((product, index) => normalizeProduct(product, index, 'top-selling'));
  const topRevenueProducts = rawTopRevenueProducts.map((product, index) => normalizeProduct(product, index, 'top-revenue'));

  const topCategories: CategoryPerformance[] = rawCategories.map((category, index) => {
    const categoryId = coalesce(category.categoryId, category.CategoryId, index);
    return {
      categoryId: String(categoryId ?? index),
      categoryName: String(coalesce(category.categoryName, category.CategoryName, 'Naməlum kateqoriya')),
      productCount: toNumber(coalesce(category.productCount, category.ProductCount, 0)),
      totalSold: toNumber(coalesce(category.totalSold, category.TotalSold, 0)),
      revenue: toNumber(coalesce(category.revenue, category.Revenue, 0)),
      orderCount: toNumber(coalesce(category.orderCount, category.OrderCount, 0)),
    };
  });

  const lowStockAlerts: LowStockProduct[] = rawLowStock.map((product, index) => {
    const productId = coalesce(product.productId, product.ProductId, index);
    const stockValue = toNumber(coalesce(product.currentStock, product.CurrentStock, product.stock, product.Stock, 0));
    const explicitOutOfStock = coalesce(product.isOutOfStock, product.IsOutOfStock);

    return {
      productId: String(productId ?? index),
      productName: String(coalesce(product.productName, product.ProductName, 'Naməlum məhsul')),
      productBrand: coalesce(product.productBrand, product.ProductBrand, product.brand, product.Brand),
      currentStock: stockValue,
      isOutOfStock: explicitOutOfStock !== undefined ? toBoolean(explicitOutOfStock) : stockValue === 0,
      price: toNumber(coalesce(product.price, product.Price, 0)),
    };
  });

  const paymentMethodStats: PaymentMethodStats[] = rawPaymentMethods.map((method, index) => ({
    paymentMethod: String(coalesce(method.paymentMethod, method.PaymentMethod, `Metod ${index + 1}`)),
    orderCount: toNumber(coalesce(method.orderCount, method.OrderCount, 0)),
    totalRevenue: toNumber(coalesce(method.totalRevenue, method.TotalRevenue, 0)),
    percentage: toNumber(coalesce(method.percentage, method.Percentage, 0)),
  }));

  const last7DaysRevenue: DailyRevenue[] = rawLast7Days.map((entry) => {
    const dateValue = coalesce(entry.date, entry.Date) ?? new Date().toISOString();
    return {
      date: normalizeDateString(dateValue),
      revenue: toNumber(coalesce(entry.revenue, entry.Revenue, 0)),
      orderCount: toNumber(coalesce(entry.orderCount, entry.OrderCount, 0)),
    };
  });

  const last12MonthsRevenue: MonthlyRevenue[] = rawLast12Months.map((entry) => ({
    year: toNumber(coalesce(entry.year, entry.Year, 0)),
    month: toNumber(coalesce(entry.month, entry.Month, 0)),
    monthName: String(coalesce(entry.monthName, entry.MonthName, '')),
    revenue: toNumber(coalesce(entry.revenue, entry.Revenue, 0)),
    orderCount: toNumber(coalesce(entry.orderCount, entry.OrderCount, 0)),
  }));

  const orderStatusBreakdown: OrderStatusBreakdown = {
    pending: toNumber(coalesce(rawStatus.pending, rawStatus.Pending, 0)),
    processing: toNumber(coalesce(rawStatus.processing, rawStatus.Processing, 0)),
    shipped: toNumber(coalesce(rawStatus.shipped, rawStatus.Shipped, 0)),
    delivered: toNumber(coalesce(rawStatus.delivered, rawStatus.Delivered, 0)),
    cancelled: toNumber(coalesce(rawStatus.cancelled, rawStatus.Cancelled, 0)),
    pendingRevenue: toNumber(coalesce(rawStatus.pendingRevenue, rawStatus.PendingRevenue, 0)),
    processingRevenue: toNumber(coalesce(rawStatus.processingRevenue, rawStatus.ProcessingRevenue, 0)),
    shippedRevenue: toNumber(coalesce(rawStatus.shippedRevenue, rawStatus.ShippedRevenue, 0)),
    deliveredRevenue: toNumber(coalesce(rawStatus.deliveredRevenue, rawStatus.DeliveredRevenue, 0)),
    cancelledRevenue: toNumber(coalesce(rawStatus.cancelledRevenue, rawStatus.CancelledRevenue, 0)),
  };

  const growthMetrics: GrowthMetrics = {
    revenueGrowthWeek: toNumber(coalesce(rawGrowth.revenueGrowthWeek, rawGrowth.RevenueGrowthWeek, 0)),
    revenueGrowthMonth: toNumber(coalesce(rawGrowth.revenueGrowthMonth, rawGrowth.RevenueGrowthMonth, 0)),
    ordersGrowthWeek: toNumber(coalesce(rawGrowth.ordersGrowthWeek, rawGrowth.OrdersGrowthWeek, 0)),
    ordersGrowthMonth: toNumber(coalesce(rawGrowth.ordersGrowthMonth, rawGrowth.OrdersGrowthMonth, 0)),
    customersGrowthWeek: toNumber(coalesce(rawGrowth.customersGrowthWeek, rawGrowth.CustomersGrowthWeek, 0)),
    customersGrowthMonth: toNumber(coalesce(rawGrowth.customersGrowthMonth, rawGrowth.CustomersGrowthMonth, 0)),
    averageOrderValueGrowth: toNumber(coalesce(rawGrowth.averageOrderValueGrowth, rawGrowth.AverageOrderValueGrowth, 0)),
  };

  const normalizedTopSellingProducts = topSellingProducts.length > 0 ? topSellingProducts : topProducts;
  const normalizedTopRevenueProducts = topRevenueProducts.length > 0 ? topRevenueProducts : topProducts;

  return {
    totalRevenue: toNumber(coalesce(data.totalRevenue, data.TotalRevenue, 0)),
    todayRevenue: toNumber(coalesce(data.todayRevenue, data.TodayRevenue, 0)),
    weekRevenue: toNumber(coalesce(data.weekRevenue, data.WeekRevenue, 0)),
    monthRevenue: toNumber(coalesce(data.monthRevenue, data.MonthRevenue, 0)),
    yearRevenue: toNumber(coalesce(data.yearRevenue, data.YearRevenue, 0)),
    averageOrderValue: toNumber(coalesce(data.averageOrderValue, data.AverageOrderValue, 0)),
    totalOrders: toNumber(coalesce(data.totalOrders, data.TotalOrders, 0)),
    todayOrders: toNumber(coalesce(data.todayOrders, data.TodayOrders, 0)),
    weekOrders: toNumber(coalesce(data.weekOrders, data.WeekOrders, 0)),
    monthOrders: toNumber(coalesce(data.monthOrders, data.MonthOrders, 0)),
    yearOrders: toNumber(coalesce(data.yearOrders, data.YearOrders, 0)),
    orderStatusBreakdown,
    totalCustomers: toNumber(coalesce(data.totalCustomers, data.TotalCustomers, 0)),
    newCustomersToday: toNumber(coalesce(data.newCustomersToday, data.NewCustomersToday, 0)),
    newCustomersWeek: toNumber(coalesce(data.newCustomersWeek, data.NewCustomersWeek, 0)),
    newCustomersMonth: toNumber(coalesce(data.newCustomersMonth, data.NewCustomersMonth, 0)),
    returningCustomers: toNumber(coalesce(data.returningCustomers, data.ReturningCustomers, 0)),
    totalProducts: toNumber(coalesce(data.totalProducts, data.TotalProducts, 0)),
    activeProducts: toNumber(coalesce(data.activeProducts, data.ActiveProducts, 0)),
    inactiveProducts: toNumber(coalesce(data.inactiveProducts, data.InactiveProducts, 0)),
    outOfStockProducts: toNumber(coalesce(data.outOfStockProducts, data.OutOfStockProducts, 0)),
    lowStockProducts: toNumber(coalesce(data.lowStockProducts, data.LowStockProducts, 0)),
    featuredProducts: toNumber(coalesce(data.featuredProducts, data.FeaturedProducts, 0)),
    totalCategories: toNumber(coalesce(data.totalCategories, data.TotalCategories, 0)),
    topCategories,
    topProducts,
    topSellingProducts: normalizedTopSellingProducts,
    topRevenueProducts: normalizedTopRevenueProducts,
    lowStockAlerts,
    recentOrders,
    pendingOrders,
    paymentMethodStats,
    last7DaysRevenue,
    last12MonthsRevenue,
    growthMetrics,
  };
};

export const adminService = {
  // Admin login
  login: async (credentials: AdminLoginDTO): Promise<AdminLoginResponse> => {
    const response = await api.post('/auths/login', credentials) as unknown;

    const extractValue = <T = unknown>(payload: unknown, keys: string[]): T | undefined => {
      if (!payload || typeof payload !== 'object') {
        return undefined;
      }

      for (const key of keys) {
        if (key in payload && (payload as Record<string, T | undefined>)[key] != null) {
          return (payload as Record<string, T | undefined>)[key];
        }
      }

      return undefined;
    };

    const responseObject = (response && typeof response === 'object' ? response : {}) as Record<string, unknown>;
    const nestedData = extractValue<Record<string, unknown>>(responseObject, ['data']);

    const toStringValue = (value: unknown): string | undefined => {
      if (value === undefined || value === null) {
        return undefined;
      }
      if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
      }
      if (value instanceof Date) {
        return value.toISOString();
      }
      return String(value);
    };

    const toNumberValue = (value: unknown): number | undefined => {
      if (value === undefined || value === null) {
        return undefined;
      }
      if (typeof value === 'number') {
        return Number.isNaN(value) ? undefined : value;
      }
      const parsed = Number(value);
      return Number.isNaN(parsed) ? undefined : parsed;
    };

    const toStringArray = (value: unknown): string[] | undefined => {
      if (!value) {
        return undefined;
      }
      if (Array.isArray(value)) {
        const normalized = value
          .map((item) => toStringValue(item))
          .filter((item): item is string => Boolean(item));
        return normalized.length > 0 ? normalized : undefined;
      }
      const single = toStringValue(value);
      return single ? [single] : undefined;
    };

    const token =
      toStringValue(extractValue(responseObject, ['token', 'accessToken', 'access_token', 'jwt', 'jwtToken'])) ??
      toStringValue(extractValue(nestedData, ['token', 'accessToken', 'access_token', 'jwt', 'jwtToken']));

    const refreshToken =
      toStringValue(extractValue(responseObject, ['refreshToken', 'refresh_token'])) ??
      toStringValue(extractValue(nestedData, ['refreshToken', 'refresh_token']));

    const adminSource =
      extractValue<Record<string, unknown>>(responseObject, ['admin', 'user', 'profile']) ??
      extractValue<Record<string, unknown>>(nestedData, ['admin', 'user', 'profile']) ??
      {};

    const resolveName = (): string => {
      const name = toStringValue(extractValue(adminSource, ['name', 'fullName', 'displayName']));
      if (name) {
        return name;
      }

      const first = toStringValue(extractValue(adminSource, ['firstName']));
      const last = toStringValue(extractValue(adminSource, ['lastName']));
      if (first || last) {
        return [first, last].filter(Boolean).join(' ').trim();
      }
      return credentials.email;
    };

    const rawId = extractValue(adminSource, ['id', 'adminId', 'userId']);
    const id = toStringValue(rawId) ?? credentials.email;

    const rawEmail = extractValue(adminSource, ['email', 'username']);
    const email = toStringValue(rawEmail) ?? credentials.email;

    const rawAvatar = extractValue(adminSource, ['avatar', 'image', 'imageUrl', 'profileImage', 'photoUrl']);
    const avatar = toStringValue(rawAvatar);

    const rawPermissions = extractValue(adminSource, ['permissions', 'roles', 'claims']);
    const permissions = toStringArray(rawPermissions);

    const rawLastLogin = extractValue(adminSource, ['lastLogin', 'lastLoginAt', 'lastActiveAt']);
    let lastLogin = toStringValue(rawLastLogin);
    if (rawLastLogin && lastLogin) {
      const parsed = new Date(lastLogin);
      if (!Number.isNaN(parsed.getTime())) {
        lastLogin = parsed.toISOString();
      }
    }
    if (!lastLogin) {
      lastLogin = new Date().toISOString();
    }

    const role = toStringValue(extractValue(adminSource, ['role', 'userRole', 'type'])) ?? 'admin';

    const admin: AdminUser = {
      id,
      email,
      name: resolveName(),
      avatar: avatar ?? undefined,
      role,
      permissions,
      lastLogin,
    };

    if (!token) {
      throw new Error('Server auth token tapılmadı');
    }

    localStorage.setItem('admin-token', token);

    const expiresIn =
      toNumberValue(extractValue(responseObject, ['expiresIn', 'expires_in'])) ??
      toNumberValue(extractValue(nestedData, ['expiresIn', 'expires_in']));

    const normalizedResponse: AdminLoginResponse = {
      token: token ?? '',
      refreshToken,
      admin,
    };

    if (expiresIn !== undefined) {
      normalizedResponse.expiresIn = expiresIn;
    }

    return normalizedResponse;
  },

  // Admin logout
  logout: () => {
    localStorage.removeItem('admin-token');
  },

  // Check if admin is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('admin-token');
  },

  // Get dashboard analytics
  getDashboard: async (): Promise<DashboardAnalytics> => {
    const response = await api.get<RawDashboardResponse>('/analyticses/dashboard');
    return normalizeDashboardResponse(extractDashboardPayload(response));
  },
};
