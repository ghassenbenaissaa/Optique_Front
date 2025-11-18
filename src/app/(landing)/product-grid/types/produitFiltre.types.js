// Types du filtre produits conformes au backend en JSDoc (JS only)

/**
 * @typedef {'LUNETTE_DE_VUE' | 'LUNETTE_DE_SOLEIL' | string} CategorieProduit
 */
/**
 * @typedef {'HOMME' | 'FEMME' | 'UNISEX' | 'ENFANT' | string} GenderProduit
 */
/**
 * @typedef {'PETIT' | 'MOYEN' | 'GRAND' | 'EXTRA_PETIT' | 'EXTRA_GRAND' | 'SUR_MESURE' | string} TailleProduit
 */
/**
 * @typedef {'CERCLÉE' | 'DEMI_CERCLÉE' | 'SANS_MONTURE' | string} TypeMonture
 */

/**
 * Objet de requête envoyé au backend pour /filtre/search
 * @typedef {Object} ProduitFiltreRequest
 * @property {CategorieProduit[]=} categories
 * @property {GenderProduit[]=} genres
 * @property {string[]=} marques
 * @property {TailleProduit[]=} taillesEnum
 * @property {string[]=} formes
 * @property {string[]=} couleurs
 * @property {string[]=} materiaux
 * @property {TypeMonture[]=} typesMonture
 * @property {number=} minPrix
 * @property {number=} maxPrix
 * @property {number=} minLargeurTotale
 * @property {number=} maxLargeurTotale
 * @property {number=} minLargeurVerre
 * @property {number=} maxLargeurVerre
 * @property {number=} minHauteurVerre
 * @property {number=} maxHauteurVerre
 * @property {number=} minLargeurPont
 * @property {number=} maxLargeurPont
 * @property {number=} minLongueurBranche
 * @property {number=} maxLongueurBranche
 * @property {number=} page  // base 0
 * @property {number=} size  // recommandé 50, max 100
 * @property {string=} sortBy // "price" uniquement
 * @property {('ASC'|'DESC')=} sortDir
 */

/**
 * Réponse produit minimale (normalisation locale possible ailleurs)
 * @typedef {Object} GetProduitResponse
 * @property {number|string=} id
 * @property {string=} reference
 * @property {string=} nom
 * @property {string=} name
 * @property {number=} prix
 * @property {number=} price
 * @property {string|string[]=} imageUrl
 * @property {string[]=} images
 * @property {any[]=} variations
 */

// Export vide pour marquer ce fichier comme module ES (évite collisions d'import)
export {};
