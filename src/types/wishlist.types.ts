export type WishlistPriorite = 'haute' | 'normale' | 'basse';

export interface WishlistItem {
  _id: string;
  nom: string;
  producteur?: string;
  region?: string;
  appellation?: string;
  annee?: number;
  couleur?: string;
  priorite: WishlistPriorite;
  prixCible?: number;
  note?: string;
  url?: string;
  isPurchased: boolean;
  createdAt: string;
}

export type CreateWishlistItemDto = Omit<WishlistItem, '_id' | 'isPurchased' | 'createdAt'>;
