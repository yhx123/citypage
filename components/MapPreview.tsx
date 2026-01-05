
import React, { useEffect, useRef, useState } from 'react';
import { CityInfo, MapStyle } from '../types';

interface MapPreviewProps {
  city: CityInfo;
  style: MapStyle;
  zoom: number;
  showLabels: boolean;
}

const MapPreview: React.FC<MapPreviewProps> = ({ city, style, zoom, showLabels }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  // 轮询检查 Leaflet 是否就绪
  useEffect(() => {
    let timer: number;
    const checkL = () => {
      if ((window as any).L) {
        setIsLeafletReady(true);
      } else {
        timer = window.setTimeout(checkL, 50);
      }
    };
    checkL();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current) return;

    try {
      const L = (window as any).L;

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapContainerRef.current, {
          center: [city.lat, city.lng],
          zoom: zoom,
          zoomControl: false,
          attributionControl: false,
          fadeAnimation: false,
          zoomAnimation: false
        });
      }

      const map = mapInstanceRef.current;
      map.setView([city.lat, city.lng], zoom);

      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }

      layerRef.current = L.tileLayer(style.url, {
        attribution: style.attribution,
        crossOrigin: true
      }).addTo(map);

      // 关键：强制延迟刷新尺寸以应对容器动画
      setTimeout(() => map.invalidateSize(), 200);
      
    } catch (err) {
      console.error("Leaflet Init Error:", err);
      setError("地图渲染引擎初始化失败");
    }

  }, [isLeafletReady, city.lat, city.lng, style, zoom]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-[2.5rem] bg-[#111] border-[8px] border-zinc-900 ring-1 ring-zinc-800 shadow-2xl">
      {/* 真正承载 Leaflet 的容器 */}
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 w-full h-full z-0"
        style={{ height: '100%', width: '100%' }}
      />
      
      {/* 遮罩层 */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/10 via-transparent to-black/30 z-10" />

      {/* 标签 */}
      {showLabels && (
        <div 
          className="absolute bottom-16 left-0 right-0 px-8 flex flex-col items-center text-center z-20 pointer-events-none"
          style={{ color: style.textColor }}
        >
          <div className="w-10 h-[2px] mb-4 opacity-40" style={{ backgroundColor: city.accentColor }} />
          <h1 className="text-4xl font-extrabold tracking-widest drop-shadow-2xl">
            {city.name}
          </h1>
          <p className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40 mt-2">
            {city.country}
          </p>
          <div className="mt-4 flex flex-col items-center opacity-20">
            <p className="text-[8px] font-mono tracking-tighter">
              {city.lat.toFixed(4)}° N / {city.lng.toFixed(4)}° E
            </p>
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 p-4 text-center">
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}

      {!isLeafletReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 z-50">
          <div className="text-zinc-500 text-[10px] animate-pulse uppercase tracking-widest">Engine Loading...</div>
        </div>
      )}
    </div>
  );
};

export default MapPreview;
