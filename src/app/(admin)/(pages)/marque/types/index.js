/**
 * @typedef {Object} Marque
 * @property {number|string} id - Identifiant unique de la marque
 * @property {string} name - Nom de la marque
 * @property {string|null|undefined} imageUrl - URL du logo de la marque (si disponible)
 * @property {boolean|undefined} available - Disponibilité (optionnelle, selon API)
 */

/**
 * Valeurs par défaut/utilitaires simples pour Marque (optionnel)
 */
export const MarqueDefaults = {
  available: true,
};
