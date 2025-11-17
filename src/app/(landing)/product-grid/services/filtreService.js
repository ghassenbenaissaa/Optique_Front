import api from '@/lib/axios.js';

/**
 * Service de gestion des filtres produits
 * Gère tous les appels API liés aux filtres dynamiques
 */
class FiltreService {
  /**
   * Récupère les valeurs min/max des filtres depuis l'API
   * @returns {Promise<import('../types/filtre.js').GetFiltreResponse>}
   * @throws {Error} Si l'appel API échoue
   */
  async getFilter() {
    try {
      const response = await api.get('/filtre/getFilter');

      // Valider que la réponse contient les données nécessaires
      if (!response?.data) {
        throw new Error('Réponse API invalide');
      }

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des filtres:', error);
      throw new Error(
        error.response?.data?.message ||
        'Impossible de charger les filtres. Veuillez réessayer.'
      );
    }
  }
}

// Export d'une instance unique (Singleton)
const filtreService = new FiltreService();
export default filtreService;

