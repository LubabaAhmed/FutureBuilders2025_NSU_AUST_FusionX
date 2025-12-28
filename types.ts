
export interface Contact {
  id: string;
  name: string;
  phone: string;
}

export interface AppSettings {
  notifications: boolean;
  offlineMode: boolean;
  theme: 'light' | 'dark';
}

export interface PrivacyProtocol {
  shareLocation: boolean;
  visibleToResponders: boolean;
  dataUsageAnalytics: boolean;
}

export type TriageLevel = 'critical' | 'high' | 'standard' | 'low';

export interface User {
  id: string;
  userId: string;
  password?: string;
  name: string;
  email: string;
  role: 'citizen' | 'responder' | 'authority';
  location?: { lat: number; lng: number };
  medicalHistory?: {
    bloodGroup: string;
    allergies: string[];
    conditions: string[];
    medications: string[];
    previousMedications: string[];
    triageStatus?: TriageLevel;
  };
  contacts: Contact[];
  settings: AppSettings;
  privacy: PrivacyProtocol;
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
  signalStrength: number;
  triageCategory?: string;
}

export interface Appointment {
  id: string;
  userId: string;
  type: 'general' | 'emergency' | '48hr-urgent';
  status: 'pending' | 'confirmed' | 'completed';
  requestTime: number;
  scheduledTime?: number;
  triageLevel: TriageLevel;
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

export type AppView = 'map' | 'chat' | 'broadcast' | 'doctor' | 'profile' | 'firstaid' | 'mental-health';

export interface FirstAidStepDetail {
  text: string;
  type: 'action' | 'warning' | 'info';
}

export interface FirstAidStep {
  id: string;
  title: string;
  description: string;
  steps: FirstAidStepDetail[];
  warningSigns?: string[];
  category: 'injury' | 'natural-disaster' | 'medical' | 'environmental';
}
