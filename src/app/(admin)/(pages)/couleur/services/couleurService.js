import axios from 'axios';

const API_BASE_URL = 'http://localhost:8089/api/v1';

export const couleurService = {
  // Récupérer toutes les couleurs (admin)
  getAllCouleurs: async () => {
    const response = await axios.get(`${API_BASE_URL}/couleur/admin`);
    return response.data;
  },

  // Ajouter une couleur
  addCouleur: async (data) => {
    // data: { name: string, codeHex: string }
    const response = await axios.post(`${API_BASE_URL}/couleur/add`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  // Mettre à jour une couleur
  updateCouleur: async (data) => {
    // data: { id: number|string, name: string, codeHex: string }
    const response = await axios.put(`${API_BASE_URL}/couleur/update`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  // Supprimer une couleur
  deleteCouleur: async (id) => {
    await axios.delete(`${API_BASE_URL}/couleur/delete/${id}`);
  },
};

