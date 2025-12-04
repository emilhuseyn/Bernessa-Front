import api from './api';
import type { Category } from '../types';

export interface CreateCategoryDTO {
  name: string;
  slug: string;
  image?: File;
}

export interface UpdateCategoryDTO {
  name?: string;
  slug?: string;
  image?: File;
}

export const categoryService = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    return api.get('/categorieses');
  },

  // Get category by ID
  getById: async (id: string): Promise<Category> => {
    return api.get(`/categorieses/${id}`);
  },

  // Get category by slug
  getBySlug: async (slug: string): Promise<Category> => {
    return api.get(`/categorieses/slug/${slug}`);
  },

  // Create category (Admin only)
  create: async (data: CreateCategoryDTO): Promise<Category> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slug', data.slug);
    if (data.image) {
      formData.append('image', data.image);
    }
    
    return api.post('/categorieses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update category (Admin only)
  update: async (id: string, data: UpdateCategoryDTO): Promise<Category> => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.slug) formData.append('slug', data.slug);
    if (data.image) {
      formData.append('image', data.image);
    }
    
    return api.put(`/categorieses/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete category (Admin only)
  delete: async (id: string): Promise<void> => {
    return api.delete(`/categorieses/${id}`);
  },
};
