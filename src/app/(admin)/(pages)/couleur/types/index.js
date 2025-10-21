// Enums / Types pour le module Couleur

/**
 * @typedef {Object} Couleur
 * @property {number|string} id
 * @property {string} name
 * @property {string} codeHex // Format #RRGGBB ou #RGB
 * @property {boolean} [available]
 */

// Regex partagé pour valider les codes couleur hexadécimaux
export const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

// Helper optionnel pour l'affichage
export const availabilityLabel = (available) => (available ? 'Disponible' : 'Indisponible');

