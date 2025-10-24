// Types pour la page d'inscription (Register)

/**
 * @typedef {Object} ClientRegistrationRequest
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} email
 * @property {string} password
 * @property {string} numTel
 * @property {string} address
 */

/**
 * @typedef {Object} RegistrationResponse
 * @property {string} [message]
 * @property {boolean} [success]
 * @property {any} [data]
 */

// Regex email simple et robuste
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

