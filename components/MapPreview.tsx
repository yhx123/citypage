
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
      // Don't destroy on every re-render to keep it smooth, 
      // but we should clean up on unmount
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
          <div className="w-12 h-[2px] mb-4 opacity-50" style={{ backgroundColor: city.accentColor }} />
          <h1 className="text-4xl font-extrabold tracking-tight uppercase leading-none drop-shadow-lg">
            {city.name}
          </h1>
          <p className="text-sm font-medium tracking-[0.3em] uppercase opacity-70 mt-1 drop-shadow-md">
            {city.country}
          </p>
          <div className="mt-4 flex flex-col items-center opacity-40">
            <p className="text-[10px] font-mono tracking-widest leading-relaxed">
              {city.lat.toFixed(4)}° N / {city.lng.toFixed(4)}° E
            </p>
          </div>
          <p className="mt-6 text-xs font-light tracking-wide italic max-w-[80%] opacity-80 leading-relaxed">
            "{city.description}"
          </p>
        </div>
      )}

      {/* Minimalist Grid Pattern Overlay (Optional Aesthetic) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
    </div>
  );
};

export default MapPreview;
