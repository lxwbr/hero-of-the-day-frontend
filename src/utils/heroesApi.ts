import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getHeroList() {
  console.log('API: Making request to:', `${baseURL}/hero/list`);
  try {
    const res = await axios.get(`${baseURL}/hero/list`);
    console.log('API: Response received:', res.data);
    return res.data as { id: number; name: string; members: string[] }[];
  } catch (error) {
    console.error('API: Request failed:', error);
    throw error;
  }
} 