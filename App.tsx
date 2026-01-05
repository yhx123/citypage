
import React, { useState, useEffect, useRef } from 'react';
import { Download, Map as MapIcon, Loader2, Bug } from 'lucide-react';
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
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [isDebug, setIsDebug] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(RATIO_PRESETS[2]);
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0 });
  
  const [manualLat, setManualLat] = useState(DEFAULT_CITY.lat.toString());
  const [manualLng, setManualLng] = useState(DEFAULT_CITY.lng.toString());

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsDebug(params.get('debug') === 'true');

    const latStr = params.get('lat');
    const lngStr = params.get('lng');
    const lat = parseFloat(latStr || '');
    const lng = parseFloat(lngStr || '');
    const z = parseFloat(params.get('z') || '');
    const s = params.get('s');
    const r = params.get('r');

    if (!isNaN(lat) && !isNaN(lng)) {
      setCity(prev => ({ ...prev, lat, lng, id: 'custom', name: params.get('name') || '自定义' }));
      setManualLat(lat.toString());
      setManualLng(lng.toString());
    }
    if (!isNaN(z)) setZoom(z);
    if (s) {
      const style = MAP_STYLES.find(st => st.id === s);
      if (style) setSelectedStyle(style);
    }
    if (r) {
      const preset = RATIO_PRESETS.find(p => p.id === r);
      if (preset) setAspectRatio(preset);
    }
  }, []);

  const captureAndDownload = async (targetElement: HTMLElement, fileName: string) => {
    try {
      // 稍微延长等待，确保瓦片完全加载
      await new Promise(resolve => setTimeout(resolve, 2000));
      const dataUrl = await htmlToImage.toPng(targetElement, {
        quality: 1,
        pixelRatio: 3,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export Failed:', err);
    }
  };

  const runBatchExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportProgress({ current: 0, total: PRESET_CITIES.length });

    for (let i = 0; i < PRESET_CITIES.length; i++) {
      const targetCity = PRESET_CITIES[i];
      setExportProgress({ current: i + 1, total: PRESET_CITIES.length });
      setCity(targetCity);
      if (previewRef.current) {
        await captureAndDownload(previewRef.current, `Wallpaper_${targetCity.name}`);
      }
    }
    setIsExporting(false);
  };

  return (
    <div className={`h-screen w-screen bg-[#050505] text-white flex flex-col md:flex-row overflow-hidden`}>
      
      <aside className="w-full md:w-[360px] border-r border-zinc-800/50 p-6 flex flex-col gap-8 z-50 bg-[#080808] no-export shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <MapIcon size={20} className="text-black" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tighter italic">CityPaper</h1>
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Engine v2.5</p>
          </div>
        </div>

        <div className="space-y-6 flex-1 custom-scrollbar overflow-y-auto pr-2">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">尺寸比例</label>
            <div className="grid grid-cols-2 gap-2">
              {RATIO_PRESETS.map((p) => (
                <button 
                  key={p.id} 
                  onClick={() => setAspectRatio(p)} 
                  className={`py-2 rounded-lg border text-[10px] font-bold transition-all ${aspectRatio.id === p.id ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                >
                  {p.id}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">选择城市</label>
            <select 
              value={city.id} 
              onChange={(e) => {
                const s = PRESET_CITIES.find(c => c.id === e.target.value);
                if (s) { setCity(s); setManualLat(s.lat.toString()); setManualLng(s.lng.toString()); }
              }} 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 px-3 text-xs outline-none focus:border-zinc-600 transition-colors"
            >
              {PRESET_CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">地图样式</label>
            <div className="grid grid-cols-2 gap-2">
              {MAP_STYLES.map((style) => (
                <button 
                  key={style.id} 
                  onClick={() => setSelectedStyle(style)} 
                  className={`py-2 px-1 rounded-lg border text-[10px] font-bold transition-all ${selectedStyle.id === style.id ? 'bg-zinc-200 text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-900">
          <button
            onClick={isBatchMode ? runBatchExport : async () => {
              if (previewRef.current) {
                setIsExporting(true);
                await captureAndDownload(previewRef.current, `City_${city.name}`);
                setIsExporting(false);
              }
            }}
            disabled={isExporting}
            className="w-full py-4 bg-white text-black font-black rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
            {isExporting ? `导出中 ${exportProgress.current}/${exportProgress.total}` : '下载高清壁纸'}
          </button>
        </div>
      </aside>

      <main className="flex-1 relative bg-[#050505] flex items-center justify-center p-6 md:p-12 overflow-hidden">
        {/* 背景光晕 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none" />
        
        <div 
          ref={previewRef} 
          data-testid="wallpaper-canvas" 
          className="relative w-full max-w-[320px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] transition-all duration-700"
          style={{ 
            aspectRatio: aspectRatio.id.replace(':', '/'),
            maxHeight: '85vh'
          }}
        >
          <MapPreview city={city} style={selectedStyle} zoom={zoom} showLabels={showLabels} />
        </div>
      </main>
    </div>
  );
};

export default App;
