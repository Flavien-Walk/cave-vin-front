import { create } from 'zustand';
import { wishlistApi } from '../api';
import type { WishlistItem, CreateWishlistItemDto } from '../types';

interface WishlistStore {
  items: WishlistItem[];
  isLoading: boolean;

  fetchItems: () => Promise<void>;
  addItem: (data: CreateWishlistItemDto) => Promise<void>;
  updateItem: (id: string, data: Partial<CreateWishlistItemDto>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  markPurchased: (id: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>((set) => ({
  items: [],
  isLoading: false,

  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const res = await wishlistApi.getAll();
      set({ items: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (data) => {
    const res = await wishlistApi.create(data);
    set((state) => ({ items: [res.data.item, ...state.items] }));
  },

  updateItem: async (id, data) => {
    const res = await wishlistApi.update(id, data);
    set((state) => ({
      items: state.items.map((i) => (i._id === id ? res.data.item : i)),
    }));
  },

  deleteItem: async (id) => {
    await wishlistApi.delete(id);
    set((state) => ({ items: state.items.filter((i) => i._id !== id) }));
  },

  markPurchased: async (id) => {
    const res = await wishlistApi.markPurchased(id);
    set((state) => ({
      items: state.items.map((i) => (i._id === id ? res.data.item : i)),
    }));
  },
}));
