
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
  { id: 'shanghai', name: '上海', country: 'CHINA', lat: 31.2304, lng: 121.4737, description: '魔都魅影，东方明珠下的流光溢彩。', accentColor: '#ff3b30' },
  { id: 'beijing', name: '北京', country: 'CHINA', lat: 39.9042, lng: 116.4074, description: '千年古都，中轴线上的盛世繁华。', accentColor: '#e60012' },
  { id: 'guangzhou', name: '广州', country: 'CHINA', lat: 23.1291, lng: 113.2644, description: '花城锦绣，云山珠水间的烟火气。', accentColor: '#ff9500' },
  { id: 'shenzhen', name: '深圳', country: 'CHINA', lat: 22.5431, lng: 114.0579, description: '创新之城，南海之滨的先行示范区。', accentColor: '#007aff' },
  { id: 'hangzhou', name: '杭州', country: 'CHINA', lat: 30.2741, lng: 120.1551, description: '人间天堂，西子湖畔的诗意栖居。', accentColor: '#34c759' },
  { id: 'chengdu', name: '成都', country: 'CHINA', lat: 30.5728, lng: 104.0668, description: '锦官之城，慢生活里的安逸滋味。', accentColor: '#af52de' },
  { id: 'chongqing', name: '重庆', country: 'CHINA', lat: 29.5630, lng: 106.5516, description: '赛博山城，两江交汇的立体森林。', accentColor: '#ffcc00' },
  { id: 'suzhou', name: '苏州', country: 'CHINA', lat: 31.2990, lng: 120.5853, description: '园林之都，姑苏城外的吴侬软语。', accentColor: '#5ac8fa' },
  { id: 'nanjing', name: '南京', country: 'CHINA', lat: 32.0603, lng: 118.7969, description: '六朝古都，秦淮河畔的十里春风。', accentColor: '#5856d6' },
  { id: 'wuhan', name: '武汉', country: 'CHINA', lat: 30.5928, lng: 114.3055, description: '江城壮阔，黄鹤楼下的三镇风云。', accentColor: '#ff2d55' },
  { id: 'tianjin', name: '天津', country: 'CHINA', lat: 39.0842, lng: 117.2010, description: '渤海明珠，海河之滨的幽默闲适。', accentColor: '#007aff' },
  { id: 'xian', name: '西安', country: 'CHINA', lat: 34.3416, lng: 108.9398, description: '长安古韵，大明宫词里的汉唐雄风。', accentColor: '#8b4513' },
  { id: 'changsha', name: '长沙', country: 'CHINA', lat: 28.2282, lng: 112.9388, description: '星城璀璨，湘江北去的火辣热情。', accentColor: '#ff3b30' },
  { id: 'zhengzhou', name: '郑州', country: 'CHINA', lat: 34.7466, lng: 113.6253, description: '中原腹地，黄河文明的时代新篇。', accentColor: '#e60012' },
  { id: 'qingdao', name: '青岛', country: 'CHINA', lat: 36.0671, lng: 120.3826, description: '琴岛浪漫，红瓦绿树的碧海蓝天。', accentColor: '#007aff' },
  { id: 'jinan', name: '济南', country: 'CHINA', lat: 36.6512, lng: 117.0009, description: '泉城灵动，大明湖畔的温婉清澈。', accentColor: '#34c759' },
  { id: 'ningbo', name: '宁波', country: 'CHINA', lat: 29.8683, lng: 121.5440, description: '书藏古今，港通天下的商贸重镇。', accentColor: '#5856d6' },
  { id: 'fuzhou', name: '福州', country: 'CHINA', lat: 26.0745, lng: 119.2965, description: '榕城福地，三坊七巷的明清余韵。', accentColor: '#ff9500' },
  { id: 'xiamen', name: '厦门', country: 'CHINA', lat: 24.4798, lng: 118.0894, description: '鹭岛清新，鼓浪屿上的悠扬琴声。', accentColor: '#4cd964' },
  { id: 'harbin', name: '哈尔滨', country: 'CHINA', lat: 45.8038, lng: 126.5350, description: '冰城豪迈，中央大街的欧陆风情。', accentColor: '#ffcc00' },
  { id: 'shenyang', name: '沈阳', country: 'CHINA', lat: 41.6772, lng: 123.4631, description: '盛京往事，一朝发祥地的厚重积淀。', accentColor: '#af52de' },
  { id: 'dalian', name: '大连', country: 'CHINA', lat: 38.9140, lng: 121.6147, description: '北方明珠，浪漫之都的时尚海风。', accentColor: '#007aff' },
  { id: 'kunming', name: '昆明', country: 'CHINA', lat: 25.0406, lng: 102.7122, description: '春城常绿，滇池水畔的四季如春。', accentColor: '#4cd964' },
  { id: 'guiyang', name: '贵阳', country: 'CHINA', lat: 26.5783, lng: 106.7139, description: '林城避暑，甲秀楼下的黔中秘境。', accentColor: '#34c759' },
  { id: 'nanning', name: '南宁', country: 'CHINA', lat: 22.8170, lng: 108.3665, description: '绿城翡翠，百里秀美邕江的韵味。', accentColor: '#32d74b' },
  { id: 'hefei', name: '合肥', country: 'CHINA', lat: 31.8206, lng: 117.2272, description: '庐州科技，大湖名城的创新高地。', accentColor: '#5856d6' },
  { id: 'nanchang', name: '南昌', country: 'CHINA', lat: 28.6759, lng: 115.8921, description: '洪都英雄，滕王阁序的壮美图景。', accentColor: '#ff2d55' },
  { id: 'shijiazhuang', name: '石家庄', country: 'CHINA', lat: 38.0423, lng: 114.5149, description: '燕赵之门，京畿重地的现代枢纽。', accentColor: '#8e8e93' },
  { id: 'taiyuan', name: '太原', country: 'CHINA', lat: 37.8706, lng: 112.5489, description: '并州龙兴，汾河之畔的晋商故里。', accentColor: '#ff9500' },
  { id: 'changchun', name: '长春', country: 'CHINA', lat: 43.8171, lng: 125.3235, description: '北国春城，电影摇篮的森林都市。', accentColor: '#4cd964' },
  { id: 'lanzhou', name: '兰州', country: 'CHINA', lat: 36.0611, lng: 103.8343, description: '黄河金城, 一碗面、一本书、一条河。', accentColor: '#ffcc00' },
  { id: 'urumqi', name: '乌鲁木齐', country: 'CHINA', lat: 43.8256, lng: 87.6168, description: '亚心之都，天山脚下的丝路明珠。', accentColor: '#af52de' },
  { id: 'hohhot', name: '呼和浩特', country: 'CHINA', lat: 40.8415, lng: 111.7519, description: '青色之城，塞外草原的牧歌传奇。', accentColor: '#32d74b' },
  { id: 'lhasa', name: '拉萨', country: 'CHINA', lat: 29.6469, lng: 91.1172, description: '日光之城，布达拉宫的神圣光辉。', accentColor: '#ff3b30' }
];

export const DEFAULT_CITY = PRESET_CITIES[0];
