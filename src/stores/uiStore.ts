import { create } from 'zustand';

type CaveView = 'list' | 'grid';
type ActiveFilter = {
  couleur?: string;
  type?: string;
  cave?: string;
  favoritesOnly?: boolean;
  urgentOnly?: boolean;
};

interface UIStore {
  caveView: CaveView;
  activeFilters: ActiveFilter;
  searchQuery: string;
  sortBy: 'createdAt' | 'annee' | 'nom' | 'note' | 'prix';

  setCaveView: (view: CaveView) => void;
  setFilter: (key: keyof ActiveFilter, value: string | boolean | undefined) => void;
  clearFilters: () => void;
  setSearchQuery: (q: string) => void;
  setSortBy: (sort: UIStore['sortBy']) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  caveView: 'list',
  activeFilters: {},
  searchQuery: '',
  sortBy: 'createdAt',

  setCaveView: (view) => set({ caveView: view }),

  setFilter: (key, value) =>
    set((state) => ({
      activeFilters: { ...state.activeFilters, [key]: value },
    })),

  clearFilters: () => set({ activeFilters: {}, searchQuery: '' }),

  setSearchQuery: (q) => set({ searchQuery: q }),

  setSortBy: (sort) => set({ sortBy: sort }),
}));
