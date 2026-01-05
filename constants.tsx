
// Fix: Added CityInfo to imports
import { MapMode, MapStyle, CityInfo } from './types';

export const MAP_STYLES: MapStyle[] = [
  {
    id: MapMode.DARK,
    name: 'Midnight Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    textColor: '#ffffff',
    bgColor: '#1a1a1a'
  },
  {
    id: MapMode.LIGHT,
    name: 'Pure Light',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    textColor: '#000000',
    bgColor: '#ffffff'
  },
  {
    id: MapMode.SILVER,
    name: 'Clean Silver',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    textColor: '#333333',
    bgColor: '#f5f5f5'
  },
  {
    id: MapMode.RETRO,
    name: 'Vintage Retro',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    textColor: '#4a3728',
    bgColor: '#fffcf0'
  }
];

export const DEFAULT_CITY: CityInfo = {
  name: 'Tokyo',
  country: 'Japan',
  lat: 35.6762,
  lng: 139.6503,
  description: 'A neon-lit metropolis where tradition meets the future.',
  accentColor: '#ff0055'
};