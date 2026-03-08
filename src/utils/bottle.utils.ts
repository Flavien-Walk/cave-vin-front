import { Colors } from '../constants/colors';
import type { Bottle, WineCouleur } from '../types';

export const isUrgent = (bottle: Bottle): boolean => {
  if (!bottle.consommerAvant || bottle.quantite === 0) return false;
  return bottle.consommerAvant <= new Date().getFullYear();
};

export const isNearUrgent = (bottle: Bottle): boolean => {
  if (!bottle.consommerAvant || bottle.quantite === 0) return false;
  return bottle.consommerAvant <= new Date().getFullYear() + 1;
};

export const getWineColorHex = (couleur?: WineCouleur | string): string => {
  switch (couleur) {
    case 'rouge': return Colors.rougeVin;
    case 'blanc': return Colors.blancDore;
    case 'rosé': return Colors.rosePale;
    case 'effervescent': return Colors.effervescent;
    case 'moelleux': return Colors.moelleux;
    default: return Colors.brunMoyen;
  }
};

export const getWineColorLight = (couleur?: WineCouleur | string): string => {
  switch (couleur) {
    case 'rouge': return Colors.rougeVinLight;
    case 'blanc': return Colors.blancDoreLight;
    case 'rosé': return Colors.rosePaleLight;
    case 'effervescent': return Colors.effervescentLight;
    case 'moelleux': return Colors.moelleuxLight;
    default: return Colors.champagne;
  }
};

export const getWineGradient = (couleur?: WineCouleur | string): [string, string] => {
  switch (couleur) {
    case 'rouge': return ['#8B3A45', '#5B2333'];
    case 'blanc': return ['#D4A843', '#A07830'];
    case 'rosé': return ['#D4748A', '#B05570'];
    case 'effervescent': return ['#7AADA0', '#4A7D70'];
    case 'moelleux': return ['#C09858', '#8A6838'];
    default: return ['#9A8878', '#6A5848'];
  }
};

export const formatPrice = (price?: number): string => {
  if (!price) return '';
  return `${price.toFixed(2)} €`;
};

export const getAverageNote = (bottle: Bottle): number | null => {
  const allNotes = [
    ...bottle.notes.map((n) => n.note),
    ...(bottle.notePerso?.note ? [bottle.notePerso.note] : []),
  ];
  if (!allNotes.length) return null;
  return Math.round((allNotes.reduce((a, b) => a + b, 0) / allNotes.length) * 10) / 10;
};

export const normalizeText = (str: string): string =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export const filterAndSortBottles = (
  bottles: Bottle[],
  search: string,
  filters: {
    couleur?: string;
    type?: string;
    cave?: string;
    favoritesOnly?: boolean;
    urgentOnly?: boolean;
  },
  sortBy: string
): Bottle[] => {
  let result = [...bottles];
  const q = normalizeText(search);

  if (q) {
    result = result.filter(
      (b) =>
        normalizeText(b.nom).includes(q) ||
        normalizeText(b.producteur || '').includes(q) ||
        normalizeText(b.region || '').includes(q) ||
        normalizeText(b.appellation || '').includes(q) ||
        String(b.annee || '').includes(q)
    );
  }

  if (filters.couleur) result = result.filter((b) => b.couleur === filters.couleur);
  if (filters.type) result = result.filter((b) => b.type === filters.type);
  if (filters.cave) result = result.filter((b) => b.cave === filters.cave);
  if (filters.favoritesOnly) result = result.filter((b) => b.isFavorite);
  if (filters.urgentOnly) result = result.filter(isUrgent);

  switch (sortBy) {
    case 'annee':
      result.sort((a, b) => (b.annee || 0) - (a.annee || 0));
      break;
    case 'nom':
      result.sort((a, b) => a.nom.localeCompare(b.nom));
      break;
    case 'prix':
      result.sort((a, b) => (b.prixAchat || 0) - (a.prixAchat || 0));
      break;
    case 'note':
      result.sort((a, b) => (getAverageNote(b) || 0) - (getAverageNote(a) || 0));
      break;
    default:
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return result;
};
