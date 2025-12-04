import { create } from 'zustand';

interface AuthStore {
  isAuthenticated: boolean;
}

// Placeholder store kept for backwards compatibility. Customer login is disabled,
// so this store always reports an unauthenticated state.
export const useAuthStore = create<AuthStore>(() => ({
  isAuthenticated: false,
}));
