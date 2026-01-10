
import React, { useEffect, useRef, useState } from 'react';
import { CityInfo, MapStyle } from '../types';

interface MapPreviewProps {
  city: CityInfo;
  style: MapStyle;
  zoom: number;
  showLabels: boolean;
  onMapClick?: (lat: number, lng: number) => void;
}

const MapPreview: React.FC<MapPreviewProps> = ({ city, style, zoom, showLabels, onMapClick }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  // 轮询检查 Leaflet 全局变量是否就绪
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

      // 如果实例不存在则创建
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapContainerRef.current, {
          center: [city.lat, city.lng],
          zoom: zoom,
          zoomControl: false,
          attributionControl: false,
          fadeAnimation: false,
          zoomAnimation: false,
          markerZoomAnimation: false
        });

        // 添加点击事件监听
        mapInstanceRef.current.on('click', (e: any) => {
          if (onMapClick) {
            onMapClick(e.latlng.lat, e.latlng.lng);
          }
        });
      }

      const map = mapInstanceRef.current;

      // 更新视图
      map.setView([city.lat, city.lng], zoom);

      // 清除旧图层并添加新风格图层
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }

      layerRef.current = L.tileLayer(style.url, {
        attribution: style.attribution,
        crossOrigin: true // 必须开启 CORS 才能让 html-to-image 正常工作
      }).addTo(map);

      // 关键：确保在 DOM 稳定后刷新地图尺寸，防止黑屏
      const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);

      return () => resizeObserver.disconnect();

    } catch (err) {
      console.error("Leaflet Error:", err);
      setError("地图引擎加载异常");
    }

  }, [isLeafletReady, city.lat, city.lng, style, zoom]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* 真正承载地图的层 */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{ background: '#0a0a0a' }}
      />

      {/* 渐变遮罩层（增强文字可读性） */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/10 via-transparent to-black/50 z-10" />

      {/* 信息标签层 */}
      {showLabels && (
        <div
          className="absolute bottom-[10%] left-0 right-0 px-10 flex flex-col items-center text-center z-20 pointer-events-none"
          style={{ color: style.textColor }}
        >
          {/* 装饰线条 */}
          <div className="w-10 h-[2px] mb-6 opacity-80" style={{ backgroundColor: city.accentColor }} />

          {/* 城市名称 */}
          <h1 className="text-5xl font-black tracking-[0.15em] drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            {city.name}
          </h1>

          {/* 国家/副标题 */}
          <p className="text-[10px] font-bold tracking-[0.6em] uppercase opacity-40 mt-3 pl-[0.6em]">
            {city.country}
          </p>

          {/* 坐标信息 */}
          <div className="mt-6 opacity-30">
            <p className="text-[8px] font-mono tracking-widest">
              {city.lat.toFixed(4)}° N &nbsp; / &nbsp; {city.lng.toFixed(4)}° E
            </p>
          </div>

          {/* 城市评价/描述 - 重新添加的部分 */}
          <div className="mt-8 pt-6 border-t border-current/10 w-full max-w-[80%]">
            <p className="text-[11px] leading-relaxed tracking-wider font-light opacity-80 italic">
              {city.description}
            </p>
          </div>
        </div>
      )}

      {/* 错误或加载状态 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50 p-6">
          <p className="text-red-500 text-xs font-mono">{error}</p>
        </div>
      )}

      {!isLeafletReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050505] z-50">
          <div className="text-zinc-700 text-[10px] font-bold animate-pulse tracking-[0.3em] uppercase">Initializing Engine</div>
        </div>
      )}
    </div>
  );
};

export default MapPreview;
