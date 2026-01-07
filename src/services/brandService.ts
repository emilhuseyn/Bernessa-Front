import api from './api';
import type { Brand, CreateBrandDTO, UpdateBrandDTO } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5034/api';

export const brandService = {
  // Get all brands
  async getAll(): Promise<Brand[]> {
    try {
      const response = await api.get<Brand[]>('/brandses');
      return response as unknown as Brand[];
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  },

  // Get brand by ID
  async getById(id: number): Promise<Brand> {
    try {
      const response = await api.get<Brand>(`/brandses/${id}`);
      return response as unknown as Brand;
    } catch (error) {
      console.error(`Error fetching brand ${id}:`, error);
      throw error;
    }
  },

  // Create brand
  async create(data: CreateBrandDTO): Promise<Brand> {
    try {
      const formData = new FormData();
      formData.append('Name', data.name);
      
      if (data.logo) {
        formData.append('Logo', data.logo);
      }

      const response = await api.post<Brand>('/brandses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response as unknown as Brand;
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  },

  // Update brand
  async update(id: number, data: UpdateBrandDTO): Promise<Brand> {
    try {
      const formData = new FormData();
      formData.append('Name', data.name);
      
      if (data.logo) {
        formData.append('Logo', data.logo);
      }

      const response = await api.put<Brand>(`/brandses/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response as unknown as Brand;
    } catch (error) {
      console.error(`Error updating brand ${id}:`, error);
      throw error;
    }
  },

  // Delete brand
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/brandses/${id}`);
    } catch (error) {
      console.error(`Error deleting brand ${id}:`, error);
      throw error;
    }
  },
};
