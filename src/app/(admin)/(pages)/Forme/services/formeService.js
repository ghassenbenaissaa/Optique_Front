import api from '@/lib/axios';

// Service pour les formes
export const formeService = {
  // Récupérer toutes les formes (vue admin)
  getFormes: async () => {
    const response = await api.get('/formeProduit/admin');
    return response.data;
  },

  // Ajouter une forme
  addForme: async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await api.post('/formeProduit/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Mettre à jour une forme
  updateForme: async (data) => {
    const formData = new FormData();
    formData.append('id', data.id);
    formData.append('name', data.name);
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await api.put('/formeProduit/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Supprimer une forme
  deleteForme: async (id) => {
    await api.delete(`/formeProduit/delete/${id}`);
  },
};
