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

  /**
   * Récupère toutes les couleurs disponibles depuis l'API
   * @returns {Promise<import('../types/filtre.js').GetCouleurResponse[]>}
   * @throws {Error} Si l'appel API échoue
   */
  async getAllColors() {
    try {
      const response = await api.get('/couleur/getAll');

      // Valider que la réponse contient les données nécessaires
      if (!response?.data) {
        throw new Error('Réponse API invalide');
      }

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des couleurs:', error);
      throw new Error(
        error.response?.data?.message ||
        'Impossible de charger les couleurs. Veuillez réessayer.'
      );
    }
  }

  /**
   * Récupère toutes les formes disponibles depuis l'API
   * @returns {Promise<import('../types/filtre.js').GetFormeResponse[]>}
   * @throws {Error} Si l'appel échoue
   */
  async getAllFormes() {
    try {
      const response = await api.get('/formeProduit/getAll');
      if (!response?.data) {
        throw new Error('Réponse API invalide');
      }
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des formes:', error);
      throw new Error(
        error.response?.data?.message ||
        'Impossible de charger les formes. Veuillez réessayer.'
      );
    }
  }

  /**
   * Récupère tous les matériaux disponibles depuis l'API
   * @returns {Promise<import('../types/filtre.js').GetMateriauResponse[]>}
   * @throws {Error} Si l'appel échoue
   */
  async getMateriaux() {
    try {
      const response = await api.get('/materiauProduit/getAll');
      if (!response?.data) {
        throw new Error('Réponse API invalide');
      }
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des matériaux:', error);
      throw new Error(
        error.response?.data?.message ||
        'Impossible de charger les matériaux. Veuillez réessayer.'
      );
    }
  }

  /**
   * Récupère toutes les marques disponibles depuis l'API
   * @returns {Promise<import('../types/filtre.js').GetMarqueResponse[]>}
   * @throws {Error} Si l'appel échoue
   */
  async getMarques() {
    try {
      const response = await api.get('/marque/getAll');
      if (!response?.data) {
        throw new Error('Réponse API invalide');
      }
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des marques:', error);
      throw new Error(
        error.response?.data?.message ||
        'Impossible de charger les marques. Veuillez réessayer.'
      );
    }
  }
}

// Export d'une instance unique (Singleton)
const filtreService = new FiltreService();
export default filtreService;
