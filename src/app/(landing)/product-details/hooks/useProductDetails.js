import { useState, useEffect, useCallback } from 'react';
import productDetailService from '../services/productDetailService';

/**
 * Hook personnalisé pour gérer les détails d'un produit
 * @param {string} reference - Référence du produit
 */
const useProductDetails = (reference) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    if (!reference) {
      setError('Référence du produit manquante');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const productData = await productDetailService.getProductByReference(reference);
      const normalizedProduct = productDetailService.normalizeProductDetails(productData);

      setProduct(normalizedProduct);
    } catch (err) {
      setError(err.message);
      console.error('Erreur dans useProductDetails:', err);
    } finally {
      setLoading(false);
    }
  }, [reference]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct
  };
};

export default useProductDetails;
