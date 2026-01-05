
import React, { useState, useEffect } from 'react';
import { Download, Settings, Map as MapIcon, Layout, RefreshCcw, MapPin, Type as TypeIcon, Palette, Compass } from 'lucide-react';
import MapPreview from './components/MapPreview';
import { CityInfo, MapStyle } from './types';
import { MAP_STYLES, PRESET_CITIES, DEFAULT_CITY } from './constants';

const App: React.FC = () => {
  const [city, setCity] = useState<CityInfo>(DEFAULT_CITY);
  const [selectedStyle, setSelectedStyle] = useState(MAP_STYLES[0]);
  const [zoom, setZoom] = useState(13);
  const [showLabels, setShowLabels] = useState(true);
  
  // 用于手动编辑坐标的临时状态
  const [manualLat, setManualLat] = useState(DEFAULT_CITY.lat.toString());
  const [manualLng, setManualLng] = useState(DEFAULT_CITY.lng.toString());

  // 切换预设城市
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = PRESET_CITIES.find(c => c.id === e.target.value);
    if (selected) {
      setCity(selected);
      setManualLat(selected.lat.toString());
      setManualLng(selected.lng.toString());
    }
  };

  // 手动应用坐标
  const applyCoordinates = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      setCity({
        ...city,
        id: 'custom',
        name: '自定义坐标',
        lat,
        lng,
        description: '位于您探索出的独特经纬。'
      });
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity({ ...city, accentColor: e.target.value });
  };

  const downloadWallpaper = () => {
    alert(`壁纸生成请求已提交！\n城市: ${city.name}\n风格: ${selectedStyle.name}\n建议分辨率: 1440x3200 (9:20)`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row overflow-hidden">
      
      {/* 侧边控制栏 */}
      <aside className="w-full md:w-[400px] border-b md:border-b-0 md:border-r border-zinc-800 p-6 flex flex-col gap-8 custom-scrollbar overflow-y-auto">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            <MapIcon size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">CityPaper</h1>
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-[0.2em]">城市地图壁纸生成器</p>
          </div>
        </div>

        {/* 城市选择 */}
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <MapPin size={12} /> 选择预设城市
            </label>
            <select
              value={city.id}
              onChange={handleCityChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
            >
              {PRESET_CITIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              <option value="custom">自定义位置</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Compass size={12} /> 精确经纬度调整
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="纬度"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-3 text-xs focus:outline-none focus:border-zinc-600"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600 font-mono">LAT</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  placeholder="经度"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-3 text-xs focus:outline-none focus:border-zinc-600"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600 font-mono">LNG</span>
              </div>
            </div>
            <button
              onClick={applyCoordinates}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold rounded-lg transition-colors border border-zinc-700/50"
            >
              应用坐标
            </button>
          </div>
        </div>

        {/* 样式自定义 */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Layout size={12} /> 地图风格
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MAP_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  className={`p-3 rounded-xl border text-xs font-medium transition-all text-left flex flex-col gap-1 ${
                    selectedStyle.id === style.id
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="opacity-90">{style.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">缩放级别 (Zoom)</label>
              <span className="text-[10px] font-mono text-zinc-400">{zoom}x</span>
            </div>
            <input
              type="range"
              min="10"
              max="18"
              step="0.5"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <div className="flex items-center gap-3">
              <Palette size={16} className="text-zinc-500" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold">主题强调色</span>
                <span className="text-[10px] text-zinc-500">点缀图标和边框颜色</span>
              </div>
            </div>
            <input 
              type="color" 
              value={city.accentColor} 
              onChange={handleColorChange}
              className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border-none"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <div className="flex items-center gap-3">
              <TypeIcon size={16} className="text-zinc-500" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold">排版文字叠加</span>
                <span className="text-[10px] text-zinc-500">在壁纸底部显示城市信息</span>
              </div>
            </div>
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`w-10 h-5 rounded-full transition-colors relative ${showLabels ? 'bg-indigo-600' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showLabels ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="mt-auto pt-6 flex flex-col gap-3">
          <button
            onClick={downloadWallpaper}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-xl"
          >
            <Download size={20} />
            获取壁纸照片
          </button>
          <p className="text-[10px] text-zinc-500 text-center px-4 leading-relaxed">
            数据来源：OpenStreetMap & CartoDB<br/>
            适配屏幕比例 9:20 / 9:16
          </p>
        </div>
      </aside>

      {/* 预览区 */}
      <main className="flex-1 relative flex items-center justify-center p-6 md:p-12 overflow-hidden bg-[radial-gradient(circle_at_center,_#111_0%,_#050505_100%)]">
        
        {/* 背景光晕 */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-10 transition-colors duration-1000"
          style={{ backgroundColor: city.accentColor }}
        />

        {/* 手机边框容器 */}
        <div className="relative w-full max-w-[340px] aspect-[9/19] animate-float drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)]">
          <MapPreview 
            city={city} 
            style={selectedStyle} 
            zoom={zoom} 
            showLabels={showLabels} 
          />
          
          {/* 屏幕光影遮罩 */}
          <div className="absolute inset-[8px] rounded-[2.2rem] pointer-events-none bg-gradient-to-tr from-white/5 to-transparent opacity-20" />
        </div>

        {/* 快速设置按钮 */}
        <div className="absolute top-6 right-6">
           <button 
             onClick={() => {
                const currentIndex = MAP_STYLES.findIndex(s => s.id === selectedStyle.id);
                setSelectedStyle(MAP_STYLES[(currentIndex + 1) % MAP_STYLES.length]);
             }}
             className="p-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-full hover:bg-zinc-800 transition-all text-zinc-300 shadow-xl"
             title="快速切换主题"
           >
             <RefreshCcw size={18} />
           </button>
        </div>

        {/* 底部装饰文字 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-medium text-zinc-600 uppercase tracking-[0.4em] bg-black/40 px-6 py-2 rounded-full backdrop-blur-sm border border-white/5">
          <Settings size={12} className="animate-spin-slow" /> HD WALLPAPER RENDERER
        </div>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.02); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
