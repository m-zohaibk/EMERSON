
import { CampusLocation, Notice, QuickAction } from './types';

export const MOCK_LOCATIONS: CampusLocation[] = [
  {
    id: '1',
    name: 'Main Library',
    type: 'Service',
    latitude: 34.0205,
    longitude: -118.2856,
    description: 'Central hub for research and quiet study. Features over 2 million volumes.',
    tags: ['Study', 'Quiet', 'WIFI'],
  },
  {
    id: '2',
    name: 'Computer Science Building',
    type: 'Department',
    latitude: 34.0210,
    longitude: -118.2890,
    description: 'Home to the CS department labs and lecture halls room 101-405.',
    tags: ['CS', 'Labs', 'Engineering'],
  },
  {
    id: '3',
    name: 'Student Health Center',
    type: 'Office',
    latitude: 34.0225,
    longitude: -118.2830,
    description: 'Providing primary care, counseling, and wellness services for all students.',
    tags: ['Health', 'Emergency', 'Wellness'],
  },
  {
    id: '4',
    name: 'Admissions Office',
    type: 'Office',
    latitude: 34.0195,
    longitude: -118.2820,
    description: 'Official center for prospective and newly admitted student services.',
    tags: ['Admissions', 'Admin', 'Support'],
  },
];

export const MOCK_NOTICES: Notice[] = [
  {
    id: 'n1',
    title: 'Spring 2024 Exam Schedule Released',
    description: 'The final examination schedule for the Spring 2024 semester is now available on the student portal.',
    category: 'Exams',
    date: '2024-05-15',
  },
  {
    id: 'n3',
    title: 'Campus Maintenance Notice',
    description: 'Power outages expected in the North Quad this Saturday due to electrical grid upgrades.',
    category: 'General',
    date: '2024-05-08',
  },
];

export const QUICK_ACTIONS: QuickAction[] = [
  { id: '2', title: 'Results', icon: 'FileText', href: '/results', color: 'bg-green-100 text-green-700' },
  { id: '4', title: 'Departments', icon: 'Building2', href: '/locations', color: 'bg-orange-100 text-orange-700' },
];

export const MOCK_RESULTS = [
  { semester: 'Fall 2023', gpa: 3.8, credits: 18, subjects: [
    { name: 'Introduction to AI', grade: 'A', status: 'Passed' },
    { name: 'Software Engineering', grade: 'A-', status: 'Passed' },
    { name: 'Data Structures', grade: 'B+', status: 'Passed' },
    { name: 'University Algebra', grade: 'A', status: 'Passed' }
  ]},
  { semester: 'Spring 2023', gpa: 3.6, credits: 16, subjects: [
    { name: 'Calculus II', grade: 'B', status: 'Passed' },
    { name: 'Physics I', grade: 'A-', status: 'Passed' },
    { name: 'English Composition', grade: 'A', status: 'Passed' }
  ]}
];

export const MOCK_FEES = [
  { id: 'F24-001', semester: 'Spring 2024', amount: '45,000 PKR', dueDate: '2024-06-15', status: 'Unpaid' },
  { id: 'F23-098', semester: 'Fall 2023', amount: '42,500 PKR', dueDate: '2023-11-10', status: 'Paid' },
];
