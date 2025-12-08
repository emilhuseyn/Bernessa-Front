import api from './api';
import type { Category } from '../types';

// Normalize category data from API
const normalizeCategory = (raw: any): Category => {
  return {
    id: raw.id || raw._id,
    name: raw.name,
    nameEn: raw.nameEn || raw.NameEn || raw.name_en || raw.translations?.en,
    nameRu: raw.nameRu || raw.NameRu || raw.name_ru || raw.translations?.ru,
    slug: raw.slug,
    image: raw.image || raw.imageUrl || '',
    imageUrl: raw.imageUrl || raw.image,
    productCount: raw.productCount || 0,
    translations: raw.translations
  };
};

export interface CreateCategoryDTO {
  name: string;
  slug: string;
  image?: File;
  nameEn?: string;
  nameRu?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  slug?: string;
  image?: File;
  nameEn?: string;
  nameRu?: string;
}

export const categoryService = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    const data = await api.get('/categorieses');
    return Array.isArray(data) ? data.map(normalizeCategory) : [];
  },

  // Get category by ID
  getById: async (id: string): Promise<Category> => {
    const data = await api.get(`/categorieses/${id}`);
    return normalizeCategory(data);
  },

  // Get category by slug
  getBySlug: async (slug: string): Promise<Category> => {
    const data = await api.get(`/categorieses/slug/${slug}`);
    return normalizeCategory(data);
  },

  // Create category (Admin only)
  create: async (data: CreateCategoryDTO): Promise<Category> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slug', data.slug);
    if (data.image) {
      formData.append('image', data.image);
    }
    if (data.nameEn) {
      formData.append('NameEn', data.nameEn);
    }
    if (data.nameRu) {
      formData.append('NameRu', data.nameRu);
    }
    
    const result = await api.post('/categorieses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return normalizeCategory(result);
  },

  // Update category (Admin only)
  update: async (id: string, data: UpdateCategoryDTO): Promise<Category> => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.slug) formData.append('slug', data.slug);
    if (data.image) {
      formData.append('image', data.image);
    }
    if (data.nameEn) {
      formData.append('NameEn', data.nameEn);
    }
    if (data.nameRu) {
      formData.append('NameRu', data.nameRu);
    }
    
    const result = await api.put(`/categorieses/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return normalizeCategory(result);
  },

  // Delete category (Admin only)
  delete: async (id: string): Promise<void> => {
    return api.delete(`/categorieses/${id}`);
  },
};
