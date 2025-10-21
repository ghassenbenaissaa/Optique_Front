import axios from 'axios';

const API_BASE_URL = 'http://localhost:8089/api/v1';

// Service pour les formes
export const formeService = {
  // Récupérer toutes les formes (vue admin)
  getFormes: async () => {
    const response = await axios.get(`${API_BASE_URL}/formeProduit/admin`);
    return response.data;
  },

  // Ajouter une forme
  addForme: async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await axios.post(`${API_BASE_URL}/formeProduit/add`, formData, {
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

    const response = await axios.put(`${API_BASE_URL}/formeProduit/update`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Supprimer une forme
  deleteForme: async (id) => {
    await axios.delete(`${API_BASE_URL}/formeProduit/delete/${id}`);
  },
};
