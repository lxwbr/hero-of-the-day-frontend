import axios from 'axios';
import { authService } from './auth';

// Hero type definition
export interface Hero {
  name: string;
  members: string[];
}

// Mock data for local development
const mockHeroes: Hero[] = [
  {
    name: "default-hero",
    members: ["alex@example.com"]
  },
  {
    name: "some-hero",
    members: ["some-email@example.com", "some-other-email@example.com"]
  },
  {
    name: "some-other-hero",
    members: ["some-other-email@example.com"]
  }
];

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Create axios instance with default config
const apiClient = axios.create({
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include bearer token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await authService.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting access token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, try to get a new one
      try {
        await authService.getAccessToken();
        // Retry the original request
        return apiClient.request(error.config);
      } catch (tokenError) {
        console.error('Failed to refresh token:', tokenError);
        // Redirect to login or show login prompt
      }
    }
    return Promise.reject(error);
  }
);

// Minimal hero API service
export const heroApi = {
  // Get all heroes
  getHeroes: async (): Promise<Hero[]> => {
    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    
    // In development mode, if no API URL is configured, use mock data immediately
    if (isDevelopment && !baseURL) {
      console.log('Development mode: No API URL configured, using mock data');
      return mockHeroes;
    }
    
    // Try to fetch from API
    const apiURL = baseURL || 'http://localhost:8080';
    
    try {
      const response = await apiClient.get(`${apiURL}/hero/list`);
      return response.data;
    } catch (error: unknown) {
      console.error('API request failed:', error);
      
      if (isDevelopment) {
        console.warn('API not available in development mode, using mock data');
        return mockHeroes;
      } else {
        // In production, re-throw the error
        if (axios.isAxiosError(error)) {
          throw new Error(`Failed to fetch heroes: ${error.message}`);
        } else {
          throw new Error(`Failed to fetch heroes: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }
  },
}; 