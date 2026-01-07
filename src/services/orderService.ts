import api from './api';

const ORDER_ENDPOINT_CANDIDATES = ['/orderses', '/Orderses', '/orders', '/Orders'];

type RawOrderItem = {
  id?: string | number;
  Id?: string | number;
  productId?: string | number;
  ProductId?: string | number;
  productName?: string;
  ProductName?: string;
  productBrand?: string;
  ProductBrand?: string;
  productVolume?: string;
  ProductVolume?: string;
  variantVolume?: string;
  VariantVolume?: string;
  name?: string;
  Name?: string;
  quantity?: number;
  Quantity?: number;
  unitPrice?: number;
  UnitPrice?: number;
  price?: number;
  Price?: number;
  imageUrl?: string;
  ImageUrl?: string;
  image?: string;
  Image?: string;
  productImage?: string;
  ProductImage?: string;
};

type RawOrder = {
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
  shippingAddress?: string;
  ShippingAddress?: string;
  customerNote?: string;
  CustomerNote?: string;
  status?: string;
  Status?: string;
  paymentMethod?: string | number;
  PaymentMethod?: string | number;
  totalAmount?: number;
  TotalAmount?: number;
  total?: number;
  Total?: number;
  subtotal?: number;
  Subtotal?: number;
  tax?: number;
  Tax?: number;
  discount?: number;
  Discount?: number;
  createdAt?: string;
  CreatedAt?: string;
  createdOn?: string;
  CreatedOn?: string;
  deliveredAt?: string | null;
  DeliveredAt?: string | null;
  items?: RawOrderItem[];
  Items?: RawOrderItem[];
};

const coalesce = <T>(...values: Array<T | undefined | null>): T | undefined => {
  for (const value of values) {
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return undefined;
};

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

const resolveMediaUrl = (value?: string) => {
  if (!value) {
    return undefined;
  }
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5034/api';
  const normalizedBase = base.replace(/\/?api\/?$/i, '');
  const normalizedValue = value.replace(/^\/+/, '');
  return `${normalizedBase}/${normalizedValue}`;
};

const normalizeOrderItem = (raw: RawOrderItem, fallbackIndex: number) => {
  const id = coalesce(raw.id, raw.Id, raw.productId, raw.ProductId, fallbackIndex);
  const productId = coalesce(raw.productId, raw.ProductId, raw.id, raw.Id);
  const quantity = toNumber(coalesce(raw.quantity, raw.Quantity)) ?? 1;
  const price = toNumber(coalesce(raw.price, raw.Price, raw.unitPrice, raw.UnitPrice));
  const volume = coalesce(raw.productVolume, raw.ProductVolume, raw.variantVolume, raw.VariantVolume);
  
  return {
    id: String(id ?? fallbackIndex),
    productId: productId != null ? String(productId) : undefined,
    name: coalesce(raw.productName, raw.ProductName, raw.name, raw.Name),
    quantity,
    price,
    volume,
    imageUrl: resolveMediaUrl(
      coalesce(raw.productImage, raw.ProductImage, raw.imageUrl, raw.ImageUrl, raw.image, raw.Image)
    ),
  };
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  '0': 'Qapıda ödəniş',
  '1': 'Kartla ödəniş',
  '2': 'Bank köçürməsi',
  Cash: 'Qapıda ödəniş',
  Card: 'Kartla ödəniş',
  BankTransfer: 'Bank köçürməsi',
};

const normalizePaymentMethod = (value: string | number | undefined) => {
  if (value == null) {
    return 'Bilinmir';
  }
  const key = String(value).trim();
  if (!key) {
    return 'Bilinmir';
  }
  return PAYMENT_METHOD_LABELS[key] ?? key;
};

const STATUS_LABELS: Record<string, string> = {
  '0': 'pending',
  '1': 'processing',
  '2': 'shipped',
  '3': 'delivered',
  '4': 'cancelled',
  Pending: 'pending',
  pending: 'pending',
  Processing: 'processing',
  processing: 'processing',
  Shipped: 'shipped',
  shipped: 'shipped',
  Delivered: 'delivered',
  delivered: 'delivered',
  Cancelled: 'cancelled',
  cancelled: 'cancelled',
};

export interface OrderItemSummary {
  id: string;
  productId?: string;
  name?: string;
  quantity: number;
  price?: number;
  imageUrl?: string;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  customerNote?: string;
  status?: string;
  paymentMethod?: string;
  totalAmount?: number;
  subtotal?: number;
  tax?: number;
  discount?: number;
  createdAt?: string;
  deliveredAt?: string | null;
  items: OrderItemSummary[];
}

const normalizeOrder = (raw: RawOrder): OrderSummary => {
  const id = coalesce(raw.id, raw.Id, raw.orderId, raw.OrderId, '') ?? '';
  const itemsRaw = coalesce(raw.items, raw.Items) ?? [];
  const items = itemsRaw.map((item, index) => normalizeOrderItem(item, index));

  return {
    id: String(id),
    orderNumber: coalesce(raw.orderNumber, raw.OrderNumber, String(id)) ?? String(id),
    customerName: coalesce(raw.customerName, raw.CustomerName, 'Müştəri') ?? 'Müştəri',
    customerEmail: coalesce(raw.customerEmail, raw.CustomerEmail),
    customerPhone: coalesce(raw.customerPhone, raw.CustomerPhone),
    shippingAddress: coalesce(raw.shippingAddress, raw.ShippingAddress),
    customerNote: coalesce(raw.customerNote, raw.CustomerNote),
    status: (() => {
      const rawStatus = coalesce(raw.status, raw.Status);
      if (rawStatus == null) {
        return undefined;
      }
      const normalized = STATUS_LABELS[String(rawStatus)] ?? STATUS_LABELS[String(rawStatus).toLowerCase()] ?? undefined;
      return normalized ?? String(rawStatus);
    })(),
    paymentMethod: normalizePaymentMethod(coalesce(raw.paymentMethod, raw.PaymentMethod)),
    totalAmount: toNumber(coalesce(raw.totalAmount, raw.TotalAmount, raw.total, raw.Total)),
    subtotal: toNumber(coalesce(raw.subtotal, raw.Subtotal)),
    tax: toNumber(coalesce(raw.tax, raw.Tax)),
    discount: toNumber(coalesce(raw.discount, raw.Discount)),
    createdAt: coalesce(raw.createdAt, raw.CreatedAt, raw.createdOn, raw.CreatedOn),
    deliveredAt: coalesce(raw.deliveredAt, raw.DeliveredAt) ?? null,
    items,
  };
};

const requestOrderEndpoint = async <T>(
  path: string,
  requester: (url: string) => Promise<T>
): Promise<T> => {
  let lastError: unknown;
  for (const candidate of ORDER_ENDPOINT_CANDIDATES) {
    try {
      const base = candidate.endsWith('/') ? candidate.slice(0, -1) : candidate;
      const suffix = path.startsWith('/') ? path : `/${path}`;
      const url = `${base}${suffix === '/' ? '' : suffix}`;
      return await requester(url);
    } catch (error: any) {
      lastError = error;
      if (error?.status === 404) {
        continue;
      }
      throw error;
    }
  }
  throw lastError ?? new Error('Order endpoint not found');
};

export type PaymentMethod = 0 | 1 | 2;

export interface CreateOrderDTO {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  customerNote?: string;
  items: Array<{ productId: number; quantity: number; volume?: string }>;
  paymentMethod: PaymentMethod;
  discountCode?: string;
}

export interface UpdateOrderStatusDTO {
  status: string | number;
}

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
        VariantVolume: item.volume,
      })),
    };

    const response = await requestOrderEndpoint('', (url) =>
      api.post<RawOrder, RawOrder>(url, payload)
    );
    return normalizeOrder(response);
  },

  getById: async (id: string | number): Promise<OrderSummary> => {
    const response = await requestOrderEndpoint(`/${id}`, (url) =>
      api.get<RawOrder, RawOrder>(url)
    );
    return normalizeOrder(response);
  },

  getByOrderNumber: async (orderNumber: string): Promise<OrderSummary> => {
    const response = await requestOrderEndpoint(`/track/${orderNumber}`, (url) =>
      api.get<RawOrder, RawOrder>(url)
    );
    return normalizeOrder(response);
  },

  getAllAdmin: async (status?: string): Promise<OrderSummary[]> => {
    const config = status ? { params: { status } } : undefined;
    const response = await requestOrderEndpoint('', (url) =>
      api.get<RawOrder[], RawOrder[]>(url, config)
    );
    if (!Array.isArray(response)) {
      return [];
    }
    return response.map((item) => normalizeOrder(item));
  },

  updateStatus: async (id: string | number, data: UpdateOrderStatusDTO): Promise<OrderSummary> => {
    const response = await requestOrderEndpoint(`/${id}/status`, (url) =>
      api.put<RawOrder, RawOrder>(url, data)
    );
    return normalizeOrder(response);
  },

  getStats: async (): Promise<{
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  }> => {
    return api.get<
      {
        totalOrders: number;
        pendingOrders: number;
        totalRevenue: number;
        averageOrderValue: number;
      },
      {
        totalOrders: number;
        pendingOrders: number;
        totalRevenue: number;
        averageOrderValue: number;
      }
    >('/admin/orders/stats');
  },
};
