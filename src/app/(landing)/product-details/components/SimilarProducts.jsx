import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { LuShoppingCart, LuHeart } from 'react-icons/lu';
import similarProductsService from '../services/similarProductsService';

const SimilarProducts = ({ currentProduct, selectedVariation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Référence et couleur actuelles pour les dépendances
  const currentReference = currentProduct?.reference;
  const currentColor = selectedVariation?.hexcouleur;

  useEffect(() => {
    // Reset à chaque changement
    setLoading(true);
    setProducts([]);

    if (!currentProduct || !currentReference) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchSimilarProducts = async () => {
      try {
        const rawProduct = {
          reference: currentReference,
          variations: currentProduct.variations || []
        };

        const similarProducts = await similarProductsService.getSimilarProducts(
          rawProduct,
          selectedVariation,
          4
        );

        if (isMounted) {
          setProducts(similarProducts);
          setLoading(false);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits similaires:', error);
        if (isMounted) {
          setProducts([]);
          setLoading(false);
        }
      }
    };

    fetchSimilarProducts();

    return () => {
      isMounted = false;
    };
  }, [currentReference, currentColor]);

  // Ne pas afficher la section s'il n'y a pas de produits
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 lg:pt-12 border-t border-default-200/50 dark:border-default-700/50"
    >
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-default-800 dark:text-default-100 mb-4 sm:mb-6 lg:mb-8">
        Autres produits
      </h2>

      {/* État de chargement */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white/60 dark:bg-default-800/60 rounded-2xl sm:rounded-3xl overflow-hidden border border-default-200/50 dark:border-default-700/50 animate-pulse"
            >
              <div className="p-3 sm:p-4">
                <div className="aspect-[5/4] rounded-xl sm:rounded-2xl bg-default-200 dark:bg-default-700"></div>
              </div>
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
                <div className="h-4 bg-default-200 dark:bg-default-700 rounded mb-3"></div>
                <div className="h-4 w-2/3 mx-auto bg-default-200 dark:bg-default-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grille de produits */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.reference || product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Composant Card produit (adapté du Product Grid)
const ProductCard = ({ product, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }}
      className="group"
    >
      <Link to={`/product/${encodeURIComponent(product.reference)}`} className="block">
        <motion.div
          className="relative bg-white/60 dark:bg-default-800/60 backdrop-blur-md rounded-2xl sm:rounded-3xl overflow-hidden border border-default-200/50 dark:border-default-700/50 transition-all duration-500 hover:shadow-xl hover:border-primary/30"
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ duration: 0.3 }}
        >
          {/* Badge de réduction */}
          {product.maxDiscount > 0 && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
              -{Math.round(product.maxDiscount)}%
            </div>
          )}

          {/* Image */}
          <div className="relative p-2 sm:p-3 bg-gradient-to-br from-default-50/50 to-transparent dark:from-default-900/30">
            <div className="relative aspect-[5/4] rounded-xl sm:rounded-2xl overflow-hidden bg-white dark:bg-default-800 shadow-md group-hover:shadow-lg transition-shadow duration-500">
              {product.displayImage ? (
                <img
                  src={product.displayImage}
                  alt={product.name}
                  className="w-full h-full object-contain p-2 sm:p-3 transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl font-bold text-primary/30">
                    {product.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Prix badge */}
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 dark:bg-default-800/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md border border-default-200/50 dark:border-default-700/50">
              <div className="flex items-center gap-1">
                <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {product.price?.toFixed(0)}
                </span>
                <span className="text-xs font-semibold text-default-600 dark:text-default-400">
                  TND
                </span>
              </div>
            </div>

            {/* Boutons d'action - visibles au hover sur desktop */}
            <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 flex gap-1.5 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 dark:bg-default-800/90 backdrop-blur-sm flex items-center justify-center text-default-700 dark:text-default-300 hover:bg-primary hover:text-white transition-all duration-200 shadow-md"
              >
                <LuShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 dark:bg-default-800/90 backdrop-blur-sm flex items-center justify-center text-default-700 dark:text-default-300 hover:bg-danger hover:text-white transition-all duration-200 shadow-md"
              >
                <LuHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </motion.button>
            </div>
          </div>

          {/* Infos produit */}
          <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-1 sm:pt-2">
            <h3 className="text-center text-xs sm:text-sm font-semibold text-default-800 dark:text-default-100 mb-2 sm:mb-3 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] group-hover:text-primary transition-colors duration-300">
              {product.name}
            </h3>

            {/* Couleurs */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                {product.colors.slice(0, 4).map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="relative group/color"
                  >
                    <div
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white dark:border-default-700 shadow-sm transition-transform duration-200 hover:scale-125"
                      style={{
                        backgroundColor: color.code,
                        boxShadow: `0 2px 6px ${color.code}40`
                      }}
                    />
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/color:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                      <div className="bg-default-900 dark:bg-default-100 text-white dark:text-default-900 px-2 py-1 rounded text-xs font-medium shadow-lg">
                        {color.nom}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-1.5 h-1.5 bg-default-900 dark:bg-default-100"></div>
                      </div>
                    </div>
                  </div>
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs font-medium text-default-500 dark:text-default-400 bg-default-100 dark:bg-default-800 px-1.5 py-0.5 rounded-full">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default SimilarProducts;

