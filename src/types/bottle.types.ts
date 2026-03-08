export type WineCouleur = 'rouge' | 'blanc' | 'rosé' | 'effervescent' | 'moelleux' | 'autre';
export type WineType = 'bouteille' | 'demi' | 'magnum' | 'jéroboam' | 'autre';
export type WineSource = 'manual' | 'scan' | 'import';

export interface TastingNote {
  _id: string;
  note: number;
  texte?: string;
  occasion?: string;
  date: string;
}

export interface Bottle {
  _id: string;
  nom: string;
  producteur?: string;
  region?: string;
  appellation?: string;
  annee?: number;
  couleur?: WineCouleur;
  type?: WineType;
  pays?: string;
  quantite: number;
  cave?: string;
  emplacement?: string;
  prixAchat?: number;
  consommerAvant?: number;
  consommerApresOptimal?: number;
  photoUrl?: string;
  photoThumbUrl?: string;
  isFavorite: boolean;
  notes: TastingNote[];
  notePerso?: {
    texte: string;
    note: number;
    date?: string;
  };
  source?: WineSource;
  createdAt: string;
  updatedAt: string;
}

export type CreateBottleDto = Omit<Bottle, '_id' | 'isFavorite' | 'notes' | 'createdAt' | 'updatedAt'>;
export type UpdateBottleDto = Partial<CreateBottleDto>;

export interface ConsumptionEntry {
  _id: string;
  bottleId: string;
  quantity: number;
  date: string;
  note?: number;
  comment?: string;
  occasion?: string;
}

export interface CaveStats {
  totalBottles: number;
  totalValue: number;
  totalReferences: number;
  byColor: { couleur: string; count: number; percentage: number }[];
  byRegion: { region: string; count: number }[];
  byYear: { annee: number; count: number }[];
  urgent: number;
  favorites: number;
  consumed: {
    thisMonth: number;
    thisYear: number;
    total: number;
  };
}
