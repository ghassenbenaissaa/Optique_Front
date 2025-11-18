import { useState, useEffect, useCallback, useRef } from 'react';
import productService from '../services/productService';
import filtreService from '../services/filtreService';

/**
 * Hook personnalisé pour gérer les produits (avec support des filtres paginés)
 * @param {import('../types/produitFiltre.types.js').ProduitFiltreRequest | null} [filters]
 */
const useProducts = (filters = null) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [normalizedProducts, setNormalizedProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [sortBy, setSortBy] = useState('price');
  const [sortDir, setSortDir] = useState('ASC');
  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  const computePayload = useCallback(() => {
    const payload = { ...(filters || {}) };
    payload.page = page;
    payload.size = size;
    payload.sortBy = sortBy || 'price';
    payload.sortDir = sortDir || 'ASC';
    return payload;
  }, [filters, page, size, sortBy, sortDir]);

  /**
   * Récupère les produits depuis l'API
   */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Annuler la requête précédente si en vol
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      let productsData;

      if (filters && Object.keys(filters || {}).length > 0) {
        // POST paginé
        productsData = await filtreService.searchProduits(computePayload(), controller.signal);
      } else {
        // Fallback: GET all (non paginé)
        productsData = await productService.getAllProducts();
      }

      setProducts(productsData);

      // Normaliser les produits pour l'affichage
      const normalized = productsData.map(product =>
        productService.normalizeProduct(product)
      );
      setNormalizedProducts(normalized);

    } catch (err) {
      if (err?.name === 'CanceledError' || err?.name === 'AbortError') {
        // silencieux sur abort
        return;
      }
      setError(err.message);
      console.error('Erreur dans useProducts:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, computePayload]);

  // Debounce sur changements de filtres/pagination/tri
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fetchProducts]);

  // Reset page à 0 à chaque changement de filtres (hors pagination)
  useEffect(() => {
    setPage(0);
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
   * Recherche des produits (GET legacy)
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
    // pagination / tri
    page,
    size,
    sortBy,
    sortDir,
    setPage,
    setSize,
    setSortBy,
    setSortDir,
    // Métadonnées utiles
    hasProducts: normalizedProducts.length > 0,
    productsCount: normalizedProducts.length
  };
};

export default useProducts;
