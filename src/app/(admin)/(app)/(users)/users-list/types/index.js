// Types pour le module Users

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} email
 * @property {string} numTel
 * @property {string} adresse
 * @property {boolean} banned - Champ réel de l'API
 * @property {boolean} isBanned - Champ mappé pour l'interface
 * @property {string} createdDate - Format LocalDate (YYYY-MM-DD)
 */

/**
 * @typedef {Object} UserListResponse
 * @property {User[]} content
 * @property {number} totalElements
 * @property {number} totalPages
 * @property {number} number
 * @property {number} size
 */

// Helper pour l'affichage du statut
export const getBanStatusLabel = (isBanned) => (isBanned ? 'Banni' : 'Actif');

// Helper pour formater la date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};
