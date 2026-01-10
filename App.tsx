
import React, { useState, useEffect, useRef } from 'react';
import { Download, Map as MapIcon, Loader2, RefreshCw, Settings, X, ChevronUp } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import MapPreview from './components/MapPreview';
import { CityInfo, MapStyle } from './types';
import { MAP_STYLES, PRESET_CITIES, DEFAULT_CITY } from './constants';

const RATIO_PRESETS = [
  { id: '9:16', name: '16:9', value: 9 / 16 },
  { id: '9:19', name: '19:9', value: 9 / 19 },
  { id: '9:19.5', name: '19.5:9', value: 9 / 19.5 },
  { id: '9:21', name: '21:9', value: 9 / 21 },
];

type AdminLevel = 'province' | 'city' | 'district';

const ADMIN_LEVELS: { id: AdminLevel; name: string }[] = [
  { id: 'province', name: '省份' },
  { id: 'city', name: '城市' },
  { id: 'district', name: '区县' },
];

const App: React.FC = () => {
  const [city, setCity] = useState<CityInfo>(DEFAULT_CITY);
  const [selectedStyle, setSelectedStyle] = useState(MAP_STYLES[0]);
  const [zoom, setZoom] = useState(13);
  const [showLabels, setShowLabels] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(RATIO_PRESETS[2]);
  const [isExporting, setIsExporting] = useState(false);
  const [adminLevel, setAdminLevel] = useState<AdminLevel>('city');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [manualLat, setManualLat] = useState(DEFAULT_CITY.lat.toString());
  const [manualLng, setManualLng] = useState(DEFAULT_CITY.lng.toString());

  const previewRef = useRef<HTMLDivElement>(null);

  // 解析 URL 参数
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lat = parseFloat(params.get('lat') || '');
    const lng = parseFloat(params.get('lng') || '');
    const s = params.get('s');
    const r = params.get('r');
    const al = params.get('al') as AdminLevel;
    const exportMode = params.get('export') === 'true';

    const nameParam = params.get('name');
    const descParam = params.get('desc');

    if (al && ADMIN_LEVELS.some(level => level.id === al)) {
      setAdminLevel(al);
    }

    if (!isNaN(lat) && !isNaN(lng)) {
      setCity(prev => ({
        ...prev,
        lat,
        lng,
        id: 'custom',
        name: nameParam || prev.name,
        description: descParam !== null ? descParam : prev.description
      }));

      if (!nameParam) {
        // 如果没有提供名称，尝试根据坐标获取
        setCity(prev => ({ ...prev, name: '加载中...' }));
        fetchCityName(lat, lng, al || 'city').then(fetchedName => {
          setCity(prev => ({ ...prev, name: fetchedName }));
        });
      }
      setManualLat(lat.toString());
      setManualLng(lng.toString());
    } else {
      // 即使没有坐标，也可以应用自定义名称和标语
      if (nameParam || descParam) {
        setCity(prev => ({
          ...prev,
          name: nameParam || prev.name,
          description: descParam !== null ? descParam : prev.description
        }));
      }

      // 如果没有 URL 参数，尝试获取当前地理位置
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentLat = position.coords.latitude;
            const currentLng = position.coords.longitude;
            setManualLat(currentLat.toFixed(6));
            setManualLng(currentLng.toFixed(6));

            // 只有在没提供 nameParam 时才自动获取并设置
            if (!nameParam) {
              setCity(prev => ({ ...prev, lat: currentLat, lng: currentLng, id: 'custom', name: '加载中...' }));
              fetchCityName(currentLat, currentLng, al || 'city').then(fetchedName => {
                setCity(prev => ({ ...prev, lat: currentLat, lng: currentLng, id: 'custom', name: fetchedName }));
              });
            } else {
              setCity(prev => ({ ...prev, lat: currentLat, lng: currentLng, id: 'custom' }));
            }
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      }
    }

    if (s) {
      const style = MAP_STYLES.find(st => st.id === s);
      if (style) setSelectedStyle(style);
    }
    if (r) {
      const preset = RATIO_PRESETS.find(p => p.id === r);
      if (preset) setAspectRatio(preset);
    }
  }, []);

  const fetchCityName = async (lat: number, lng: number, level: AdminLevel = adminLevel): Promise<string> => {
    try {
      // 使用 zoom=10 以获取更宏观的行政信息
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&accept-language=zh`);
      const data = await response.json();
      const addr = data.address || {};

      if (level === 'province') {
        return addr.state || addr.province || '自定义省份';
      }

      if (level === 'district') {
        // 优先取区县级字段
        const district = addr.city_district || addr.district || addr.county || addr.suburb || addr.town;
        // 过滤掉“街道”这种层级太细的
        if (district && !district.endsWith('街道')) return district;
        // 如果 city 字段本身就是个“区”或“县”，也优先用于此级别
        if (addr.city && (addr.city.endsWith('区') || addr.city.endsWith('县'))) return addr.city;
        return district || addr.city_district || addr.county || '自定义区县';
      }

      // 默认为 city 级别
      // 1. 直辖市处理
      if (addr.municipality) return addr.municipality;

      // 2. 核心逻辑：Nominatim 经常把区县放在 city 字段，此时真正的市在 state_district
      const sDistrict = addr.state_district;
      const cField = addr.city;

      // 如果 state_district 看起来像个市，优先用它
      if (sDistrict && (sDistrict.endsWith('市') || sDistrict.endsWith('盟') || sDistrict.endsWith('州'))) return sDistrict;
      // 如果 city 字段不像区县，用它
      if (cField && !cField.endsWith('区') && !cField.endsWith('县') && !cField.endsWith('省')) return cField;
      // 兜底尝试
      if (sDistrict) return sDistrict;
      if (cField) return cField;
      if (addr.state && (addr.state.endsWith('市') || ['北京', '上海', '天津', '重庆'].some(s => addr.state.includes(s)))) return addr.state;

      return addr.city || addr.town || addr.municipality || '自定义城市';
    } catch (error) {
      console.error('Failed to fetch city name:', error);
      return '自定义地点';
    }
  };

  const handleAdminLevelChange = async (newLevel: AdminLevel) => {
    setAdminLevel(newLevel);
    if (city.id === 'custom') {
      setCity(prev => ({ ...prev, name: '加载中...' }));
      const name = await fetchCityName(city.lat, city.lng, newLevel);
      setCity(prev => ({ ...prev, name }));
    }
  };

  const handleLocationApply = async () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng)) return;

    setCity(prev => ({ ...prev, lat, lng, id: 'custom', name: '加载中...' }));
    const name = await fetchCityName(lat, lng);
    setCity(prev => ({ ...prev, lat, lng, id: 'custom', name }));
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setManualLat(lat.toFixed(6));
    setManualLng(lng.toFixed(6));
    setCity(prev => ({ ...prev, lat, lng, id: 'custom', name: '加载中...' }));
    const name = await fetchCityName(lat, lng);
    setCity(prev => ({ ...prev, lat, lng, id: 'custom', name }));
  };

  const handleDownload = async () => {
    if (!previewRef.current || isExporting) return;

    setIsExporting(true);
    try {
      // 增加等待时间，确保地图切片（Tiles）和字体完全渲染
      await new Promise(resolve => setTimeout(resolve, 2500));

      const dataUrl = await htmlToImage.toPng(previewRef.current, {
        quality: 1.0,
        pixelRatio: 3, // 3倍高清导出
        cacheBust: true,
        style: {
          borderRadius: '0', // 强制导出时无圆角
        }
      });

      const link = document.createElement('a');
      link.download = `CityPaper_${city.name}_${selectedStyle.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export Error:', err);
      alert('导出失败，请检查网络连接后重试');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#050505] text-white flex flex-col md:flex-row overflow-hidden font-sans relative">

      {/* 桌面端/移动端通用的侧边/底部面板 */}
      <aside className={`
        fixed md:relative bottom-0 left-0 w-full md:w-[380px] 
        bg-[#080808]/95 backdrop-blur-xl md:bg-[#080808]
        border-t md:border-t-0 md:border-r border-zinc-900 
        p-6 md:p-8 flex flex-col gap-6 md:gap-10 z-[60] 
        transition-transform duration-500 ease-in-out
        ${isMenuOpen ? 'translate-y-0' : 'translate-y-[calc(100%-80px)] md:translate-y-0'}
        md:h-screen max-h-[85vh] md:max-h-none rounded-t-[2.5rem] md:rounded-none shadow-[0_-20px_40px_rgba(0,0,0,0.5)] md:shadow-none
      `}>
        {/* 移动端顶部的拖拽指示/标题栏 */}
        <div
          className="flex items-center justify-between md:mb-2 cursor-pointer md:cursor-default"
          onClick={() => window.innerWidth < 768 && setIsMenuOpen(!isMenuOpen)}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <MapIcon size={20} className="text-black md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tighter italic uppercase">CityPaper</h1>
              <p className="text-[8px] md:text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em]">Map Engine v3.0</p>
            </div>
          </div>
          <button className="md:hidden p-2 text-zinc-500">
            {isMenuOpen ? <X size={20} /> : <ChevronUp size={20} className="animate-bounce" />}
          </button>
        </div>

        <div className="flex-1 space-y-6 md:space-y-8 overflow-y-auto pr-2 custom-scrollbar">
          {/* 比例选择 */}
          <div className="space-y-3 md:space-y-4">
            <label className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest">屏幕比例</label>
            <div className="grid grid-cols-2 gap-2">
              {RATIO_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setAspectRatio(p)}
                  className={`py-2.5 md:py-3 rounded-xl border text-[10px] md:text-[11px] font-bold transition-all ${aspectRatio.id === p.id ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* 行政级别选择 */}
          <div className="space-y-3 md:space-y-4">
            <label className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest">显示层级</label>
            <div className="grid grid-cols-3 gap-2">
              {ADMIN_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleAdminLevelChange(level.id)}
                  className={`py-2.5 md:py-3 rounded-xl border text-[10px] md:text-[11px] font-bold transition-all ${adminLevel === level.id ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                >
                  {level.name}
                </button>
              ))}
            </div>
          </div>

          {/* 位置定位 */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest">位置定位</label>
              <button
                onClick={handleLocationApply}
                className="text-zinc-500 hover:text-white transition-colors"
                title="应用坐标"
              >
                <RefreshCw size={14} className={city.name === '加载中...' ? 'animate-spin' : ''} />
              </button>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 md:py-2 flex flex-col gap-0.5 md:gap-1 focus-within:border-zinc-600 transition-all">
                <span className="text-[7px] md:text-[8px] font-black text-zinc-600 uppercase">Latitude</span>
                <input
                  type="text"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  className="bg-transparent border-none p-0 text-[10px] md:text-[11px] font-bold text-white focus:ring-0 w-full"
                />
              </div>
              <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 md:py-2 flex flex-col gap-0.5 md:gap-1 focus-within:border-zinc-600 transition-all">
                <span className="text-[7px] md:text-[8px] font-black text-zinc-600 uppercase">Longitude</span>
                <input
                  type="text"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  className="bg-transparent border-none p-0 text-[10px] md:text-[11px] font-bold text-white focus:ring-0 w-full"
                />
              </div>
            </div>
          </div>


          {/* 内容定制 */}
          <div className="space-y-3 md:space-y-4">
            <label className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest">内容定制</label>
            <div className="space-y-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 md:py-2 flex flex-col gap-0.5 md:gap-1 focus-within:border-zinc-600 transition-all">
                <span className="text-[7px] md:text-[8px] font-black text-zinc-600 uppercase">地名标题</span>
                <input
                  type="text"
                  value={city.name}
                  onChange={(e) => setCity(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-transparent border-none p-0 text-[10px] md:text-[11px] font-bold text-white focus:ring-0 w-full"
                  placeholder="输入城市名..."
                />
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 md:py-2 flex flex-col gap-0.5 md:gap-1 focus-within:border-zinc-600 transition-all">
                <span className="text-[7px] md:text-[8px] font-black text-zinc-600 uppercase">评价描述</span>
                <textarea
                  value={city.description || ''}
                  onChange={(e) => setCity(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-transparent border-none p-0 text-[10px] md:text-[11px] font-bold text-white focus:ring-0 w-full resize-none h-10 md:h-12 custom-scrollbar"
                  placeholder="输入城市描述..."
                />
              </div>
            </div>
          </div>

          {/* 地图风格 */}
          <div className="space-y-3 md:space-y-4 pb-4">
            <label className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest">视觉方案</label>
            <div className="grid grid-cols-2 gap-2">
              {MAP_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  className={`py-2.5 md:py-3 px-2 rounded-xl border text-[9px] md:text-[10px] font-black transition-all ${selectedStyle.id === style.id ? 'bg-zinc-100 text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="pt-4 md:pt-6 border-t border-zinc-900">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full py-4 md:py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl"
          >
            {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
            <span className="text-sm md:text-base">{isExporting ? '生成中...' : '下载高清壁纸'}</span>
          </button>
        </div>
      </aside>

      {/* 预览区 */}
      <main className="flex-1 relative bg-[#050505] flex items-center justify-center p-0 md:p-12 h-screen overflow-hidden">
        {/* 移动端设置按钮 (浮动) */}
        {!isMenuOpen && (
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden fixed top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center z-[70] shadow-2xl active:scale-90 transition-all"
          >
            <Settings size={20} className="text-white" />
          </button>
        )}

        {/* 装饰性背景 */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />
        </div>

        {/* 手机边框容器 / 预览容器 */}
        {!new URLSearchParams(window.location.search).get('export') ? (
          <div
            className={`
              relative w-full md:max-w-[340px] p-0 md:p-2 
              bg-transparent md:bg-zinc-900 
              md:rounded-[3rem] border-0 md:border-[1px] md:border-zinc-800 
              md:shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] group
              h-full md:h-auto
            `}
            style={{
              aspectRatio: window.innerWidth >= 768 ? aspectRatio.id.replace(':', '/') : 'auto',
              maxHeight: window.innerWidth >= 768 ? '85vh' : '100vh'
            }}
          >
            {/* 预览画布 */}
            <div
              ref={previewRef}
              data-testid="wallpaper-canvas"
              className="w-full h-full overflow-hidden md:rounded-[2.5rem]"
            >
              <MapPreview
                city={city}
                style={selectedStyle}
                zoom={zoom}
                showLabels={showLabels}
                onMapClick={handleMapClick}
              />
            </div>

            {/* 桌面端装饰物：听筒/传感器区域 */}
            <div className="hidden md:flex absolute top-6 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#080808] rounded-full z-30 items-center justify-center gap-2">
              <div className="w-1 h-1 rounded-full bg-zinc-800" />
              <div className="w-8 h-1 rounded-full bg-zinc-800" />
            </div>
          </div>
        ) : (
          /* 导出模式：直接显示画布，无边框，无圆角 */
          <div
            ref={previewRef}
            data-testid="wallpaper-canvas"
            className="w-full h-full"
            style={{
              aspectRatio: aspectRatio.id.replace(':', '/'),
              maxHeight: '100vh',
              width: 'auto',
              height: '100vh'
            }}
          >
            <MapPreview
              city={city}
              style={selectedStyle}
              zoom={zoom}
              showLabels={showLabels}
              onMapClick={handleMapClick}
            />
          </div>
        )}

        {/* 实时参数提示 (桌面端) */}
        <div className="absolute bottom-10 right-10 flex gap-4 text-zinc-700 text-[10px] font-mono uppercase tracking-widest hidden lg:flex">
          <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800">
            <span className="text-zinc-500">ZOOM</span> {zoom}
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800">
            <span className="text-zinc-500">STYLE</span> {selectedStyle.id}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
