
import { MapMode, MapStyle, CityInfo } from './types';

export const MAP_STYLES: MapStyle[] = [
  {
    id: MapMode.DARK,
    name: '暗夜黑 (Dark)',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO',
    textColor: '#ffffff',
    bgColor: '#1a1a1a'
  },
  {
    id: MapMode.LIGHT,
    name: '纯净白 (Light)',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO',
    textColor: '#000000',
    bgColor: '#ffffff'
  },
  {
    id: MapMode.SILVER,
    name: '银霜白 (Silver)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO',
    textColor: '#333333',
    bgColor: '#f5f5f5'
  },
  {
    id: MapMode.RETRO,
    name: '复古色 (Retro)',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; OSM',
    textColor: '#4a3728',
    bgColor: '#fffcf0'
  }
];

export const PRESET_CITIES: CityInfo[] = [
  {
    id: 'shanghai',
    name: '上海',
    country: 'CHINA',
    lat: 31.2304,
    lng: 121.4737,
    description: '魔都魅影，东方明珠下的流光溢彩。',
    accentColor: '#ff3b30'
  },
  {
    id: 'beijing',
    name: '北京',
    country: 'CHINA',
    lat: 39.9042,
    lng: 116.4074,
    description: '千年古都，中轴线上的盛世繁华。',
    accentColor: '#e60012'
  },
  {
    id: 'guangzhou',
    name: '广州',
    country: 'CHINA',
    lat: 23.1291,
    lng: 113.2644,
    description: '花城锦绣，云山珠水间的烟火气。',
    accentColor: '#ff9500'
  },
  {
    id: 'shenzhen',
    name: '深圳',
    country: 'CHINA',
    lat: 22.5431,
    lng: 114.0579,
    description: '创新之城，南海之滨的先行示范区。',
    accentColor: '#007aff'
  },
  {
    id: 'hangzhou',
    name: '杭州',
    country: 'CHINA',
    lat: 30.2741,
    lng: 120.1551,
    description: '人间天堂，西子湖畔的诗意栖居。',
    accentColor: '#34c759'
  },
  {
    id: 'chengdu',
    name: '成都',
    country: 'CHINA',
    lat: 30.5728,
    lng: 104.0668,
    description: '锦官之城，慢生活里的安逸滋味。',
    accentColor: '#af52de'
  },
  {
    id: 'xian',
    name: '西安',
    country: 'CHINA',
    lat: 34.3416,
    lng: 108.9398,
    description: '长安古韵，大明宫词里的汉唐雄风。',
    accentColor: '#8b4513'
  },
  {
    id: 'nanjing',
    name: '南京',
    country: 'CHINA',
    lat: 32.0603,
    lng: 118.7969,
    description: '六朝古都，秦淮河畔的十里春风。',
    accentColor: '#5856d6'
  },
  {
    id: 'wuhan',
    name: '武汉',
    country: 'CHINA',
    lat: 30.5928,
    lng: 114.3055,
    description: '江城壮阔，黄鹤楼下的三镇风云。',
    accentColor: '#ff2d55'
  },
  {
    id: 'chongqing',
    name: '重庆',
    country: 'CHINA',
    lat: 29.5630,
    lng: 106.5516,
    description: '赛博山城，两江交汇的立体森林。',
    accentColor: '#ffcc00'
  }
];

export const DEFAULT_CITY = PRESET_CITIES[0];
