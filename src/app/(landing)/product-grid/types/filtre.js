/**
 * Type de réponse pour l'API de récupération des filtres
 *
 * @typedef {Object} GetFiltreResponse
 * @property {number} minPrix - Prix minimum des produits
 * @property {number} maxPrix - Prix maximum des produits
 * @property {number} minLargeurTotale - Largeur totale minimale des montures (mm)
 * @property {number} maxLargeurTotale - Largeur totale maximale des montures (mm)
 * @property {number} minLargeurVerre - Largeur de verre minimale (mm)
 * @property {number} maxLargeurVerre - Largeur de verre maximale (mm)
 * @property {number} minHauteurVerre - Hauteur de verre minimale (mm)
 * @property {number} maxHauteurVerre - Hauteur de verre maximale (mm)
 * @property {number} minLargeurPont - Largeur de pont minimale (mm)
 * @property {number} maxLargeurPont - Largeur de pont maximale (mm)
 * @property {number} minLongueurBranche - Longueur de branche minimale (mm)
 * @property {number} maxLongueurBranche - Longueur de branche maximale (mm)
 */

/**
 * Valeurs par défaut pour les filtres en cas d'erreur
 * @type {GetFiltreResponse}
 */
export const DEFAULT_FILTER_VALUES = {
  minPrix: 0,
  maxPrix: 1000,
  minLargeurTotale: 120,
  maxLargeurTotale: 160,
  minLargeurVerre: 40,
  maxLargeurVerre: 65,
  minHauteurVerre: 30,
  maxHauteurVerre: 55,
  minLargeurPont: 14,
  maxLargeurPont: 24,
  minLongueurBranche: 125,
  maxLongueurBranche: 150
};

export default {};

