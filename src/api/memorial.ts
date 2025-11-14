import type { MemorialData } from '../types/memorial';

export const getUserMemorials = async (): Promise<MemorialData[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return [];

    const response = await fetch('https://wings-of-memories-backend.onrender.com/api/memorials/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data.memorials || [];
    }

    return [];
  } catch (error) {
    console.error('Error fetching user memorials:', error);
    return [];
  }
};
