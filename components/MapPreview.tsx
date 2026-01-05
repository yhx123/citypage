
import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      // @ts-ignore (Leaflet is loaded via script tag)
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        center: [city.lat, city.lng],
        zoom: zoom,
        zoomControl: false,
        attributionControl: false
      });
    }

    // Update center and zoom
    mapInstanceRef.current.setView([city.lat, city.lng], zoom);

    // Update tile layer
    if (layerRef.current) {
      mapInstanceRef.current.removeLayer(layerRef.current);
    }

    // @ts-ignore
    layerRef.current = L.tileLayer(style.url, {
      attribution: style.attribution
    }).addTo(mapInstanceRef.current);

    return () => {
      // Clean up on unmount logic if needed
    };
  }, [city.lat, city.lng, style, zoom]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem] shadow-2xl bg-black border-[8px] border-zinc-900 ring-1 ring-zinc-800">
      {/* Map Layer */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full grayscale-[0.2] contrast-[1.1]" />
      
      {/* Overlay Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* City Information Labels */}
      {showLabels && (
        <div 
          className="absolute bottom-16 left-0 right-0 px-8 flex flex-col items-center text-center z-10 animate-fade-in pointer-events-none"
          style={{ color: style.textColor }}
        >
          <div className="w-12 h-[2px] mb-5 opacity-50" style={{ backgroundColor: city.accentColor }} />
          <h1 className="text-5xl font-extrabold tracking-[0.1em] leading-none drop-shadow-lg">
            {city.name}
          </h1>
          <p className="text-xs font-bold tracking-[0.5em] uppercase opacity-50 mt-2 drop-shadow-md">
            {city.country}
          </p>
          <div className="mt-6 flex flex-col items-center opacity-30">
            <p className="text-[9px] font-mono tracking-widest leading-relaxed">
              {city.lat.toFixed(4)}° N / {city.lng.toFixed(4)}° E
            </p>
          </div>
          <p className="mt-8 text-[11px] font-light tracking-[0.05em] max-w-[85%] opacity-80 leading-relaxed border-t border-white/10 pt-4">
            {city.description}
          </p>
        </div>
      )}

      {/* Minimalist Grid Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
    </div>
  );
};

export default MapPreview;
