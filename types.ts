
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'responder' | 'authority';
  location?: { lat: number; lng: number };
  medicalHistory?: {
    bloodGroup: string;
    allergies: string[];
    conditions: string[];
    medications: string[];
  };
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'mesh-queued';
}

export interface SOSAlert {
  id: string;
  userId: string;
  userName: string;
  location: { lat: number; lng: number };
  timestamp: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  aiAssessment?: string;
  signalStrength: number; // 0-100
}

export interface Shelter {
  id: string;
  name: string;
  type: 'hospital' | 'shelter' | 'safe-zone';
  lat: number;
  lng: number;
  capacity: number;
  currentOccupancy: number;
  distance?: number;
}

export interface Broadcast {
  id: string;
  authority: string;
  message: string;
  type: 'warning' | 'info' | 'critical';
  timestamp: number;
}

export type AppView = 'map' | 'chat' | 'broadcast' | 'doctor' | 'profile' | 'firstaid';

export interface FirstAidStep {
  id: string;
  title: string;
  description: string;
  steps: string[];
  category: 'injury' | 'natural-disaster' | 'medical';
}
