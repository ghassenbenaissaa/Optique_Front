import api from '@/lib/axios';

/**
 * Service pour récupérer les détails d'un produit
 */
class ProductDetailService {
  /**
   * Récupère un produit par sa référence
   * @param {string} reference - Référence du produit
   * @returns {Promise<Object>} Produit détaillé
   */
  async getProductByReference(reference) {
    try {
      const response = await api.get(`/produit/reference/${encodeURIComponent(reference)}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du produit (ref: ${reference}):`, error);
      throw new Error(
        error.response?.data?.message ||
        'Impossible de charger les détails du produit.'
      );
    }
  }

  /**
   * Extrait les couleurs uniques d'un produit depuis ses variations
   * @param {Object} product - Produit
   * @returns {Array} Liste des couleurs uniques
   */
  extractUniqueColors(product) {
    const variations = product.variations || [];
    const uniqueColorsMap = new Map();

    variations.forEach(variation => {
      const colorName = variation.nomcouleur;
      const colorHex = variation.hexcouleur;

      if (colorName && colorHex && !uniqueColorsMap.has(colorName)) {
        uniqueColorsMap.set(colorName, {
          nom: colorName,
          code: colorHex,
          variationId: variation.id,
          stock: variation.quantity || variation.stock || 0,
          price: variation.price,
          solde: variation.solde,
          images: variation.imageUrl || []
        });
      }
    });

    return Array.from(uniqueColorsMap.values());
  }

  /**
   * Récupère toutes les images d'un produit depuis ses variations
   * @param {Object} product - Produit
   * @returns {Array} Liste des images
   */
  getAllImages(product) {
    const images = [];
    const variations = product.variations || [];

    variations.forEach(variation => {
      if (Array.isArray(variation.imageUrl)) {
        variation.imageUrl.forEach(img => {
          if (img && !images.includes(img)) {
            images.push(img);
          }
        });
      }
    });

    // Ajouter les images principales du produit si elles existent
    if (product.imageUrl) {
      const productImages = Array.isArray(product.imageUrl) ? product.imageUrl : [product.imageUrl];
      productImages.forEach(img => {
        if (img && !images.includes(img)) {
          images.unshift(img);
        }
      });
    }

    return images;
  }

  /**
   * Calcule le prix minimum parmi toutes les variations
   * @param {Object} product - Produit
   * @returns {number} Prix minimum
   */
  getMinPrice(product) {
    const variations = product.variations || [];

    if (variations.length === 0) {
      return product.price || product.prix || 0;
    }

    const minPrice = variations.reduce((min, variation) => {
      const price = Number(variation?.price ?? Infinity);
      return isNaN(price) ? min : Math.min(min, price);
    }, Infinity);

    return minPrice === Infinity ? (product.price || product.prix || 0) : minPrice;
  }

  /**
   * Calcule le solde maximal parmi toutes les variations
   * @param {Object} product - Produit
   * @returns {number} Pourcentage de solde maximal
   */
  getMaxDiscount(product) {
    const variations = product.variations || [];

    if (variations.length === 0) {
      return 0;
    }

    const maxDiscount = variations.reduce((max, variation) => {
      const solde = Number(variation?.solde ?? 0);
      return isNaN(solde) ? max : Math.max(max, solde);
    }, 0);

    return maxDiscount;
  }

  /**
   * Vérifie la disponibilité totale du produit
   * @param {Object} product - Produit
   * @returns {boolean} True si au moins une variation est en stock
   */
  isAvailable(product) {
    // Utiliser isAvailable du backend si disponible
    if (product.isAvailable !== undefined) {
      return product.isAvailable;
    }
    const variations = product.variations || [];
    return variations.some(v => (v.quantity || v.stock || 0) > 0);
  }

  /**
   * Calcule le stock total du produit
   * @param {Object} product - Produit
   * @returns {number} Stock total
   */
  getTotalStock(product) {
    const variations = product.variations || [];
    return variations.reduce((total, v) => total + (v.quantity || v.stock || 0), 0);
  }

  /**
   * Normalise les données d'un produit pour l'affichage détaillé
   * @param {Object} product - Produit brut de l'API
   * @returns {Object} Produit normalisé avec toutes les informations
   */
  normalizeProductDetails(product) {
    const colors = this.extractUniqueColors(product);
    const allImages = this.getAllImages(product);
    const minPrice = this.getMinPrice(product);
    const maxDiscount = this.getMaxDiscount(product);
    const isAvailable = this.isAvailable(product);
    const totalStock = this.getTotalStock(product);

    // Calcul du prix original si solde existe
    const originalPrice = maxDiscount > 0
      ? minPrice / (1 - maxDiscount / 100)
      : null;

    // Extraire le matériau depuis les variations (prendre le premier disponible)
    const materiauFromVariations = product.variations?.find(v => v.materiauProduit)?.materiauProduit;

    return {
      id: product.id,
      reference: product.reference || product.ref,
      name: product.nom || product.name || 'Produit',
      description: product.description || '',
      brand: product.marque?.nom || product.marque || '',
      category: product.categorie || '',
      price: minPrice,
      originalPrice,
      maxDiscount,
      isAvailable,
      totalStock,
      colors,
      allImages,
      variations: product.variations || [],
      // Dimensions
      dimensions: {
        largeurTotale: product.largeurTotale,
        largeurVerre: product.largeurVerre,
        hauteurVerre: product.hauteurVerre,
        largeurPont: product.largeurPont,
        longueurBranche: product.longueurBranche
      },
      // Caractéristiques
      characteristics: {
        genre: product.gender || product.genre,
        type: product.type || product.categorie,
        taille: product.taille,
        forme: product.formeProduit || product.forme?.nom || product.forme,
        materiau: materiauFromVariations || product.materiau?.nom || product.materiau,
        typeMonture: product.typeMonture
      }
    };
  }
}

const productDetailService = new ProductDetailService();
export default productDetailService;


