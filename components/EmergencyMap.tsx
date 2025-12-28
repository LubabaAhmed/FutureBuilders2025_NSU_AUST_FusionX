
import React, { useEffect, useRef } from 'react';
import { User, SOSAlert } from '../types';
import { MOCK_SHELTERS } from '../constants';

interface MapProps {
  user: User;
  alerts: SOSAlert[];
}

const EmergencyMap: React.FC<MapProps> = ({ user, alerts }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    // Use specific Hill Tracts coords (Rangamati)
    const initialLat = 22.6485;
    const initialLng = 92.1747;

    const L = (window as any).L;
    mapInstance.current = L.map(mapContainer.current, {
        zoomControl: false
    }).setView([initialLat, initialLng], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance.current);

    // Add zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);

    // Add user marker
    const userIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #3b82f6; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
      iconSize: [15, 15],
      iconAnchor: [7, 7]
    });
    L.marker([initialLat, initialLng], { icon: userIcon }).addTo(mapInstance.current)
      .bindPopup("Your Location")
      .openPopup();

    // Add mock shelters
    MOCK_SHELTERS.forEach(shelter => {
      const color = shelter.type === 'hospital' ? '#ef4444' : shelter.type === 'shelter' ? '#f59e0b' : '#10b981';
      const icon = L.divIcon({
        className: 'shelter-icon',
        html: `<div style="background-color: ${color}; padding: 6px; border-radius: 8px; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                ${shelter.type === 'hospital' ? 'H' : 'S'}
              </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker([shelter.lat, shelter.lng], { icon }).addTo(mapInstance.current)
        .bindPopup(`
          <div class="p-1">
            <h3 class="font-bold text-slate-900">${shelter.name}</h3>
            <p class="text-xs text-slate-500">${shelter.type.toUpperCase()}</p>
            <div class="mt-2 text-xs">
              Capacity: ${shelter.currentOccupancy}/${shelter.capacity}
              <div class="w-full bg-slate-200 h-1.5 rounded-full mt-1">
                <div class="bg-red-500 h-1.5 rounded-full" style="width: ${(shelter.currentOccupancy/shelter.capacity)*100}%"></div>
              </div>
            </div>
          </div>
        `);
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update alerts on map
  useEffect(() => {
    if (!mapInstance.current) return;
    const L = (window as any).L;

    alerts.forEach(alert => {
      const icon = L.divIcon({
        className: 'sos-marker',
        html: `<div class="relative flex h-8 w-8">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-8 w-8 bg-red-600 text-white items-center justify-center font-bold text-[10px]">SOS</span>
              </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker([alert.location.lat, alert.location.lng], { icon }).addTo(mapInstance.current)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-red-600">ACTIVE SOS: ${alert.userName}</h3>
            <p class="text-xs text-slate-600 mt-1">${alert.details}</p>
            <p class="text-[10px] text-slate-400 mt-2">AI Priority: <strong>${alert.priority}</strong></p>
          </div>
        `);
    });
  }, [alerts]);

  return (
    <div className="h-full w-full relative">
      <div ref={mapContainer} className="h-full w-full" />
      
      {/* Search and Filters Overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col space-y-2 pointer-events-none">
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg border border-slate-200 p-3 pointer-events-auto flex items-center space-x-3">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-indigo-950">HillShield Interactive Safe Map</h3>
            <p className="text-[10px] text-slate-500">Real-time shelter capacity & hazard zones</p>
          </div>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-white bg-red-500 flex items-center justify-center text-white text-[10px] font-bold">H</div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-amber-500 flex items-center justify-center text-white text-[10px] font-bold">S</div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-green-500 flex items-center justify-center text-white text-[10px] font-bold">Z</div>
          </div>
        </div>
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-6 left-4 z-[1000] pointer-events-none">
        <div className="bg-white/95 backdrop-blur p-4 rounded-2xl shadow-xl border border-slate-200 pointer-events-auto w-48">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nearby Status</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-700">Safe Shelters</span>
              <span className="text-xs font-bold text-green-600">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-700">Active SOS</span>
              <span className="text-xs font-bold text-red-600">{alerts.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-700">Mesh Nodes</span>
              <span className="text-xs font-bold text-indigo-600">24</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMap;
