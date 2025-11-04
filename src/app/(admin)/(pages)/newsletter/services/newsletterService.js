import api from '@/lib/axios';

// Service pour la newsletter
export const newsletterService = {

  getNewsletters: async () => {
    const response = await api.get('/newsletter/all');
    return response.data;
  },

  sendNewsletter: async (data) => {
    const response = await api.post('/newsletter/send', {
      subject: data.subject,
      content: data.content,
    });
    return response.data;
  },
};

