import { create } from 'zustand';
import { bottlesApi } from '../api';
import type { Bottle, CreateBottleDto, UpdateBottleDto, CaveStats } from '../types';

interface BottleStore {
  bottles: Bottle[];
  stats: CaveStats | null;
  isLoading: boolean;
  isStatsLoading: boolean;
  error: string | null;

  // Actions
  fetchBottles: () => Promise<void>;
  addBottle: (data: CreateBottleDto) => Promise<Bottle>;
  updateBottle: (id: string, data: UpdateBottleDto) => Promise<void>;
  deleteBottle: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  drinkBottle: (id: string, quantity?: number, comment?: string, note?: number) => Promise<void>;

  // Selectors
  getFavorites: () => Bottle[];
  getUrgent: () => Bottle[];
  getByColor: (color: string) => Bottle[];
}

export const useBottleStore = create<BottleStore>((set, get) => ({
  bottles: [],
  stats: null,
  isLoading: false,
  isStatsLoading: false,
  error: null,

  fetchBottles: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await bottlesApi.getAll();
      set({ bottles: res.data, isLoading: false });
    } catch (e) {
      set({ isLoading: false, error: 'Impossible de charger la cave.' });
    }
  },

  addBottle: async (data) => {
    const res = await bottlesApi.create(data);
    const newBottle = res.data.bottle;
    set((state) => ({ bottles: [newBottle, ...state.bottles] }));
    return newBottle;
  },

  updateBottle: async (id, data) => {
    const res = await bottlesApi.update(id, data);
    const updated = res.data.bottle;
    set((state) => ({
      bottles: state.bottles.map((b) => (b._id === id ? updated : b)),
    }));
  },

  deleteBottle: async (id) => {
    await bottlesApi.delete(id);
    set((state) => ({ bottles: state.bottles.filter((b) => b._id !== id) }));
  },

  toggleFavorite: async (id) => {
    const res = await bottlesApi.toggleFavorite(id);
    const { isFavorite } = res.data;
    set((state) => ({
      bottles: state.bottles.map((b) => (b._id === id ? { ...b, isFavorite } : b)),
    }));
  },

  drinkBottle: async (id, quantity = 1, comment, note) => {
    const res = await bottlesApi.drink(id, { quantity, comment, note });
    const { quantiteRestante } = res.data;
    set((state) => ({
      bottles: state.bottles.map((b) =>
        b._id === id ? { ...b, quantite: quantiteRestante } : b
      ),
    }));
  },

  getFavorites: () => get().bottles.filter((b) => b.isFavorite),

  getUrgent: () => {
    const year = new Date().getFullYear();
    return get().bottles.filter(
      (b) => b.consommerAvant && b.consommerAvant <= year + 1 && b.quantite > 0
    );
  },

  getByColor: (color) => get().bottles.filter((b) => b.couleur === color),
}));
