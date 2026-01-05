
import React, { useState, useEffect, useRef } from 'react';
import { Download, Map as MapIcon, Loader2, RefreshCw } from 'lucide-react';
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

const App: React.FC = () => {
  const [city, setCity] = useState<CityInfo>(DEFAULT_CITY);
  const [selectedStyle, setSelectedStyle] = useState(MAP_STYLES[0]);
  const [zoom, setZoom] = useState(13);
  const [showLabels, setShowLabels] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(RATIO_PRESETS[2]);
  const [isExporting, setIsExporting] = useState(false);

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
    const exportMode = params.get('export') === 'true';

    if (!isNaN(lat) && !isNaN(lng)) {
      const name = params.get('name');
      if (name) {
        setCity(prev => ({ ...prev, lat, lng, id: 'custom', name }));
      } else {
        // 如果没有提供名称，尝试根据坐标获取
        setCity(prev => ({ ...prev, lat, lng, id: 'custom', name: '加载中...' }));
        fetchCityName(lat, lng).then(fetchedName => {
          setCity(prev => ({ ...prev, lat, lng, id: 'custom', name: fetchedName }));
        });
      }
      setManualLat(lat.toString());
      setManualLng(lng.toString());
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

  const fetchCityName = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&accept-language=zh`);
      const data = await response.json();
      const addr = data.address || {};
      // 优先获取城市名，避开区名（suburb）
      return addr.city || addr.town || addr.municipality || addr.city_district || addr.province || '自定义地点';
    } catch (error) {
      console.error('Failed to fetch city name:', error);
      return '自定义地点';
    }
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
    <div className="h-screen w-screen bg-[#050505] text-white flex flex-col md:flex-row overflow-hidden font-sans">

      {/* 左侧控制栏 */}
      <aside className="w-full md:w-[380px] border-r border-zinc-900 p-8 flex flex-col gap-10 z-50 bg-[#080808] shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <MapIcon size={24} className="text-black" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter italic uppercase">CityPaper</h1>
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em]">Map Engine v3.0</p>
          </div>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
          {/* 比例选择 */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">屏幕比例</label>
            <div className="grid grid-cols-2 gap-2">
              {RATIO_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setAspectRatio(p)}
                  className={`py-3 rounded-xl border text-[11px] font-bold transition-all ${aspectRatio.id === p.id ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* 预设城市 */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">快速城市</label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_CITIES.slice(0, 6).map(c => (
                <button
                  key={c.id}
                  onClick={() => { setCity(c); setManualLat(c.lat.toString()); setManualLng(c.lng.toString()); }}
                  className={`py-2 rounded-lg text-[10px] font-bold transition-all border ${city.id === c.id ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-transparent border-zinc-900 text-zinc-600'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* 地图风格 */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">视觉方案</label>
            <div className="grid grid-cols-2 gap-2">
              {MAP_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  className={`py-3 px-2 rounded-xl border text-[10px] font-black transition-all ${selectedStyle.id === style.id ? 'bg-zinc-100 text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="pt-6 border-t border-zinc-900">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl"
          >
            {isExporting ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
            {isExporting ? '生成高清壁纸...' : '下载高清壁纸'}
          </button>
        </div>
      </aside>

      {/* 右侧预览区 */}
      <main className="flex-1 relative bg-[#050505] flex items-center justify-center p-6 md:p-12">
        {/* 装饰性背景 */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />
        </div>

        {/* 手机边框容器 (仅限 UI 预览，不参与导出) */}
        {!new URLSearchParams(window.location.search).get('export') ? (
          <div
            className="relative w-full max-w-[340px] p-2 bg-zinc-900 rounded-[3rem] border-[1px] border-zinc-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] group"
            style={{
              aspectRatio: aspectRatio.id.replace(':', '/'),
              maxHeight: '85vh'
            }}
          >
            {/* 内嵌的导出目标 (previewRef) - 下载的内容是这里的 100% 画面 */}
            <div
              ref={previewRef}
              data-testid="wallpaper-canvas"
              className="w-full h-full overflow-hidden rounded-[2.5rem]"
            >
              <MapPreview city={city} style={selectedStyle} zoom={zoom} showLabels={showLabels} />
            </div>

            {/* 装饰物：听筒/传感器区域 */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#080808] rounded-full z-30 flex items-center justify-center gap-2">
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
            <MapPreview city={city} style={selectedStyle} zoom={zoom} showLabels={showLabels} />
          </div>
        )}

        {/* 实时参数提示 */}
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
