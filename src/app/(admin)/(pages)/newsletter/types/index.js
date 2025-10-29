// Définitions de types pour le module Newsletter

/**
 * @typedef {Object} Newsletter
 * @property {string} email
 * @property {string} subscriptionDate
 * @property {boolean} confirmed
 */

/**
 * @typedef {Object.<string, string>} ValidationErrors
 */

/**
 * @typedef {Object} ApiErrorResponse
 * @property {string=} message
 * @property {ValidationErrors=} errors
 */

// Labels d'affichage pour le statut de confirmation
export const ConfirmationLabels = {
  true: 'Oui',
  false: 'Non',
};

