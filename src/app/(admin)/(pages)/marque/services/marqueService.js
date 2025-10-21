import axios from 'axios';

const API_BASE_URL = 'http://localhost:8089/api/v1';

export const marqueService = {
  // Récupérer toutes les marques (admin)
  getMarques: async () => {
    const response = await axios.get(`${API_BASE_URL}/marque/admin`);
    return response.data;
  },

  // Ajouter une marque
  addMarque: async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await axios.post(`${API_BASE_URL}/marque/add`, formData, {
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

    const response = await axios.put(`${API_BASE_URL}/marque/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Supprimer une marque
  deleteMarque: async (id) => {
    await axios.delete(`${API_BASE_URL}/marque/delete/${id}`);
  },
};
