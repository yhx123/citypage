
import React, { useState, useEffect, useRef } from 'react';
import { Download, Settings, Map as MapIcon, Layout, RefreshCcw, MapPin, Type as TypeIcon, Palette, Compass, List, Loader2, CheckCircle2, Bug, Monitor } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import MapPreview from './components/MapPreview';
import { CityInfo, MapStyle } from './types';
import { MAP_STYLES, PRESET_CITIES, DEFAULT_CITY } from './constants';

const RATIO_PRESETS = [
  { id: '9:16', name: '16:9 (Classic)', value: 9 / 16 },
  { id: '9:19', name: '19:9 (Standard)', value: 9 / 19 },
  { id: '9:19.5', name: '19.5:9 (Modern)', value: 9 / 19.5 },
  { id: '9:21', name: '21:9 (Ultrawide)', value: 9 / 21 },
];

const App: React.FC = () => {
  // 核心状态
  const [city, setCity] = useState<CityInfo>(DEFAULT_CITY);
  const [selectedStyle, setSelectedStyle] = useState(MAP_STYLES[0]);
  const [zoom, setZoom] = useState(13);
  const [showLabels, setShowLabels] = useState(true);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [isDebug, setIsDebug] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(RATIO_PRESETS[2]); // 默认 19.5:9
  
  // 导出状态
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0, cityName: '' });
  
  const [manualLat, setManualLat] = useState(DEFAULT_CITY.lat.toString());
  const [manualLng, setManualLng] = useState(DEFAULT_CITY.lng.toString());

  const previewRef = useRef<HTMLDivElement>(null);

  // --- 接口化逻辑：URL 同步 ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsDebug(params.get('debug') === 'true');

    const lat = parseFloat(params.get('lat') || '');
    const lng = parseFloat(params.get('lng') || '');
    const z = parseFloat(params.get('z') || '');
    const s = params.get('s');
    const c = params.get('c');
    const r = params.get('r');

    if (!isNaN(lat) && !isNaN(lng)) {
      setCity(prev => ({ ...prev, lat, lng, id: 'url-target', name: params.get('name') || '指定位置' }));
      setManualLat(lat.toString());
      setManualLng(lng.toString());
    }
    if (!isNaN(z)) setZoom(z);
    if (s) {
      const style = MAP_STYLES.find(st => st.id === s);
      if (style) setSelectedStyle(style);
    }
    if (c) setCity(prev => ({ ...prev, accentColor: `#${c}` }));
    if (r) {
      const preset = RATIO_PRESETS.find(p => p.id === r);
      if (preset) setAspectRatio(preset);
    }
  }, []);

  useEffect(() => {
    if (city.id === 'url-target') return;
    const params = new URLSearchParams(window.location.search);
    params.set('lat', city.lat.toFixed(6));
    params.set('lng', city.lng.toFixed(6));
    params.set('z', zoom.toString());
    params.set('s', selectedStyle.id);
    params.set('c', city.accentColor.replace('#', ''));
    params.set('r', aspectRatio.id);
    params.set('name', city.name);
    if (isDebug) params.set('debug', 'true');
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [city.lat, city.lng, zoom, selectedStyle, city.accentColor, city.name, isDebug, aspectRatio]);

  const captureAndDownload = async (targetElement: HTMLElement, fileName: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const dataUrl = await htmlToImage.toPng(targetElement, {
        quality: 1,
        pixelRatio: 3,
      });
      const link = document.createElement('a');
      link.download = `${fileName}_${aspectRatio.id.replace(':', 'x')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('导出失败:', err);
    }
  };

  const runBatchExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportProgress({ current: 0, total: PRESET_CITIES.length, cityName: '' });

    for (let i = 0; i < PRESET_CITIES.length; i++) {
      const targetCity = PRESET_CITIES[i];
      setExportProgress(prev => ({ ...prev, current: i + 1, cityName: targetCity.name }));
      setCity({ ...targetCity, accentColor: city.accentColor });
      if (previewRef.current) {
        await captureAndDownload(previewRef.current, `Batch_${targetCity.name}`);
      }
    }
    setIsExporting(false);
  };

  return (
    <div className={`min-h-screen bg-[#050505] text-white flex flex-col md:flex-row overflow-hidden ${isExporting ? 'exporting-active' : ''}`}>
      
      <aside className="w-full md:w-[400px] border-b md:border-b-0 md:border-r border-zinc-800 p-6 flex flex-col gap-8 custom-scrollbar overflow-y-auto z-50 bg-[#050505] no-export">
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            <MapIcon size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">CityPaper</h1>
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-[0.2em]">API Interface Engine</p>
          </div>
        </div>

        {isDebug && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2 animate-pulse">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-[10px] uppercase">
              <Bug size={12} /> Debug API Console
            </div>
            <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-amber-200/60">
              <div>LAT: {city.lat}</div>
              <div>LNG: {city.lng}</div>
              <div>STYLE: {selectedStyle.id}</div>
              <div>RATIO: {aspectRatio.id}</div>
            </div>
          </div>
        )}

        <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
          <button data-testid="mode-single" onClick={() => setIsBatchMode(false)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${!isBatchMode ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>单个编辑</button>
          <button data-testid="mode-batch" onClick={() => setIsBatchMode(true)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${isBatchMode ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>批量预览</button>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">屏幕比例 (API: r)</label>
            <div className="grid grid-cols-2 gap-2">
              {RATIO_PRESETS.map((p) => (
                <button 
                  key={p.id} 
                  onClick={() => setAspectRatio(p)} 
                  className={`py-2 px-3 rounded-xl border text-[10px] font-bold transition-all ${aspectRatio.id === p.id ? 'bg-zinc-100 text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {!isBatchMode && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">选择城市</label>
                <select data-testid="city-select" value={city.id} onChange={(e) => {
                  const s = PRESET_CITIES.find(c => c.id === e.target.value);
                  if (s) { setCity(s); setManualLat(s.lat.toString()); setManualLng(s.lng.toString()); }
                }} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm appearance-none cursor-pointer">
                  {PRESET_CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">坐标输入接口</label>
                <div className="grid grid-cols-2 gap-2">
                  <input data-testid="input-lat" type="text" value={manualLat} onChange={(e) => setManualLat(e.target.value)} className="bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-3 text-xs" />
                  <input data-testid="input-lng" type="text" value={manualLng} onChange={(e) => setManualLng(e.target.value)} className="bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-3 text-xs" />
                </div>
                <button data-testid="btn-apply" onClick={() => setCity({ ...city, id: 'custom', lat: parseFloat(manualLat), lng: parseFloat(manualLng) })} className="w-full py-2 bg-zinc-800 text-zinc-300 text-[10px] font-bold rounded-lg">应用参数</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">风格切换</label>
            <div className="grid grid-cols-2 gap-2">
              {MAP_STYLES.map((style) => (
                <button data-testid={`style-${style.id}`} key={style.id} onClick={() => setSelectedStyle(style)} className={`p-3 rounded-xl border text-xs font-medium transition-all ${selectedStyle.id === style.id ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
                  {style.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <button
            data-testid="btn-download"
            onClick={isBatchMode ? runBatchExport : async () => {
              if (previewRef.current) {
                setIsExporting(true);
                await captureAndDownload(previewRef.current, `City_${city.name}`);
                setIsExporting(false);
              }
            }}
            disabled={isExporting}
            className={`w-full py-4 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all ${isExporting ? 'bg-zinc-800 text-zinc-500' : 'bg-white text-black hover:bg-zinc-200'}`}
          >
            {isExporting ? <Loader2 className="animate-spin" /> : <Download size={20} />}
            {isExporting ? '接口导出中...' : '启动下载接口'}
          </button>
        </div>
      </aside>

      <main className={`flex-1 relative bg-[radial-gradient(circle_at_center,_#111_0%,_#050505_100%)] ${isBatchMode ? 'overflow-y-auto custom-scrollbar' : 'flex items-center justify-center p-8'}`}>
        {!isBatchMode ? (
          <div 
            ref={previewRef} 
            data-testid="wallpaper-canvas" 
            className="relative w-full max-w-[340px] animate-float drop-shadow-2xl"
            style={{ aspectRatio: aspectRatio.id.replace(':', '/') }}
          >
            <MapPreview city={city} style={selectedStyle} zoom={zoom} showLabels={showLabels} />
          </div>
        ) : (
          <div className="w-full py-20 flex flex-col items-center gap-20">
            {PRESET_CITIES.map(c => (
              <div key={c.id} className="w-[340px] relative" style={{ aspectRatio: aspectRatio.id.replace(':', '/') }}>
                <MapPreview city={{...c, accentColor: city.accentColor}} style={selectedStyle} zoom={zoom} showLabels={showLabels} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
