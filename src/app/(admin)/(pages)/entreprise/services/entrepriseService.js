import axios from 'axios';

const API_BASE_URL = 'http://localhost:8089/api/v1';

/**
 * Service pour la gestion des entreprises
 */
export const entrepriseService = {
  /**
   * Récupérer les informations de l'entreprise
   */
  getEntreprise: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/entreprise/admin`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'entreprise:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération de l\'entreprise',
        status: error.response?.status
      };
    }
  },

  /**
   * Ajouter une nouvelle entreprise
   */
  addEntreprise: async (entrepriseData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/entreprise/add`, entrepriseData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return {
        success: true,
        data: response.data,
        message: 'Entreprise ajoutée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'entreprise:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'ajout de l\'entreprise',
        status: error.response?.status
      };
    }
  },

  /**
   * Mettre à jour les informations de l'entreprise
   */
  updateEntreprise: async (entrepriseData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/entreprise/update`, entrepriseData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return {
        success: true,
        data: response.data,
        message: 'Entreprise mise à jour avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'entreprise:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour de l\'entreprise',
        status: error.response?.status
      };
    }
  }
};
