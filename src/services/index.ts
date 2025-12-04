import { categoryService } from './categoryService';
import { productService } from './productService';
import { orderService } from './orderService';
import { adminService } from './adminService';

// Export all services
export {
  categoryService,
  productService,
  orderService,
  adminService,
};

// Export types
export type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from './categoryService';

export type {
  CreateProductDTO,
  UpdateProductDTO,
  ProductFilterParams,
} from './productService';

export type {
  CreateOrderDTO,
  OrderSummary,
  OrderItemSummary,
  PaymentMethod,
  UpdateOrderStatusDTO,
} from './orderService';

export type {
  AdminLoginDTO,
  AdminLoginResponse,
  DashboardAnalytics,
  DashboardRecentOrder,
  DashboardTopProduct,
  OrderStatusBreakdown,
  CategoryPerformance,
  LowStockProduct,
  PaymentMethodStats,
  DailyRevenue,
  MonthlyRevenue,
  GrowthMetrics,
} from './adminService';
