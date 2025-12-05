
export type LanguageCode = 'RO' | 'EN' | 'IT' | 'ES' | 'FR' | 'DE' | 'PT' | 'HU' | 'TR';

export type UserRole = 'user' | 'admin' | 'super_admin';

export interface UserProfile {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  county?: string;
  country: string;
  postCode?: string;
  username: string;
  avatarUrl: string | null;
  role?: UserRole; 
}

export interface Announcement {
  id: string;
  title: string;
  description: string; // Unified description
  imageUrl: string;
  date: string; // Start Date YYYY-MM-DD
  endDate?: string; // End Date YYYY-MM-DD
  active: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  location: string;
  date: string; // Start Date
  endDate?: string; // End Date
  description: string;
  imageUrl: string;
  active: boolean;
}

export interface UserDocument {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  file_name: string;
  file_url: string;
  file_type: 'image' | 'pdf';
  created_at: string;
}

export interface SubService {
  name: string;
  url: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  iconName: string;
  subServices: SubService[];
}

export interface FaqCategory {
  id: string;
  title: string;
  questions: { question: string; answer: string }[];
}

export enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto'
}

export enum TextSize {
  SMALL = 'text-sm',
  MEDIUM = 'text-base',
  LARGE = 'text-lg',
  XLARGE = 'text-xl'
}

export type ViewState = 'SPLASH' | 'AUTH' | 'HOME' | 'SERVICES' | 'SEND_DOCS' | 'EVENTS_LIST' | 'FAQ' | 'SETTINGS' | 'PROFILE' | 'ADMIN';

export interface NotificationPreferences {
  enabled: boolean;
  announcements: boolean;
  events: boolean;
  requests: boolean;
}

export type SearchCategory = 'ALL' | 'SERVICES' | 'ANNOUNCEMENTS' | 'EVENTS' | 'FAQ';
