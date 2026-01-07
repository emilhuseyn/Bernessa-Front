import api from './api';
import type { Product } from '../types';

export interface ProductVariantDTO {
  volume: string;
  price: number;
  originalPrice?: number;
  isActive?: boolean;
}

export interface CreateProductDTO {
  name: string;
  brandId: number;
  type: string;
  description: string;
  categoryId: number;
  isActive?: boolean;
  isFeatured?: boolean;
  images?: File[];
  variants: ProductVariantDTO[];
  nameEn?: string;
  nameRu?: string;
  typeEn?: string;
  typeRu?: string;
  descriptionEn?: string;
  descriptionRu?: string;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  images?: File[];
}

export interface ProductFilterParams {
  categoryId?: number;
  brand?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'name';
  page?: number;
  pageSize?: number;
  includeInactive?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5034/api';
const MEDIA_BASE_URL = API_BASE_URL.replace(/\/?api\/?$/, '');
const FALLBACK_IMAGE = 'https://via.placeholder.com/600x800?text=M%C9%99hsul';
const PRODUCT_ENDPOINT_CANDIDATES = ['/productses', '/Productses', '/products', '/Products'];

const sanitizeRelativePath = (value: string): string => {
  return value
    .replace(/\\/g, '/')
    .replace(/\/{2,}/g, '/')
    .replace(/^\/+/, '');
};

const extractMediaPath = (value: unknown): string | null => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const candidate = record.url ?? record.imageUrl ?? record.path ?? record.filePath ?? record.src;
    return typeof candidate === 'string' ? candidate : null;
  }
  return null;
};

const resolveMediaUrl = (path: string): string => {
  if (!path) return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = sanitizeRelativePath(path);
  if (!normalized) {
    return FALLBACK_IMAGE;
  }
  return `${MEDIA_BASE_URL}/${normalized}`;
};

const coalesceValue = <T>(...values: Array<T | null | undefined>): T | undefined => {
  for (const value of values) {
    if (value !== null && value !== undefined) {
      return value;
    }
  }
  return undefined;
};

const normalizeProduct = (raw: any): Product => {
  if (!raw) {
    return {
      id: '',
      name: '',
      description: '',
      price: 0,
      images: [FALLBACK_IMAGE],
      category: '',
    };
  }

  const id = raw.id != null ? String(raw.id) : String(raw.slug ?? raw.name ?? Date.now());
  const rawImages: string[] = [];

  if (Array.isArray(raw.images)) {
    raw.images.forEach((item: unknown) => {
      const path = extractMediaPath(item);
      if (path) {
        rawImages.push(path);
      }
    });
  }

  if (!rawImages.length && Array.isArray(raw.imageUrls)) {
    raw.imageUrls.forEach((item: unknown) => {
      const path = extractMediaPath(item);
      if (path) {
        rawImages.push(path);
      }
    });
  }

  if (!rawImages.length) {
    const singleImage = extractMediaPath(raw.image) || extractMediaPath(raw.primaryImage);
    if (singleImage) {
      rawImages.push(singleImage);
    }
  }

  const resolvedImages = rawImages.length
    ? rawImages.map((img) => resolveMediaUrl(img))
    : [FALLBACK_IMAGE];
  const originalPriceValue = raw.originalPrice != null ? Number(raw.originalPrice) : undefined;
  const rawCategoryId = coalesceValue(
    raw.categoryId,
    raw.CategoryId,
    raw.categoryID,
    raw.CategoryID,
    raw.category_id,
    raw.category?.id,
    raw.Category?.Id,
    raw.Category?.ID,
    raw.Category?.id
  );
  const categoryName = coalesceValue(
    raw.categoryName,
    raw.category,
    raw.CategoryName,
    raw.Category?.name,
    raw.category?.name
  );

  // Handle variants - normalize to match frontend structure
  const variants = Array.isArray(raw.variants) 
    ? raw.variants.map((v: any) => ({
        id: v.id,
        volume: v.volume || '',
        price: Number(v.price) || 0,
        originalPrice: v.originalPrice != null ? Number(v.originalPrice) : undefined,
        isActive: typeof v.isActive === 'boolean' ? v.isActive : true,
      }))
    : undefined;

  // For backward compatibility, if no variants but has price/volume, use those
  const price = variants && variants.length > 0 
    ? variants[0].price 
    : (raw.price != null ? Number(raw.price) : 0);
  
  const originalPrice = variants && variants.length > 0
    ? variants[0].originalPrice
    : originalPriceValue;

  const volume = variants && variants.length > 0
    ? variants[0].volume
    : (raw.volume || undefined);

  return {
    id,
    name: raw.name ?? '',
    description: raw.description ?? '',
    price,
    originalPrice,
    images: resolvedImages,
    imageUrls: Array.isArray(raw.imageUrls)
      ? (raw.imageUrls as unknown[])
          .map((img) => extractMediaPath(img))
          .filter((img): img is string => Boolean(img))
          .map((img) => resolveMediaUrl(img))
      : resolvedImages,
    category: categoryName ?? '',
    categoryId: rawCategoryId != null ? String(rawCategoryId) : undefined,
    categoryName: categoryName ?? undefined,
    volume,
    brand: raw.brandName || raw.brand || undefined,
    brandId: raw.brandId || undefined,
    brandName: raw.brandName || undefined,
    type: raw.type || undefined,
    tags: Array.isArray(raw.tags) ? raw.tags : undefined,
    isActive: typeof raw.isActive === 'boolean' ? raw.isActive : undefined,
    isFeatured: typeof raw.isFeatured === 'boolean' ? raw.isFeatured : undefined,
    createdAt: raw.createdAt || raw.createdOn || undefined,
    updatedAt: raw.updatedAt || raw.updatedOn || undefined,
    variants,
    translations: raw.translations ? {
      en: raw.translations.en || raw.translations.En || raw.translations.EN || (raw.nameEn ? {
        name: raw.nameEn,
        type: raw.typeEn,
        description: raw.descriptionEn
      } : undefined),
      ru: raw.translations.ru || raw.translations.Ru || raw.translations.RU || (raw.nameRu ? {
        name: raw.nameRu,
        type: raw.typeRu,
        description: raw.descriptionRu
      } : undefined)
    } : (raw.nameEn || raw.nameRu ? {
      en: raw.nameEn ? {
        name: raw.nameEn,
        type: raw.typeEn,
        description: raw.descriptionEn
      } : undefined,
      ru: raw.nameRu ? {
        name: raw.nameRu,
        type: raw.typeRu,
        description: raw.descriptionRu
      } : undefined
    } : undefined),
  };
};

const buildProductFormData = (data: Partial<CreateProductDTO>) => {
  const formData = new FormData();
  const appendIfDefined = (key: string, value: unknown) => {
    if (value === undefined || value === null) return;
    if (value instanceof Blob) {
      formData.append(key, value);
      return;
    }
    formData.append(key, String(value));
  };

  appendIfDefined('Name', data.name);
  appendIfDefined('BrandId', data.brandId);
  appendIfDefined('Type', data.type);
  appendIfDefined('Description', data.description);
  appendIfDefined('CategoryId', data.categoryId);
  if (typeof data.isActive === 'boolean') {
    appendIfDefined('IsActive', data.isActive);
  }
  if (typeof data.isFeatured === 'boolean') {
    appendIfDefined('IsFeatured', data.isFeatured);
  }

  // Add translation fields
  appendIfDefined('NameEn', data.nameEn);
  appendIfDefined('NameRu', data.nameRu);
  appendIfDefined('TypeEn', data.typeEn);
  appendIfDefined('TypeRu', data.typeRu);
  appendIfDefined('DescriptionEn', data.descriptionEn);
  appendIfDefined('DescriptionRu', data.descriptionRu);

  // Add variants
  if (Array.isArray(data.variants)) {
    data.variants.forEach((variant, index) => {
      appendIfDefined(`Variants[${index}].Volume`, variant.volume);
      appendIfDefined(`Variants[${index}].Price`, variant.price);
      if (variant.originalPrice !== undefined) {
        appendIfDefined(`Variants[${index}].OriginalPrice`, variant.originalPrice);
      }
      if (typeof variant.isActive === 'boolean') {
        appendIfDefined(`Variants[${index}].IsActive`, variant.isActive);
      }
    });
  }

  if (Array.isArray(data.images)) {
    data.images.forEach((file) => {
      if (file) {
        formData.append('Images', file);
      }
    });
  }

  return formData;
};

const withNormalizedList = (response: any): Product[] => {
  const extractArray = (payload: any): unknown[] | null => {
    if (Array.isArray(payload)) {
      return payload;
    }
    if (payload && typeof payload === 'object') {
      const candidates = [payload.items, payload.data, payload.results, payload.products];
      for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
          return candidate;
        }
      }
    }
    return null;
  };

  const array = extractArray(response);
  if (!array) {
    return [];
  }

  return array.map((item) => normalizeProduct(item));
};

const requestProductEndpoint = async <T>(
  pathSuffix: string,
  requester: (url: string) => Promise<T>
): Promise<T> => {
  let lastError: any;

  for (const base of PRODUCT_ENDPOINT_CANDIDATES) {
    try {
      const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
      const normalizedSuffix = pathSuffix.startsWith('/') ? pathSuffix : `/${pathSuffix}`;
      const url = `${normalizedBase}${normalizedSuffix === '/' ? '' : normalizedSuffix}`;
      return await requester(url);
    } catch (error: any) {
      if (error?.status === 404) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error('Product endpoint not found');
};

export const productService = {
  getAll: async (params?: ProductFilterParams): Promise<Product[]> => {
    const data = await requestProductEndpoint('', (url) => api.get(url, { params }));
    return withNormalizedList(data);
  },

  getById: async (id: string): Promise<Product> => {
    const data = await requestProductEndpoint(`/${id}`, (url) => api.get(url));
    return normalizeProduct(data);
  },

  getBySlug: async (slug: string): Promise<Product> => {
    const data = await requestProductEndpoint(`/slug/${slug}`, (url) => api.get(url));
    return normalizeProduct(data);
  },

  getFeatured: async (): Promise<Product[]> => {
    const data = await requestProductEndpoint('/featured', (url) => api.get(url));
    return withNormalizedList(data);
  },

  getDeals: async (): Promise<Product[]> => {
    const data = await requestProductEndpoint('/deals', (url) => api.get(url));
    return withNormalizedList(data);
  },

  search: async (query: string): Promise<Product[]> => {
    const data = await requestProductEndpoint('/search', (url) =>
      api.get(url, { params: { q: query } })
    );
    return withNormalizedList(data);
  },

  getByCategory: async (categoryId: string | number): Promise<Product[]> => {
    const identifier = String(categoryId);
    const data = await requestProductEndpoint(`/category/${identifier}`, (url) => api.get(url));
    return withNormalizedList(data);
  },

  getRelated: async (productId: string | number, limit: number = 8): Promise<Product[]> => {
    const identifier = String(productId);
    const data = await requestProductEndpoint(`/${identifier}/related`, (url) =>
      api.get(url, { params: { limit } })
    );
    return withNormalizedList(data);
  },

  create: async (data: CreateProductDTO): Promise<Product> => {
    const formData = buildProductFormData(data);
    const response = await requestProductEndpoint('', (url) =>
      api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
    return normalizeProduct(response);
  },

  update: async (id: string, data: UpdateProductDTO): Promise<Product> => {
    const formData = buildProductFormData(data);
    const response = await requestProductEndpoint(`/${id}`, (url) =>
      api.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
    return normalizeProduct(response);
  },

  delete: async (id: string): Promise<void> => {
    await requestProductEndpoint(`/${id}`, (url) => api.delete(url));
  },
};
