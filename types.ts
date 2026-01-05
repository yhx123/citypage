
export enum MapMode {
  LIGHT = 'light',
  DARK = 'dark',
  SILVER = 'silver',
  RETRO = 'retro'
}

export interface CityInfo {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  country: string;
  accentColor: string;
}

export interface MapStyle {
  id: MapMode;
  name: string;
  url: string;
  attribution: string;
  textColor: string;
  bgColor: string;
}
