import api from '@/lib/axios';

// Service pour la newsletter
export const newsletterService = {
  // Récupérer tous les abonnés à la newsletter
  getNewsletters: async () => {
    const response = await api.get('/newsletter/all');
    return response.data;
  },
};

