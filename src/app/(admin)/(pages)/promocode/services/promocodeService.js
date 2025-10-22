import api from '@/lib/axios';

// Service pour les codes promo
export const promoCodeService = {
  /**
   * Récupérer tous les codes promo
   * @returns {Promise<import('../types').PromoCode[]>}
   */
  getAllPromoCodes: async () => {
    const response = await api.get('/codePromo/admin');
    return response.data;
  },

  /**
   * Ajouter un code promo
   * @param {{ code: string; remisePourcentage: number; dateExpiration: string }} data
   * @returns {Promise<import('../types').PromoCode>}
   */
  addPromoCode: async (data) => {
    const response = await api.post('/codePromo/add', data, {
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
    const response = await api.put('/codePromo/update', data, {
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
    await api.delete(`/codePromo/delete/${id}`);
  },
};
