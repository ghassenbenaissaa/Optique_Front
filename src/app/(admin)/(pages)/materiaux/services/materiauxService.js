import axios from 'axios';

const API_BASE_URL = 'http://localhost:8089/api/v1';

export const materiauxService = {
  // Récupérer tous les matériaux (admin)
  getAllMateriaux: async () => {
    const response = await axios.get(`${API_BASE_URL}/materiauProduit/admin`);
    return response.data;
  },

  // Ajouter un matériau
  addMateriau: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/materiauProduit/add`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Mettre à jour un matériau
  updateMateriau: async (data) => {
    const response = await axios.put(`${API_BASE_URL}/materiauProduit/update`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Supprimer un matériau
  deleteMateriau: async (id) => {
    await axios.delete(`${API_BASE_URL}/materiauProduit/delete/${id}`);
  },
};
