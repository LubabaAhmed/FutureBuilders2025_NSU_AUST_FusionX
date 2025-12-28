
import { Shelter, Broadcast } from './types';

export const MOCK_SHELTERS: Shelter[] = [
  { id: '1', name: 'Rangamati General Hospital', type: 'hospital', lat: 22.6485, lng: 92.1747, capacity: 500, currentOccupancy: 420 },
  { id: '2', name: 'Kaptai Primary School Shelter', type: 'shelter', lat: 22.5005, lng: 92.2173, capacity: 300, currentOccupancy: 120 },
  { id: '3', name: 'Safe Zone Alpha - Sajek Valley', type: 'safe-zone', lat: 23.3855, lng: 92.2905, capacity: 1000, currentOccupancy: 150 },
  { id: '4', name: 'Bandarban Medical College', type: 'hospital', lat: 22.1936, lng: 92.2179, capacity: 400, currentOccupancy: 380 },
];

export const MOCK_BROADCASTS: Broadcast[] = [
  { id: 'b1', authority: 'Emergency Response BD', message: 'Heavy rainfall warning for Chittagong Hill Tracts. Avoid landslide-prone areas.', type: 'warning', timestamp: Date.now() - 3600000 },
  { id: 'b2', authority: 'Flood Control Dept', message: 'Water levels in Kaptai Lake are rising. Residents in low-lying areas should relocate.', type: 'critical', timestamp: Date.now() - 7200000 },
];

export const APP_THEME = {
  primary: '#EF4444', // Emergency Red
  secondary: '#1E1B4B', // Deep Indigo
  accent: '#F59E0B', // Warning Amber
};
