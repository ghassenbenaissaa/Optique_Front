import api from '@/lib/axios';

export const marqueService = {
  // Récupérer toutes les marques (admin)
  getMarques: async () => {
    const response = await api.get('/marque/admin');
    return response.data;
  },

  // Ajouter une marque
  addMarque: async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await api.post('/marque/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Mettre à jour une marque
  updateMarque: async (data) => {
    const formData = new FormData();
    formData.append('id', data.id);
    formData.append('name', data.name);
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await api.put('/marque/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Supprimer une marque
  deleteMarque: async (id) => {
    await api.delete(`/marque/delete/${id}`);
  },
};
