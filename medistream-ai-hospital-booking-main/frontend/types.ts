
export enum UrgencyLevel {
  NORMAL = 'Normal',
  PRIORITY = 'Priority',
  EMERGENCY = 'Emergency'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bloodType: string;
  weight: string;
  height: string;
  memberSince: string;
  lastCheckup: string;
  role: "patient" | "admin";   
  passwordHash?: string; // Stored for simulation
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  experience: number;
  rating: number;
  image: string;
  availableSlots: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  date: string;
  time: string;
  department: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  urgency?: UrgencyLevel;
  reasoning?: string;
  userSymptoms?: string;
}

export interface SymptomAnalysis {
  suggestedDepartment: string;
  urgency: UrgencyLevel;
  reasoning: string;
  safetyWarning: string;
  userSymptoms?: string;
}

export type View = 'Home' | 'SymptomChecker' | 'Booking' | 'Dashboard' | 'Profile' | 'Auth' | 'AdminDashboard';
