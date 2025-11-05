import { create } from 'zustand';

interface WalletPageState {
  activeTab: string;
  showLoginModal: boolean;
  isLoading: boolean;
  error: string | null;
  setActiveTab: (tab: string) => void;
  setShowLoginModal: (show: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useWalletPageStore = create<WalletPageState>((set) => ({
  activeTab: 'tokens',
  showLoginModal: false,
  isLoading: true,
  error: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setShowLoginModal: (show) => set({ showLoginModal: show }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
})); 