
import React, { useEffect, useRef, useState } from 'react';
import { User, SOSAlert, Shelter } from '../types';
import { MOCK_SHELTERS } from '../constants';
import { getNearbyHospitals } from '../services/geminiService';
import { MapPin, Navigation, Crosshair, Loader2, Hospital, UserCheck, Stethoscope as StethoscopeIcon } from 'lucide-react';

interface MapProps {
  user: User;
  alerts: SOSAlert[];
}

const EmergencyMap: React.FC<MapProps> = ({ user, alerts }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [currentHospitals, setCurrentHospitals] = useState<any[]>([]);
  const [locationStatus, setLocationStatus] = useState<string>('অবস্থান খোঁজা হচ্ছে...');

  const initMap = (lat: number, lng: number) => {
    if (!mapContainer.current || mapInstance.current) return;

    const L = (window as any).L;
    mapInstance.current = L.map(mapContainer.current, {
      zoomControl: false
    }).setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors, Humanitarian OpenStreetMap Team'
    }).addTo(mapInstance.current);

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);

    const userIcon = L.divIcon({
      className: 'user-marker-icon',
      html: `
        <div class="relative flex h-10 w-10 items-center justify-center">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20"></span>
          <div class="relative w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
        </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
    userMarkerRef.current = L.marker([lat, lng], { icon: userIcon }).addTo(mapInstance.current)
      .bindPopup("আপনি এখানে আছেন")
      .openPopup();

    MOCK_SHELTERS.forEach(shelter => {
      let iconHtml = '';
      let color = '#374151'; // Default

      if (shelter.type === 'hospital') {
        color = '#ef4444';
        iconHtml = `<div style="background-color: ${color}; padding: 6px; border-radius: 10px; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white;">H</div>`;
      } else if (shelter.type === 'shelter') {
        color = '#f59e0b';
        iconHtml = `<div style="background-color: ${color}; padding: 6px; border-radius: 10px; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white;">S</div>`;
      } else if (shelter.type === 'doctor') {
        color = '#3b82f6';
        iconHtml = `<div style="background-color: ${color}; padding: 6px; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 1.8-1.7Z"/><path d="M10 13h4"/><path d="M12 11v4"/></svg></div>`;
      } else if (shelter.type === 'volunteer') {
        color = '#10b981';
        iconHtml = `<div style="background-color: ${color}; padding: 6px; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg></div>`;
      } else {
        color = '#10b981';
        iconHtml = `<div style="background-color: ${color}; padding: 6px; border-radius: 10px; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white;">Z</div>`;
      }

      const icon = L.divIcon({
        className: 'shelter-icon',
        html: iconHtml,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      L.marker([shelter.lat, shelter.lng], { icon }).addTo(mapInstance.current)
        .bindPopup(`
          <div class="p-3 font-sans min-w-[160px]">
            <h3 class="font-black text-slate-900 leading-tight">${shelter.name}</h3>
            <p class="text-[10px] text-slate-500 font-black uppercase mt-1 tracking-wider">${shelter.type.toUpperCase()}${shelter.specialty ? ` • ${shelter.specialty}` : ''}</p>
            ${shelter.capacity ? `
            <div class="mt-3">
              <div class="flex justify-between text-[10px] font-black mb-1">
                <span>ধারণক্ষমতা</span>
                <span>${shelter.currentOccupancy}/${shelter.capacity}</span>
              </div>
              <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div class="bg-red-500 h-full transition-all duration-1000" style="width: ${(shelter.currentOccupancy! / shelter.capacity) * 100}%"></div>
              </div>
            </div>` : ''}
            ${shelter.phone ? `
            <div class="mt-3 flex items-center space-x-2">
              <a href="tel:${shelter.phone}" class="flex-1 bg-indigo-900 text-white py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-center">কল করুন</a>
              <button class="bg-slate-100 p-2 rounded-xl text-indigo-950"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg></button>
            </div>` : `
            <button class="w-full mt-4 bg-indigo-900 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">দিকনির্দেশনা</button>
            `}
          </div>
        `);
    });
  };

  const fetchHospitals = async (lat: number, lng: number) => {
    setLocationStatus('আশেপাশের হাসপাতাল খোঁজা হচ্ছে...');
    const result = await getNearbyHospitals(lat, lng);
    setCurrentHospitals(result.hospitals);

    const L = (window as any).L;
    result.hospitals.forEach((h: any) => {
      const icon = L.divIcon({
        className: 'hospital-marker',
        html: `
          <div class="bg-red-600 p-2 rounded-full text-white shadow-xl border-2 border-white transform hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 1.8-1.7Z"/><path d="M10 13h4"/><path d="M12 11v4"/></svg>
          </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker([h.lat, h.lng], { icon }).addTo(mapInstance.current)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-slate-900">${h.name}</h3>
            <p class="text-[10px] text-red-600 font-black mt-1">গুগল ম্যাপস থেকে যাচাইকৃত</p>
            <a href="${h.uri}" target="_blank" class="block mt-3 bg-red-50 text-red-600 text-center py-2 rounded-xl text-[10px] font-black border border-red-100">ম্যাপে দেখুন</a>
          </div>
        `);
    });
    setLoadingLocation(false);
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('জিওলোকেশন সমর্থন করে না');
      initMap(22.6485, 92.1747);
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        initMap(latitude, longitude);
        fetchHospitals(latitude, longitude);
      },
      (error) => {
        setLocationStatus('অবস্থান পেতে ব্যর্থ। ডিফল্ট ম্যাপ লোড হচ্ছে।');
        initMap(22.6485, 92.1747);
        fetchHospitals(22.6485, 92.1747);
      }
    );

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    const L = (window as any).L;

    alerts.forEach(alert => {
      const icon = L.divIcon({
        className: 'sos-marker',
        html: `
          <div class="relative flex h-10 w-10">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-10 w-10 bg-red-600 text-white items-center justify-center font-black text-xs border-2 border-white shadow-2xl rotate-12">SOS</span>
          </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      L.marker([alert.location.lat, alert.location.lng], { icon }).addTo(mapInstance.current)
        .bindPopup(`
          <div class="p-4 bg-white rounded-3xl min-w-[180px]">
            <div class="flex items-center space-x-2 mb-2">
              <div class="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              <h3 class="font-black text-red-600 text-base italic uppercase italic">সরাসরি SOS</h3>
            </div>
            <p class="font-bold text-slate-800 text-sm">${alert.userName}</p>
            <p class="text-xs text-slate-500 mt-2 leading-tight">"${alert.details}"</p>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span class="text-[9px] font-black uppercase text-indigo-600 tracking-widest">${alert.priority} Priority</span>
              <button class="bg-red-600 text-white p-2 rounded-xl active:scale-90 transition-transform"><Navigation size={14}/></button>
            </div>
          </div>
        `);
    });
  }, [alerts]);

  const recenter = () => {
    if (mapInstance.current && userMarkerRef.current) {
      mapInstance.current.setView(userMarkerRef.current.getLatLng(), 15, { animate: true });
    }
  };

  return (
    <div className="h-full w-full relative">
      <div ref={mapContainer} className="h-full w-full bg-slate-100" />
      
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col space-y-2 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/50 p-5 pointer-events-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-950 rounded-2xl shadow-lg text-white">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="text-base font-black text-indigo-950 italic tracking-tighter">সুরক্ষিত মানচিত্র (Safe Map)</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${loadingLocation ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">{locationStatus}</p>
              </div>
            </div>
          </div>
          <button onClick={recenter} className="p-4 bg-slate-50 text-indigo-950 rounded-2xl hover:bg-white active:scale-90 transition-all border border-slate-100">
            <Crosshair size={24} />
          </button>
        </div>
      </div>

      {loadingLocation && (
        <div className="absolute inset-0 z-[1001] bg-white/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 p-8 rounded-[3rem] shadow-2xl flex flex-col items-center space-y-4 border border-white/50">
            <Loader2 className="w-10 h-10 text-indigo-950 animate-spin" />
            <p className="text-xs font-black text-indigo-950 uppercase tracking-widest">লোডিং লাইভ ম্যাপ...</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 left-4 z-[1000] pointer-events-none max-w-[200px]">
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-[2.5rem] shadow-2xl border border-white/50 pointer-events-auto">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">নিকটস্থ তথ্য</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-red-600" />
                <span className="text-[11px] font-black text-slate-800 italic">হাসপাতাল/ডাক্তার</span>
              </div>
              <span className="text-xs font-black text-red-600">{currentHospitals.length + MOCK_SHELTERS.filter(s => s.type === 'hospital' || s.type === 'doctor').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[11px] font-black text-slate-800 italic">স্বেচ্ছাসেবক</span>
              </div>
              <span className="text-xs font-black text-green-600">{MOCK_SHELTERS.filter(s => s.type === 'volunteer').length}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="text-[11px] font-black text-red-600 italic uppercase">সক্রিয় SOS</span>
              </div>
              <span className="text-xs font-black text-red-600">{alerts.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMap;
