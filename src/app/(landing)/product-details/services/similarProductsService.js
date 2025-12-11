import api from '@/lib/axios';

/**
 * Service pour récupérer les produits similaires
 */
class SimilarProductsService {
  /**
   * Recherche des produits par couleur
   * @param {string[]} couleurs - Liste des codes hex des couleurs
   * @param {string} excludeReference - Référence du produit à exclure
   * @param {number} limit - Nombre maximum de produits
   * @returns {Promise<Array>} Liste des produits
   */
  async searchByColor(couleurs, excludeReference, limit = 4) {
    try {
      const response = await api.post('/filtre/search', {
        couleurs: couleurs.map(c => c.toLowerCase()),
        page: 0,
        size: limit + 1, // +1 pour pouvoir exclure le produit actuel
        sortBy: 'price',
        sortDir: 'ASC'
      });

      const data = Array.isArray(response?.data) ? response.data : (response?.data?.data || []);

      // Exclure le produit actuel par référence et limiter
      return data
        .filter(p => p.reference !== excludeReference)
        .slice(0, limit);
    } catch (error) {
      console.error('Erreur lors de la recherche par couleur:', error);
      return [];
    }
  }

  /**
   * Récupère des produits aléatoires
   * @param {string} excludeReference - Référence du produit à exclure
   * @param {number} limit - Nombre maximum de produits
   * @returns {Promise<Array>} Liste des produits
   */
  async getRandomProducts(excludeReference, limit = 4) {
    try {
      const response = await api.post('/filtre/search', {
        page: 0,
        size: limit + 5, // Prendre plus pour avoir de la marge après exclusion
        sortBy: 'price',
        sortDir: 'ASC'
      });

      const data = Array.isArray(response?.data) ? response.data : (response?.data?.data || []);

      // Exclure le produit actuel par référence
      const filtered = data.filter(p => p.reference !== excludeReference);

      // Mélanger et prendre les premiers
      const shuffled = filtered.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, limit);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits aléatoires:', error);
      return [];
    }
  }

  /**
   * Récupère les produits similaires (par couleur ou aléatoires)
   * @param {Object} currentProduct - Produit actuel avec ses variations
   * @param {Object} selectedVariation - Variation sélectionnée
   * @param {number} limit - Nombre maximum de produits
   * @returns {Promise<Array>} Liste des produits similaires normalisés
   */
  async getSimilarProducts(currentProduct, selectedVariation, limit = 4) {
    if (!currentProduct) return [];

    // Utiliser la référence pour exclure le produit actuel
    const excludeReference = currentProduct.reference;

    // Collecter toutes les couleurs (variation sélectionnée en priorité + autres)
    const allColors = [];

    // Ajouter la couleur de la variation sélectionnée en premier
    if (selectedVariation?.hexcouleur) {
      allColors.push(selectedVariation.hexcouleur.toLowerCase());
    }

    // Ajouter les autres couleurs du produit
    if (currentProduct.variations?.length > 0) {
      currentProduct.variations.forEach(v => {
        if (v.hexcouleur && !allColors.includes(v.hexcouleur.toLowerCase())) {
          allColors.push(v.hexcouleur.toLowerCase());
        }
      });
    }

    let products = [];

    // Un seul appel API avec toutes les couleurs
    if (allColors.length > 0) {
      products = await this.searchByColor(allColors, excludeReference, limit);
    }

    // Si pas assez de résultats, compléter avec des produits aléatoires
    if (products.length < limit) {
      const existingRefs = new Set(products.map(p => p.reference));
      const randomProducts = await this.getRandomProducts(excludeReference, limit - products.length + 2);

      randomProducts.forEach(p => {
        if (!existingRefs.has(p.reference) && products.length < limit) {
          products.push(p);
        }
      });
    }

    // Normaliser les produits pour l'affichage
    return products.slice(0, limit).map(product => this.normalizeProduct(product));
  }

  /**
   * Normalise un produit pour l'affichage
   * @param {Object} product - Produit brut
   * @returns {Object} Produit normalisé
   */
  normalizeProduct(product) {
    const variations = product.variations || [];

    // Extraire les couleurs uniques
    const colorsMap = new Map();
    variations.forEach(v => {
      if (v.nomcouleur && v.hexcouleur && !colorsMap.has(v.nomcouleur)) {
        colorsMap.set(v.nomcouleur, {
          nom: v.nomcouleur,
          code: v.hexcouleur
        });
      }
    });
    const colors = Array.from(colorsMap.values());

    // Calculer le prix minimum
    let minPrice = product.price || product.prix || 0;
    if (variations.length > 0) {
      const prices = variations.map(v => v.price).filter(p => p != null && !isNaN(p));
      if (prices.length > 0) {
        minPrice = Math.min(...prices);
      }
    }

    // Calculer le solde maximum
    let maxDiscount = 0;
    variations.forEach(v => {
      const solde = Number(v.solde ?? 0);
      if (!isNaN(solde) && solde > maxDiscount) {
        maxDiscount = solde;
      }
    });

    // Image à afficher
    let displayImage = null;
    if (variations.length > 0 && variations[0].imageUrl?.length > 0) {
      displayImage = variations[0].imageUrl[0];
    } else if (product.imageUrl) {
      displayImage = Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl;
    }

    return {
      id: product.id,
      reference: product.reference || product.ref || `ref-${product.id}`,
      name: product.nom || product.name || 'Produit',
      price: minPrice,
      maxDiscount,
      displayImage,
      colors
    };
  }
}

const similarProductsService = new SimilarProductsService();
export default similarProductsService;

