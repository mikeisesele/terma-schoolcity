'use client';

/// <reference types="@types/google.maps" />

import { useEffect, useRef, useState } from 'react';

interface SchoolMapProps {
  lat: number;
  lng: number;
  schoolName: string;
}

let scriptLoading = false;
const pendingCallbacks: (() => void)[] = [];

function loadGoogleMaps(apiKey: string, callback: () => void) {
  if (window.google?.maps) { callback(); return; }
  pendingCallbacks.push(callback);
  if (scriptLoading) return;
  scriptLoading = true;
  (window as unknown as Record<string, unknown>).__gmapInit = () => {
    pendingCallbacks.splice(0).forEach(cb => cb());
  };
  const s = document.createElement('script');
  s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=__gmapInit`;
  s.async = true;
  s.defer = true;
  document.head.appendChild(s);
}

export function SchoolMap({ lat, lng, schoolName }: SchoolMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<google.maps.Map | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey || !containerRef.current) return;

    loadGoogleMaps(apiKey, () => {
      if (!containerRef.current || mapRef.current) return;

      const map = new google.maps.Map(containerRef.current, {
        center: { lat, lng },
        zoom: 16,
        mapTypeControl: false,
        streetViewControl: true,
        fullscreenControl: true,
        gestureHandling: 'cooperative',
        styles: [
          { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
        ],
      });
      mapRef.current = map;

      // School marker — forest green
      const schoolMarker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title: schoolName,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 10,
          fillColor: '#1A3D2C',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        zIndex: 10,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="font-family:sans-serif;font-size:13px;font-weight:700;color:#1A3D2C;line-height:1.4">${schoolName}</div>`,
      });
      schoolMarker.addListener('click', () => infoWindow.open(map, schoolMarker));
      infoWindow.open(map, schoolMarker);

      // Geolocation
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            const { latitude: uLat, longitude: uLng } = pos.coords;
            setUserPos({ lat: uLat, lng: uLng });

            new google.maps.Marker({
              position: { lat: uLat, lng: uLng },
              map,
              title: 'Your location',
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 9,
                fillColor: '#2563EB',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3,
              },
              zIndex: 9,
            });

            // Dashed gold line user → school
            new google.maps.Polyline({
              path: [{ lat: uLat, lng: uLng }, { lat, lng }],
              map,
              strokeColor: '#B87D20',
              strokeOpacity: 0,
              strokeWeight: 0,
              icons: [{
                icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3 },
                offset: '0',
                repeat: '14px',
              }],
            });

            // Fit bounds to show both markers
            const bounds = new google.maps.LatLngBounds();
            bounds.extend({ lat: uLat, lng: uLng });
            bounds.extend({ lat, lng });
            map.fitBounds(bounds, 50);
          },
          () => { /* location denied — school-only view is fine */ },
          { timeout: 8000, enableHighAccuracy: false },
        );
      }
    });

    return () => {
      mapRef.current = null;
    };
  // lat/lng/schoolName stable for the lifetime of this page view
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: 420 }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {userPos && (
        <div style={{
          position: 'absolute', bottom: 40, left: 12, zIndex: 5,
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
