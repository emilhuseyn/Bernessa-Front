import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminService } from '../services';
import type { AdminUser } from '../types';

interface AdminStore {
  admin: AdminUser | null;
  isAdminAuthenticated: boolean;
  isInitialized: boolean;
  sidebarOpen: boolean;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  restoreSession: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      admin: null,
      isAdminAuthenticated: false,
      isInitialized: false,
      sidebarOpen: true,

      adminLogin: async (email: string, password: string) => {
        const response = await adminService.login({ email, password });
        const normalizedAdmin: AdminUser = {
          ...response.admin,
          permissions: response.admin.permissions ?? ['all'],
          lastLogin: response.admin.lastLogin ?? new Date().toISOString(),
        };

        set({
          admin: normalizedAdmin,
          isAdminAuthenticated: true,
          isInitialized: true,
        });
      },

      adminLogout: () => {
        adminService.logout();
        set({ admin: null, isAdminAuthenticated: false, isInitialized: true });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      restoreSession: () => {
        const tokenPresent = adminService.isAuthenticated();
        const currentAdmin = get().admin;

        if (!tokenPresent) {
          set({ admin: null, isAdminAuthenticated: false, isInitialized: true });
          return;
        }

        set({
          isAdminAuthenticated: !!currentAdmin,
          isInitialized: true,
        });
      },
    }),
    {
      name: 'admin-storage',
      partialize: ({ admin, isAdminAuthenticated, sidebarOpen }) => ({
        admin,
        isAdminAuthenticated,
        sidebarOpen,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          state?.adminLogout?.();
          return;
        }

        Promise.resolve().then(() => {
          state?.restoreSession?.();
        });
      },
    }
  )
);
