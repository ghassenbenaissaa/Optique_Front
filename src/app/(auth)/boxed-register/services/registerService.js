import axios from '@/lib/axios';

export const registerService = {
  register: async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
