// Définitions de types pour le module Forme

/**
 * @typedef {Object} Forme
 * @property {number|string} id
 * @property {string} name
 * @property {string=} imageUrl
 * @property {boolean=} isAvailable
 */

/**
 * @typedef {Object.<string, string>} ValidationErrors
 */

/**
 * @typedef {Object} ApiErrorResponse
 * @property {string=} message
 * @property {ValidationErrors=} errors
 */

// Exemples de labels d'affichage (non utilisés directement par l'UI actuelle)
export const DisponibiliteLabels = {
  true: 'Disponible',
  false: 'Indisponible',
};
