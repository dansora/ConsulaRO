
export type LanguageCode = 'RO' | 'EN' | 'IT' | 'ES' | 'FR' | 'DE' | 'PT' | 'HU' | 'TR';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  county?: string; // New field
  country: string;
  postCode?: string; // Renamed from postalCode
  username: string;
  avatarUrl: string | null; // Renamed from image to match DB column avatar_url logic
}

export interface Announcement {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  date: string;
}

export interface EventItem {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  imageUrl: string;
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

export type ViewState = 'SPLASH' | 'AUTH' | 'HOME' | 'SERVICES' | 'SEND_DOCS' | 'EVENTS_LIST' | 'FAQ' | 'SETTINGS' | 'PROFILE';

export interface NotificationPreferences {
  enabled: boolean;
  announcements: boolean;
  events: boolean;
  requests: boolean;
}

export type SearchCategory = 'ALL' | 'SERVICES' | 'ANNOUNCEMENTS' | 'EVENTS' | 'FAQ';
