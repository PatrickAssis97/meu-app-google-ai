export interface CourseSchedule {
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}

export interface OpenEnrollmentCourse {
  id: string;
  name: string;
  workload: number;
  startDate: string;
  endDate: string;
  schedule: string;
  enrollmentUrl: string;
  vacancies: 'available' | 'few' | 'filled';
}

export interface OngoingCourse {
  id: string;
  room: string;
  courseName: string;
  block: string;
  schedules: CourseSchedule[];
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  urgent?: boolean;
}

export type UserRole = 'admin' | 'basic' | null;

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'basic';
}

// --- App Customization Settings ---

export type MuralComponentId = 'ongoing' | 'open' | 'video' | 'news';

export interface CarouselSettings {
  speed: number; // in seconds
  transition: 'slide' | 'fade';
}

export interface FooterSettings {
  showLogo: boolean;
  showClock: boolean;
}

export interface AppSettings {
  layoutOrder: MuralComponentId[];
  customLogoUrl: string | null;
  footerSettings: FooterSettings;
  openEnrollmentsCarousel: CarouselSettings;
  newsCarousel: CarouselSettings;
}

// FIX: Add WeatherData interface for the new weather feature.
export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  conditionIcon: string;
}
