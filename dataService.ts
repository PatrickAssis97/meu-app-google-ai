import { OPEN_ENROLLMENTS_COURSES, ONGOING_COURSES_DATA, NEWS_ITEMS_DATA, DEFAULT_VIDEO_URLS, DEFAULT_SETTINGS } from '../constants';
// FIX: Add WeatherData to type imports
import type { OpenEnrollmentCourse, OngoingCourse, NewsItem, User, AppSettings, WeatherData } from '../types';

const MURAL_DATA_KEY = 'senacMuralData';
const USER_DATA_KEY = 'senacMuralUsers';
// FIX: Add constants and interface for weather cache management
const WEATHER_CACHE_KEY = 'senacMuralWeatherCache';
const WEATHER_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

interface AppData {
  openEnrollments: OpenEnrollmentCourse[];
  ongoingCourses: OngoingCourse[];
  newsItems: NewsItem[];
  videoUrls: string[];
  settings: AppSettings;
}

interface WeatherCache {
  timestamp: number;
  data: WeatherData;
}

// --- Mural Data Management ---

export const loadData = (): AppData => {
  const defaultData: AppData = {
    openEnrollments: OPEN_ENROLLMENTS_COURSES,
    ongoingCourses: ONGOING_COURSES_DATA,
    newsItems: NEWS_ITEMS_DATA,
    videoUrls: DEFAULT_VIDEO_URLS,
    settings: DEFAULT_SETTINGS,
  };

  try {
    const storedData = localStorage.getItem(MURAL_DATA_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      
      const loadedData: AppData = {
        openEnrollments: Array.isArray(parsedData.openEnrollments) ? parsedData.openEnrollments : defaultData.openEnrollments,
        ongoingCourses: Array.isArray(parsedData.ongoingCourses) ? parsedData.ongoingCourses : defaultData.ongoingCourses,
        newsItems: Array.isArray(parsedData.newsItems) ? parsedData.newsItems : defaultData.newsItems,
        videoUrls: Array.isArray(parsedData.videoUrls) ? parsedData.videoUrls : defaultData.videoUrls,
        settings: parsedData.settings ? { ...DEFAULT_SETTINGS, ...parsedData.settings } : DEFAULT_SETTINGS,
      };

      if (parsedData.videoUrl && !Array.isArray(parsedData.videoUrls)) {
        loadedData.videoUrls = [parsedData.videoUrl];
      }
      
      if (loadedData.ongoingCourses) {
        loadedData.ongoingCourses = loadedData.ongoingCourses.map((course: any) => {
            if (typeof course.block === 'undefined') {
                return { ...course, block: 'A' };
            }
            return course;
        });
      }

      return loadedData;
    }
  } catch (error) {
    console.error("Failed to load mural data from localStorage", error);
  }
  
  return defaultData;
};

export const saveData = (data: AppData) => {
  try {
    const dataToSave: AppData = {
      openEnrollments: data.openEnrollments || [],
      ongoingCourses: data.ongoingCourses || [],
      newsItems: data.newsItems || [],
      videoUrls: data.videoUrls || [],
      settings: data.settings || DEFAULT_SETTINGS,
    };
    const dataString = JSON.stringify(dataToSave);
    localStorage.setItem(MURAL_DATA_KEY, dataString);
  } catch (error) {
    console.error("Failed to save mural data to localStorage", error);
  }
};

// --- User Data Management ---

export const loadUsers = (): User[] => {
  const defaultAdminUser: User[] = [
    { id: 'default-admin', username: 'admin', password: 'admin123', role: 'admin' }
  ];
  
  try {
    const storedUsers = localStorage.getItem(USER_DATA_KEY);
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
        return parsedUsers;
      }
    }
  } catch (error) {
    console.error("Failed to load user data from localStorage", error);
  }

  // If no users are stored, or data is corrupted, return the default admin
  return defaultAdminUser;
};

export const saveUsers = (users: User[]) => {
  try {
    const usersString = JSON.stringify(users);
    localStorage.setItem(USER_DATA_KEY, usersString);
  } catch (error) {
    console.error("Failed to save user data to localStorage", error);
  }
};

// --- Weather Cache Management ---

// FIX: Implement loadWeatherCache to retrieve and validate cached weather data.
export const loadWeatherCache = (): WeatherCache | null => {
  try {
    const cachedItem = localStorage.getItem(WEATHER_CACHE_KEY);
    if (!cachedItem) return null;

    const cache: WeatherCache = JSON.parse(cachedItem);
    const isExpired = (Date.now() - cache.timestamp) > WEATHER_CACHE_DURATION;

    if (isExpired) {
      localStorage.removeItem(WEATHER_CACHE_KEY);
      return null;
    }
    return cache;
  } catch (error) {
    console.error("Failed to load weather cache", error);
    return null;
  }
};

// FIX: Implement saveWeatherCache to store fresh weather data in localStorage.
export const saveWeatherCache = (data: WeatherData) => {
  try {
    const cache: WeatherCache = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error("Failed to save weather cache", error);
  }
};
