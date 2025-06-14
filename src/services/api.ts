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

// Minimal hero API service
export const heroApi = {
  // Get all heroes
  getHeroes: async (): Promise<Hero[]> => {
    const baseURL = process.env.REACT_APP_API_URL;
    
    // In development mode, if no API URL is configured, use mock data immediately
    if (isDevelopment && !baseURL) {
      console.log('Development mode: No API URL configured, using mock data');
      return mockHeroes;
    }
    
    // Try to fetch from API
    const apiURL = baseURL || 'http://localhost:8080';
    
    try {
      const response = await fetch(`${apiURL}/hero/list`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      if (isDevelopment) {
        console.warn('API not available in development mode, using mock data:', error);
        return mockHeroes;
      } else {
        // In production, re-throw the error
        throw error;
      }
    }
  },
}; 