import client from './client';
import type { Bottle, CreateBottleDto, UpdateBottleDto, ConsumptionEntry } from '../types';

export const bottlesApi = {
  getAll: () => client.get<Bottle[]>('/api/bottles'),

  getById: (id: string) => client.get<Bottle>(`/api/bottles/${id}`),

  create: (data: CreateBottleDto) => client.post<{ bottle: Bottle }>('/api/bottles', data),

  update: (id: string, data: UpdateBottleDto) =>
    client.put<{ bottle: Bottle }>(`/api/bottles/${id}`, data),

  delete: (id: string) => client.delete(`/api/bottles/${id}`),

  toggleFavorite: (id: string) =>
    client.put<{ isFavorite: boolean }>(`/api/bottles/${id}/favorite`),

  addNote: (id: string, data: { note: number; texte?: string; occasion?: string }) =>
    client.post(`/api/bottles/${id}/notes`, data),

  deleteNote: (id: string, noteId: string) =>
    client.delete(`/api/bottles/${id}/notes/${noteId}`),

  drink: (id: string, data: { quantity?: number; note?: number; comment?: string; occasion?: string }) =>
    client.post<{ quantiteRestante: number; entry: ConsumptionEntry }>(`/api/bottles/${id}/drink`, data),

  getHistory: (id: string) =>
    client.get<ConsumptionEntry[]>(`/api/bottles/${id}/history`),

  getRecommendations: () =>
    client.get<{ recommandations: Bottle[] }>('/api/bottles/recommend'),

  suggestWine: (plat: string) =>
    client.post<{ suggestions: Bottle[] }>('/api/bottles/suggest-wine', { plat }),
};
