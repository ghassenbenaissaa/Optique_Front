import api from '@/lib/axios';

/**
 * Service de gestion des produits
 * Gère tous les appels API liés aux produits
 */
class ProductService {
  /**
   * Récupère tous les produits depuis l'API
   * @returns {Promise<import('../types/product.types').Product[]>}
   * @throws {Error} Si l'appel API échoue
   */
  async getAllProducts() {
    try {
      const response = await api.get('/produit/all');

      // Normaliser la réponse de l'API
      const productsData = Array.isArray(response?.data)
        ? response.data
        : response?.data?.data || [];

      return productsData;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw new Error(
        error.response?.data?.message ||
        'Impossible de charger les produits. Veuillez réessayer.'
      );
    }
  }

  /**
   * Récupère un produit par son ID
   * @param {number} id - ID du produit
   * @returns {Promise<import('../types/product.types').Product>}
   * @throws {Error} Si l'appel API échoue
   */
  async getProductById(id) {
    try {
      const response = await api.get(`/produit/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du produit ${id}:`, error);
      throw new Error(
        error.response?.data?.message ||
        'Impossible de charger le produit.'
      );
    }
  }

  /**
   * Récupère des produits filtrés
   * @param {import('../types/product.types').ProductFilters} filters - Filtres à appliquer
   * @returns {Promise<import('../types/product.types').Product[]>}
   */
  async getFilteredProducts(filters) {
    try {
      const params = new URLSearchParams();

      if (filters.category) params.append('category', filters.category);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.colors?.length) params.append('colors', filters.colors.join(','));

      const response = await api.get(`/produit/filter?${params.toString()}`);

      const productsData = Array.isArray(response?.data)
        ? response.data
        : response?.data?.data || [];

      return productsData;
    } catch (error) {
      console.error('Erreur lors du filtrage des produits:', error);
      throw new Error('Impossible de filtrer les produits.');
    }
  }

  /**
   * Recherche des produits par terme
   * @param {string} searchTerm - Terme de recherche
   * @returns {Promise<import('../types/product.types').Product[]>}
   */
  async searchProducts(searchTerm) {
    try {
      const response = await api.get(`/produit/search?q=${encodeURIComponent(searchTerm)}`);

      const productsData = Array.isArray(response?.data)
        ? response.data
        : response?.data?.data || [];

      return productsData;
    } catch (error) {
      console.error('Erreur lors de la recherche de produits:', error);
      throw new Error('Impossible de rechercher les produits.');
    }
  }

  /**
   * Extrait les couleurs uniques d'un produit depuis ses variations
   * @param {import('../types/product.types').Product} product - Produit
   * @returns {import('../types/product.types').ProductColor[]}
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
          code: colorHex
        });
      }
    });

    return Array.from(uniqueColorsMap.values());
  }

  /**
   * Normalise les données d'un produit pour l'affichage
   * @param {import('../types/product.types').Product} product - Produit brut de l'API
   * @returns {Object} Produit normalisé
   */
  normalizeProduct(product) {
    const productName = product.nom || product.name || 'Monture';
    const productPrice = product.price || product.prix || 0;
    const productImages = product.imageUrl || product.images || [];
    const productImage = Array.isArray(productImages) ? productImages[0] : productImages;
    const productRating = product.rating || product.note || 4.5;
    const productReviews = product.reviews || product.avis || Math.floor(Math.random() * 2000);
    const productColors = this.extractUniqueColors(product);

    // Calcul du prix original si promotion
    const hasDiscount = product.discount || product.promotion;
    const originalPrice = hasDiscount ? productPrice * 1.2 : null;

    return {
      id: product.id,
      name: productName,
      price: productPrice,
      originalPrice,
      image: productImage,
      images: productImages,
      rating: productRating,
      reviews: productReviews,
      colors: productColors,
      hasDiscount,
      description: product.description,
      category: product.categorie,
      brand: product.marque,
      variations: product.variations || []
    };
  }
}

// Export d'une instance unique (Singleton)
const productService = new ProductService();
export default productService;

