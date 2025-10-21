import axios from 'axios';

const API_BASE_URL = 'http://localhost:8089/api/v1';

// Service pour les codes promo
export const promoCodeService = {
  /**
   * Récupérer tous les codes promo
   * @returns {Promise<import('../types').PromoCode[]>}
   */
  getAllPromoCodes: async () => {
    const response = await axios.get(`${API_BASE_URL}/codePromo/admin`);
    return response.data;
  },

  /**
   * Ajouter un code promo
   * @param {{ code: string; remisePourcentage: number; dateExpiration: string }} data
   * @returns {Promise<import('../types').PromoCode>}
   */
  addPromoCode: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/codePromo/add`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  /**
   * Mettre à jour un code promo
   * @param {{ id: number; code: string; remisePourcentage: number; dateExpiration: string; available?: boolean }} data
   * @returns {Promise<import('../types').PromoCode>}
   */
  updatePromoCode: async (data) => {
    const response = await axios.put(`${API_BASE_URL}/codePromo/update`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  /**
   * Supprimer un code promo
   * @param {number} id
   * @returns {Promise<void>}
   */
  deletePromoCode: async (id) => {
    await axios.delete(`${API_BASE_URL}/codePromo/delete/${id}`);
  },
};
