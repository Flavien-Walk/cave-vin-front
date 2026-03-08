import client from './client';
import type { WishlistItem, CreateWishlistItemDto } from '../types';

export const wishlistApi = {
  getAll: () => client.get<WishlistItem[]>('/api/wishlist'),

  create: (data: CreateWishlistItemDto) =>
    client.post<{ item: WishlistItem }>('/api/wishlist', data),

  update: (id: string, data: Partial<CreateWishlistItemDto>) =>
    client.put<{ item: WishlistItem }>(`/api/wishlist/${id}`, data),

  delete: (id: string) => client.delete(`/api/wishlist/${id}`),

  markPurchased: (id: string) =>
    client.put<{ item: WishlistItem }>(`/api/wishlist/${id}/purchase`),
};
