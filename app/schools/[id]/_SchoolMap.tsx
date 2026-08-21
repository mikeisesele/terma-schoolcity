'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

interface SchoolMapProps {
  lat: number;
  lng: number;
  schoolName: string;
}

export function SchoolMap({ lat, lng, schoolName }: SchoolMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let map: ReturnType<typeof import('leaflet')['map']> | null = null;

    import('leaflet').then(L => {
      if (!containerRef.current || mapRef.current) return;

      // Fix default marker icon paths broken by Next.js bundling
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      mapRef.current = map;

      // OpenStreetMap tiles — free, no API key
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // School marker with popup
      const schoolIcon = L.divIcon({
        html: `<div style="width:36px;height:36px;border-radius:50%;background:#1A3D2C;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;font-size:18px">🏫</div>`,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -40],
      });

      map.addLayer(
        L.marker([lat, lng], { icon: schoolIcon })
          .bindPopup(`<strong style="font-size:13px;line-height:1.4">${schoolName}</strong>`, { closeButton: false })
          .openPopup()
      );

      // Request user location
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            if (!map) return;
            const { latitude: uLat, longitude: uLng } = pos.coords;
            setUserPos({ lat: uLat, lng: uLng });

            const userIcon = L.divIcon({
              html: `<div style="width:16px;height:16px;border-radius:50%;background:#2563EB;border:3px solid #fff;box-shadow:0 0 0 4px rgba(37,99,235,.25)"></div>`,
              className: '',
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            });

            map.addLayer(
              L.marker([uLat, uLng], { icon: userIcon })
                .bindTooltip('You are here', { direction: 'top' })
            );

            // Dashed line user → school
            map.addLayer(
              L.polyline([[uLat, uLng], [lat, lng]], {
                color: '#B87D20',
                weight: 2,
                dashArray: '6 6',
                opacity: 0.65,
              })
            );

            // Fit bounds to show both markers with padding
            const bounds = L.latLngBounds([[uLat, uLng], [lat, lng]]);
            map.fitBounds(bounds, { padding: [44, 44], maxZoom: 16 });
          },
          () => { /* denied — school-only view is fine */ },
          { timeout: 8000, enableHighAccuracy: false },
        );
      }
    });

    return () => {
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove();
        mapRef.current = null;
      }
    };
  // lat/lng are stable once mounted; schoolName is a label
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: 420 }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {userPos && (
        <div style={{
          position: 'absolute', bottom: 12, left: 12, zIndex: 1000,
          background: 'rgba(255,255,255,0.92)', borderRadius: 8,
          padding: '5px 10px', fontSize: 12, color: '#1A1A1A',
          boxShadow: '0 1px 6px rgba(0,0,0,.18)',
          pointerEvents: 'none',
          backdropFilter: 'blur(4px)',
        }}>
          📍 Your location shown
        </div>
      )}
    </div>
  );
}
