import { useState, useEffect, useCallback } from 'react';
import productService from '../services/productService';

/**
 * Hook personnalisé pour gérer les produits
 * Encapsule toute la logique de récupération et gestion des produits
 *
 * @param {import('../types/product.types').ProductFilters} [filters] - Filtres optionnels
 * @returns {Object} État et fonctions pour gérer les produits
 */
const useProducts = (filters = null) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [normalizedProducts, setNormalizedProducts] = useState([]);

  /**
   * Récupère les produits depuis l'API
   */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let productsData;

      if (filters) {
        productsData = await productService.getFilteredProducts(filters);
      } else {
        productsData = await productService.getAllProducts();
      }

      setProducts(productsData);

      // Normaliser les produits pour l'affichage
      const normalized = productsData.map(product =>
        productService.normalizeProduct(product)
      );
      setNormalizedProducts(normalized);

    } catch (err) {
      setError(err.message);
      console.error('Erreur dans useProducts:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Récupère un produit par son ID
   */
  const fetchProductById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);

      const product = await productService.getProductById(id);
      const normalized = productService.normalizeProduct(product);

      return normalized;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Recherche des produits
   */
  const searchProducts = useCallback(async (searchTerm) => {
    try {
      setLoading(true);
      setError(null);

      const productsData = await productService.searchProducts(searchTerm);
      setProducts(productsData);

      const normalized = productsData.map(product =>
        productService.normalizeProduct(product)
      );
      setNormalizedProducts(normalized);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Recharge les produits
   */
  const refetch = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  /**
   * Réinitialise l'état d'erreur
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Récupération initiale des produits
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    // Données brutes de l'API
    products,
    // Données normalisées prêtes pour l'affichage
    normalizedProducts,
    // États
    loading,
    error,
    // Fonctions
    refetch,
    fetchProductById,
    searchProducts,
    clearError,
    // Métadonnées utiles
    hasProducts: normalizedProducts.length > 0,
    productsCount: normalizedProducts.length
  };
};

export default useProducts;

