import api from '@/lib/axios';

export const materiauxService = {
  // Récupérer tous les matériaux (admin)
  getAllMateriaux: async () => {
    const response = await api.get('/materiauProduit/admin');
    return response.data;
  },

  // Ajouter un matériau
  addMateriau: async (data) => {
    const response = await api.post('/materiauProduit/add', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Mettre à jour un matériau
  updateMateriau: async (data) => {
    const response = await api.put('/materiauProduit/update', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Supprimer un matériau
  deleteMateriau: async (id) => {
    await api.delete(`/materiauProduit/delete/${id}`);
  },
};
