import { categoryService } from './categoryService';
import { productService } from './productService';
import { orderService } from './orderService';
import { adminService } from './adminService';
import { brandService } from './brandService';
import { contactSettingService } from './contactSettingService';

// Export all services
export {
  categoryService,
  productService,
  orderService,
  adminService,
  brandService,
  contactSettingService,
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
  ProductVariantDTO,
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
  PaymentMethodStats,
  DailyRevenue,
  MonthlyRevenue,
  GrowthMetrics,
} from './adminService';
