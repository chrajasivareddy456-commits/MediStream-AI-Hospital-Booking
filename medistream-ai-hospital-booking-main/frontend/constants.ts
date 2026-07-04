
import { Doctor } from './types';

export const DEPARTMENTS = [
  'General Medicine',
  'Cardiology',
  'ENT',
  'Neurology',
  'Orthopedics',
  'Dermatology',
  'Pediatrics'
];

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    specialty: 'Cardiologist',
    department: 'Cardiology',
    experience: 12,
    rating: 4.9,
    image: 'https://picsum.photos/seed/doc1/200/200',
    availableSlots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:15 PM']
  },
  {
    id: '2',
    name: 'Dr. James Chen',
    specialty: 'Neurologist',
    department: 'Neurology',
    experience: 8,
    rating: 4.8,
    image: 'https://picsum.photos/seed/doc2/200/200',
    availableSlots: ['11:00 AM', '01:30 PM', '03:45 PM']
  },
  {
    id: '3',
    name: 'Dr. Elena Rodriguez',
    specialty: 'General Practitioner',
    department: 'General Medicine',
    experience: 15,
    rating: 4.7,
    image: 'https://picsum.photos/seed/doc3/200/200',
    availableSlots: ['08:30 AM', '09:45 AM', '01:00 PM', '03:00 PM', '05:00 PM']
  },
  {
    id: '4',
    name: 'Dr. Michael Brown',
    specialty: 'Orthopedic Surgeon',
    department: 'Orthopedics',
    experience: 10,
    rating: 4.6,
    image: 'https://picsum.photos/seed/doc4/200/200',
    availableSlots: ['10:00 AM', '12:00 PM', '02:30 PM']
  },
  {
    id: '5',
    name: 'Dr. Lisa Park',
    specialty: 'ENT Specialist',
    department: 'ENT',
    experience: 7,
    rating: 4.9,
    image: 'https://picsum.photos/seed/doc5/200/200',
    availableSlots: ['09:00 AM', '11:15 AM', '02:45 PM']
  },
  {
    id: '6',
    name: 'Dr. David Miller',
    specialty: 'Pediatrician',
    department: 'Pediatrics',
    experience: 14,
    rating: 4.8,
    image: 'https://picsum.photos/seed/doc6/200/200',
    availableSlots: ['08:00 AM', '10:00 AM', '01:00 PM', '03:00 PM']
  }
];
