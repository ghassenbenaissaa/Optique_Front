/**
 * @typedef {Object} ProductColor
 * @property {string} nom - Nom de la couleur
 * @property {string} code - Code hexadécimal de la couleur
 */

/**
 * @typedef {Object} ProductVariation
 * @property {number} id - ID de la variation
 * @property {string} nomcouleur - Nom de la couleur
 * @property {string} hexcouleur - Code hexadécimal de la couleur
 * @property {number} stock - Stock disponible
 */

/**
 * @typedef {Object} Product
 * @property {number} id - ID du produit
 * @property {string} nom - Nom du produit
 * @property {string} [name] - Nom alternatif du produit
 * @property {number} prix - Prix du produit
 * @property {number} [price] - Prix alternatif du produit
 * @property {string|string[]} imageUrl - URL(s) de l'image du produit
 * @property {string|string[]} [images] - Images alternatives du produit
 * @property {ProductVariation[]} [variations] - Variations du produit (couleurs, tailles, etc.)
 * @property {number} [rating] - Note moyenne du produit (0-5)
 * @property {number} [note] - Note alternative
 * @property {number} [reviews] - Nombre d'avis
 * @property {number} [avis] - Nombre d'avis alternatif
 * @property {boolean} [discount] - Indique si le produit est en promotion
 * @property {boolean} [promotion] - Promotion alternative
 * @property {string} [description] - Description du produit
 * @property {string} [categorie] - Catégorie du produit
 * @property {string} [marque] - Marque du produit
 */

/**
 * @typedef {Object} ProductsState
 * @property {Product[]} products - Liste des produits
 * @property {boolean} loading - État de chargement
 * @property {string|null} error - Message d'erreur
 */

/**
 * @typedef {Object} ProductFilters
 * @property {string} [sortBy] - Critère de tri (price_asc, price_desc, name, rating)
 * @property {string} [category] - Catégorie
 * @property {string} [brand] - Marque
 * @property {number} [minPrice] - Prix minimum
 * @property {number} [maxPrice] - Prix maximum
 * @property {string[]} [colors] - Couleurs sélectionnées
 */

export {};

