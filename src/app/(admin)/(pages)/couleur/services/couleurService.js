import api from '@/lib/axios';

export const couleurService = {
  // Récupérer toutes les couleurs (admin)
  getAllCouleurs: async () => {
    const response = await api.get('/couleur/admin');
    return response.data;
  },

  // Ajouter une couleur
  addCouleur: async (data) => {
    // data: { name: string, codeHex: string }
    const response = await api.post('/couleur/add', data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  // Mettre à jour une couleur
  updateCouleur: async (data) => {
    // data: { id: number|string, name: string, codeHex: string }
    const response = await api.put('/couleur/update', data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  // Supprimer une couleur
  deleteCouleur: async (id) => {
    await api.delete(`/couleur/delete/${id}`);
  },
};
