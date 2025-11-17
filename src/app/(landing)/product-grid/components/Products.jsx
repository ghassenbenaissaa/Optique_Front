import { LuChevronLeft, LuChevronRight, LuHeart, LuShoppingCart, LuX } from 'react-icons/lu';
import { Link } from 'react-router';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState, memo } from 'react';
import useProducts from '../hooks/useProducts';
import { useFilterContext } from '@/context/FilterContext';

const Products = () => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Utilisation du hook personnalisé pour gérer les produits
  const {
    normalizedProducts,
    loading,
    error,
    refetch
  } = useProducts();

  const { tags, removeTag, clearAll } = useFilterContext();
  const prefersReducedMotion = useReducedMotion();

  // Calculer les produits de la page actuelle
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = normalizedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(normalizedProducts.length / itemsPerPage);

  // Changer de page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Générer les numéros de pages à afficher
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Afficher toutes les pages si moins de 5
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logique pour afficher ... si beaucoup de pages
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  return <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="lg:col-span-3 col-span-1"
    >


      {/* Tags actifs */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex items-center mt-4 gap-2 flex-wrap"
      >
        {tags.length === 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-default-100 dark:bg-default-800 text-default-500"
          >
            Aucun filtre appliqué
          </motion.span>
        )}
        {tags.map((tag, idx) => (
          <motion.span
            key={tag.key}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ delay: 0.3 + idx * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-primary/10 border border-primary/20 text-xs font-medium text-primary shadow-sm backdrop-blur-sm"
          >
            <span className="truncate max-w-[140px]" title={`${tag.category}: ${tag.value}`}>{tag.value}</span>
            <button
              type="button"
              onClick={() => removeTag(tag.key)}
              className="hover:text-danger transition-colors duration-200"
              aria-label={`Supprimer le filtre ${tag.value}`}
            >
              <LuX className="size-3" />
            </button>
          </motion.span>
        ))}
        {tags.length > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + tags.length * 0.05 }}
          >
            <button
              type="button"
              onClick={clearAll}
              className="py-1.5 px-3 text-xs font-medium rounded-full transition-all duration-300 hover:bg-danger/10 hover:text-danger text-default-600"
            >
              Tout effacer
            </button>
          </motion.span>
        )}
      </motion.div>

      {/* État de chargement */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 mt-6"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-default-600 dark:text-default-400 font-medium">
            Chargement des produits...
          </p>
        </motion.div>
      )}

      {/* État d'erreur */}
      {!loading && error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 mt-6"
        >
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium text-lg mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refetch}
            className="btn bg-primary text-white hover:bg-primary/90"
          >
            Réessayer
          </motion.button>
        </motion.div>
      )}

      {/* Grille de produits */}
      {!loading && !error && normalizedProducts.length > 0 && (
        <>
      <motion.div
        layout
        className={`grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 md:gap-8 mt-6`}
      >
        <AnimatePresence mode="popLayout">
          {currentProducts.map((product, index) => {
            const uniqueKey = product.reference || `product-${product.id}-${product.name}-${index}`;

            return (
            <motion.div
              key={uniqueKey}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                layout: { duration: 0.3 },
                ease: [0.4, 0, 0.2, 1]
              }}
              onHoverStart={() => setHoveredProduct(product.id)}
              onHoverEnd={() => setHoveredProduct(null)}
              className="group"
            >
              {/* Carte produit avec design premium minimaliste */}
              <Link to={`/product/${product.id}`} className="block">
                <motion.div
                  className="relative bg-white/60 dark:bg-default-800/60 backdrop-blur-md rounded-3xl overflow-hidden border border-default-200/50 dark:border-default-700/50 transition-all duration-500 hover:shadow-2xl hover:border-primary/30"
                  whileHover={{ scale: 1.02, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Badge Promotion en haut à gauche */}
                  {product.maxDiscount > 0 && (
                    prefersReducedMotion ? (
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg z-10">
                        -{Math.round(product.maxDiscount)}%
                      </div>
                    ) : (
                      <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.08 }}
                        className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg z-10"
                      >
                        -{Math.round(product.maxDiscount)}%
                      </motion.div>
                    )
                  )}

                  {/* Container image avec aspect ratio optimal */}
                  <div className="relative p-4 bg-gradient-to-br from-default-50/50 to-transparent dark:from-default-900/30">
                    <div className="relative aspect-[5/4] rounded-2xl overflow-hidden bg-white dark:bg-default-800 shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
                      {product.image ? (
                        <motion.img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110 will-change-transform"
                          loading="lazy"
                          decoding="async"
                          fetchpriority="low"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl font-bold text-primary/30">
                            {product.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Badge prix flottant en haut à droite */}
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-default-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-default-200/50 dark:border-default-700/50">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                          {product.price.toFixed(0)}
                        </span>
                        <span className="text-xs font-semibold text-default-600 dark:text-default-400">
                          TND
                        </span>
                      </div>
                    </div>

                    {/* Actions rapides au survol - en bas à gauche */}
                    {(!prefersReducedMotion) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: hoveredProduct === product.id ? 1 : 0,
                        y: hoveredProduct === product.id ? 0 : 20
                      }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-4 left-4 flex gap-2"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => e.preventDefault()}
                        className="w-10 h-10 rounded-full bg-white/90 dark:bg-default-800/90 backdrop-blur-sm flex items-center justify-center text-default-700 dark:text-default-300 hover:bg-primary hover:text-white transition-all duration-200 shadow-lg"
                      >
                        <LuShoppingCart className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => e.preventDefault()}
                        className="w-10 h-10 rounded-full bg-white/90 dark:bg-default-800/90 backdrop-blur-sm flex items-center justify-center text-default-700 dark:text-default-300 hover:bg-danger hover:text-white transition-all duration-200 shadow-lg"
                      >
                        <LuHeart className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                    )}
                  </div>

                  {/* Informations produit avec design épuré */}
                  <div className="px-6 pb-6 pt-2">
                    {/* Nom du produit */}
                    <h3 className="text-center text-base md:text-lg font-semibold text-default-800 dark:text-default-100 mb-4 line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors duration-300">
                      {product.name}
                    </h3>

                    {/* Couleurs disponibles en ligne horizontale centrée */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex items-center justify-center gap-2 mb-4">
                        {product.colors.slice(0, 5).map((color, colorIndex) => (
                          <div
                            key={`color-${uniqueKey}-${colorIndex}`}
                            className="relative group/color"
                          >
                            <motion.div
                              whileHover={{ scale: 1.3 }}
                              className="w-6 h-6 rounded-full cursor-pointer transition-all duration-300 border-2 border-white dark:border-default-700 shadow-md"
                              style={{
                                backgroundColor: color.code,
                                boxShadow: `0 2px 8px ${color.code}50`
                              }}
                            />
                            {/* Tooltip élégant */}
                            <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover/color:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                              <div className="bg-default-900 dark:bg-default-100 text-white dark:text-default-900 px-3 py-1.5 rounded-lg text-xs font-medium shadow-xl">
                                {color.nom}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-default-900 dark:bg-default-100"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {product.colors.length > 5 && (
                          <span className="text-xs font-medium text-default-500 dark:text-default-400 bg-default-100 dark:bg-default-800 px-2 py-1 rounded-full">
                            +{product.colors.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Effet de brillance circulaire au survol */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl"></div>
                </motion.div>
              </Link>
            </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="flex flex-wrap md:justify-between justify-center md:gap-0 gap-4 mt-8 p-4 bg-default-50 dark:bg-default-900/20 rounded-lg border border-default-200 dark:border-default-700"
      >
        <p className="text-default-500 dark:text-default-400 text-sm flex items-center">
          Affichage de <b className="text-primary mx-1">{indexOfFirstItem + 1}</b> à <b className="text-primary mx-1">{Math.min(indexOfLastItem, normalizedProducts.length)}</b> sur <b className="text-primary mx-1">{normalizedProducts.length}</b> résultats
        </p>

        <nav className="flex items-center gap-2" aria-label="Pagination">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-sm border bg-white dark:bg-default-800 border-default-200 text-default-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LuChevronLeft className="size-4 me-1" /> Préc.
          </motion.button>

          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-default-500">...</span>
            ) : (
              <motion.button
                key={page}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => handlePageChange(page)}
                className={`btn size-9 transition-all duration-300 ${
                  page === currentPage
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white dark:bg-default-800 border border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/20'
                }`}
              >
                {page}
              </motion.button>
            )
          ))}

          <motion.button
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-sm border bg-white dark:bg-default-800 border-default-200 text-default-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suiv. <LuChevronRight className="size-4 ms-1" />
          </motion.button>
        </nav>
      </motion.div>
        </>
      )}
    </motion.div>;
};
export default Products;
