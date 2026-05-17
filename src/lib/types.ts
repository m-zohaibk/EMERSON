export interface CampusLocation {
  id: string;
  name: string;
  type: 'Classroom' | 'Office' | 'Department' | 'Service' | 'Other';
  latitude: number;
  longitude: number;
  description: string;
  tags: string[];
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  category: 'Exams' | 'General' | 'Emergency';
  date: string;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  href: string;
  color: string;
}