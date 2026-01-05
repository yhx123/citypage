
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Download, Settings, Map as MapIcon, RefreshCcw, Layout, Share2, Info, ExternalLink } from 'lucide-react';
import MapPreview from './components/MapPreview';
import { searchCity } from './services/geminiService';
import { CityInfo, MapMode } from './types';
import { MAP_STYLES, DEFAULT_CITY } from './constants';

const App: React.FC = () => {
  const [city, setCity] = useState<CityInfo>(DEFAULT_CITY);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(MAP_STYLES[0]);
  const [zoom, setZoom] = useState(13);
  const [showLabels, setShowLabels] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await searchCity(searchQuery);
      setCity(result);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try another city.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadWallpaper = () => {
    // In a real browser environment, we'd use html2canvas or similar.
    // For this demo, we'll alert the user.
    alert(`Ready to download ${city.name} wallpaper! \n\nStyle: ${selectedStyle.name}\nResolution: 1440x3200 (Optimized for Mobile)`);
  };

  const toggleMode = () => {
    const currentIndex = MAP_STYLES.findIndex(s => s.id === selectedStyle.id);
    const nextIndex = (currentIndex + 1) % MAP_STYLES.length;
    setSelectedStyle(MAP_STYLES[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row overflow-hidden">
      
      {/* Left Sidebar: Controls */}
      <aside className="w-full md:w-[400px] border-b md:border-b-0 md:border-r border-zinc-800 p-6 flex flex-col gap-8 custom-scrollbar overflow-y-auto">
        
        {/* Logo & Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl">
            <MapIcon size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">CityPaper</h1>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Map Wallpaper Gen</p>
          </div>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city (e.g. Paris, New York)..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400" size={18} />
          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <RefreshCcw size={16} className="animate-spin text-indigo-500" />
            </div>
          )}
        </form>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <Info size={14} />
            {error}
          </div>
        )}

        {/* Customization Options */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Layout size={12} /> Appearance Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MAP_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  className={`p-3 rounded-xl border text-xs font-medium transition-all text-left flex flex-col gap-1 ${
                    selectedStyle.id === style.id
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800'
                  }`}
                >
                  <span className="opacity-90">{style.name}</span>
                  <div className="flex gap-1 mt-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: style.textColor }}></div>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: style.bgColor }}></div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Map Zoom</label>
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
            <div className="flex flex-col">
              <span className="text-xs font-semibold">Typography Overlay</span>
              <span className="text-[10px] text-zinc-500">Show city name and coordinates</span>
            </div>
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`w-12 h-6 rounded-full transition-colors relative ${showLabels ? 'bg-indigo-600' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${showLabels ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Grounding Sources (Mandatory per Gemini API Guidelines) */}
          {city.sourceUrls && city.sourceUrls.length > 0 && (
            <div className="space-y-3 pt-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <ExternalLink size={12} /> Map Data Sources
              </label>
              <div className="flex flex-col gap-2">
                {city.sourceUrls.map((url, idx) => (
                  <a 
                    key={idx} 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-zinc-400 hover:text-indigo-400 flex items-center gap-2 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50 transition-colors truncate"
                  >
                    <Info size={10} className="shrink-0" />
                    <span className="truncate">{url}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-6 flex flex-col gap-3">
          <button
            onClick={downloadWallpaper}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-xl"
          >
            <Download size={20} />
            Download Wallpaper
          </button>
          <p className="text-[10px] text-zinc-500 text-center px-4 leading-relaxed">
            Optimized for 9:16 aspect ratio (1440 × 3200 px). 
            Powered by Gemini AI and OpenStreetMap contributors.
          </p>
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 relative flex items-center justify-center p-6 md:p-12 overflow-hidden bg-[radial-gradient(circle_at_center,_#111_0%,_#050505_100%)]">
        
        {/* Background Ambient Glow */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 transition-colors duration-1000"
          style={{ backgroundColor: city.accentColor }}
        />

        {/* The Phone Frame */}
        <div className="relative w-full max-w-[340px] aspect-[9/19] animate-float">
          <MapPreview 
            city={city} 
            style={selectedStyle} 
            zoom={zoom} 
            showLabels={showLabels} 
          />
          
          {/* Subtle Phone Gloss */}
          <div className="absolute inset-[8px] rounded-[2.2rem] pointer-events-none bg-gradient-to-tr from-white/5 to-transparent opacity-30" />
        </div>

        {/* Floating Controls (Mobile Overlay Toggle) */}
        <div className="absolute top-6 right-6 flex gap-2">
           <button 
             onClick={toggleMode}
             className="p-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-full hover:bg-zinc-800 transition-all text-zinc-300"
             title="Switch Theme"
           >
             <RefreshCcw size={18} />
           </button>
           <button 
             className="p-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-full hover:bg-zinc-800 transition-all text-zinc-300"
             title="Share"
           >
             <Share2 size={18} />
           </button>
        </div>

        {/* Bottom Hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-medium text-zinc-500 uppercase tracking-widest bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5">
          <Settings size={12} /> Preview Mode: High Definition
        </div>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;