export const Colors = {
  // Primaires
  bordeaux: '#5B2333',
  lieDeVin: '#7A2E3A',
  cramoisDoux: '#9B3A4A',

  // Neutres chauds
  cremeIvoire: '#F7F3ED',
  champagne: '#E9DCCB',
  parchemin: '#D4C4A8',
  brunMoka: '#4A3A34',
  brunMoyen: '#7A6A62',
  brunClair: '#A89880',

  // Accents
  vertSauge: '#9BAA8D',
  ambreChaud: '#C4874A',
  rougeAlerte: '#C0392B',
  rougeAlerteLight: '#FDF0EE',

  // Badges couleur vin
  rougeVin: '#722F37',
  rougeVinLight: '#F5EAEB',
  blancDore: '#D4A843',
  blancDoreLight: '#FBF5E6',
  rosePale: '#D4748A',
  rosePaleLight: '#FDF0F3',
  effervescent: '#5A8A7A',
  effervescentLight: '#EDF4F2',
  moelleux: '#A0784A',
  moelleuxLight: '#F5EFE6',

  // Utilitaires
  white: '#FFFFFF',
  black: '#1A1A1A',
  transparent: 'transparent',
  overlay: 'rgba(74, 58, 52, 0.5)',
  shadow: 'rgba(74, 58, 52, 0.12)',
} as const;

export type ColorKey = keyof typeof Colors;
