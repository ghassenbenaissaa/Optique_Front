import { useParams, Link } from 'react-router';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LuArrowLeft, LuRefreshCw } from 'react-icons/lu';
import PageMeta from '@/components/PageMeta';
import Navbar from '@/app/(landing)/product-landing/components/Navbar.jsx';
import Footer from '@/app/(landing)/product-landing/components/Footer.jsx';
import ScrollToTop from '@/app/(landing)/product-grid/components/ScrollToTop.jsx';
import useProductDetails from './hooks/useProductDetails';
import ImageGallery from './components/ImageGallery';
import ProductInfo from './components/ProductInfo';
import ProductSpecifications from './components/ProductSpecifications';
import Breadcrumb from './components/Breadcrumb';
import SimilarProducts from './components/SimilarProducts';

const ProductDetails = () => {
  const { reference } = useParams();
  const { product, loading, error, refetch } = useProductDetails(reference);

  // État pour la couleur sélectionnée
  const [selectedColor, setSelectedColor] = useState(null);

  // Scroll vers le haut lors du chargement de la page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [reference]);

  // Réinitialiser la couleur sélectionnée quand le produit change
  useEffect(() => {
    setSelectedColor(null);
  }, [reference]);

  // Sélectionner la première couleur disponible par défaut
  useEffect(() => {
    if (product?.colors?.length > 0 && !selectedColor) {
      // Sélectionner la première couleur en stock, sinon la première couleur
      const availableColor = product.colors.find(c => c.stock > 0) || product.colors[0];
      setSelectedColor(availableColor);
    }
  }, [product, selectedColor]);

  // Trouver la variation correspondant à la couleur sélectionnée
  const selectedVariation = useMemo(() => {
    if (!selectedColor || !product?.variations) return null;
    return product.variations.find(
      v => v.nomcouleur === selectedColor.nom || v.hexcouleur?.toLowerCase() === selectedColor.code?.toLowerCase()
    );
  }, [selectedColor, product]);

  // Images à afficher (celles de la variation sélectionnée ou toutes)
  const displayImages = useMemo(() => {
    if (selectedColor?.images?.length > 0) {
      return selectedColor.images;
    }
    return product?.allImages || [];
  }, [selectedColor, product]);

  // Handler pour le changement de couleur
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    // Scroll vers le haut pour voir les nouvelles images
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <PageMeta title={product?.name ? `${product.name} | Optique` : 'Détails du produit'} />
      <Navbar />

      {/* Hero Section avec fond gradient */}
      <section
        className="relative min-h-screen bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent dark:from-primary/10 dark:via-purple-500/10 overflow-hidden"
        style={{
          paddingTop: 'calc(var(--nav-height, 80px) + var(--promo-offset, 0px) + 1rem)',
        }}
      >
        {/* Éléments décoratifs de fond - cachés sur mobile pour performance */}
        <div className="hidden sm:block absolute top-0 start-0 size-64 md:size-96 bg-primary/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="hidden sm:block absolute bottom-0 end-0 size-64 md:size-96 bg-purple-500/10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

        <div className="container relative z-10 px-4 sm:px-6 py-6 sm:py-8 md:py-12 overflow-x-hidden">
          {/* État de chargement */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <div className="relative">
                <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
              <p className="mt-8 text-lg text-default-600 dark:text-default-400 font-medium">
                Chargement du produit...
              </p>
            </motion.div>
          )}

          {/* État d'erreur */}
          {!loading && error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 sm:py-32 px-4"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-6 sm:mb-8">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-default-800 dark:text-default-100 mb-4 text-center">
                Produit introuvable
              </h2>
              <p className="text-red-600 dark:text-red-400 font-medium text-base sm:text-lg mb-6 text-center max-w-md">
                {error}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={refetch}
                  className="flex items-center justify-center gap-2 btn bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-xl w-full sm:w-auto"
                >
                  <LuRefreshCw className="w-5 h-5" />
                  Réessayer
                </motion.button>
                <Link
                  to="/product"
                  className="flex items-center justify-center gap-2 btn border border-default-200 dark:border-default-700 bg-white dark:bg-default-800 text-default-700 dark:text-default-300 hover:bg-default-50 dark:hover:bg-default-800/70 px-6 py-3 rounded-xl w-full sm:w-auto"
                >
                  <LuArrowLeft className="w-5 h-5" />
                  Retour aux produits
                </Link>
              </div>
            </motion.div>
          )}

          {/* Contenu du produit */}
          {!loading && !error && product && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Breadcrumb - caché sur très petit écran */}
              <div className="mb-4 sm:mb-8 hidden sm:block">
                <Breadcrumb productName={product.name} category={product.category} />
              </div>

              {/* Bouton retour */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4 sm:mb-6"
              >
                <Link
                  to="/product"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm text-default-600 dark:text-default-400 hover:text-primary transition-colors duration-200 group"
                >
                  <LuArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  Retour aux produits
                </Link>
              </motion.div>

              {/* Grille principale */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">
                {/* Colonne gauche - Images */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <ImageGallery
                    images={displayImages}
                    productName={product.name}
                  />
                </motion.div>

                {/* Colonne droite - Informations */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <ProductInfo
                    product={product}
                    selectedColor={selectedColor}
                    onColorSelect={handleColorSelect}
                    selectedVariation={selectedVariation}
                  />
                </motion.div>
              </div>

              {/* Section Spécifications */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 lg:pt-12 border-t border-default-200/50 dark:border-default-700/50"
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-default-800 dark:text-default-100 mb-4 sm:mb-6 lg:mb-8">
                  Spécifications du produit
                </h2>
                <ProductSpecifications
                  dimensions={product.dimensions}
                  characteristics={product.characteristics}
                />
              </motion.div>

              {/* Section Variations détaillées */}
              {product.variations?.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 lg:pt-12 border-t border-default-200/50 dark:border-default-700/50"
                >
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-default-800 dark:text-default-100 mb-4 sm:mb-6 lg:mb-8">
                    Toutes les variations
                  </h2>
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {product.variations.map((variation, index) => (
                      <motion.div
                        key={variation.id || index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        onClick={() => {
                          const color = product.colors.find(c => c.nom === variation.nomcouleur);
                          if (color) handleColorSelect(color);
                        }}
                        className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                          selectedColor?.nom === variation.nomcouleur
                            ? 'border-primary bg-primary/5 shadow-lg'
                            : 'border-default-200 dark:border-default-700 hover:border-primary/50 bg-white/60 dark:bg-default-800/40'
                        } ${(variation.quantity || variation.stock || 0) === 0 ? 'opacity-60' : ''}`}
                      >
                        {/* Badge couleur */}
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                            style={{ backgroundColor: variation.hexcouleur }}
                          />
                          <span className="font-medium text-default-800 dark:text-default-200">
                            {variation.nomcouleur}
                          </span>
                        </div>

                        {/* Prix */}
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-lg font-bold text-primary">
                            {variation.price?.toFixed(2)} TND
                          </span>
                          {variation.solde > 0 && (
                            <span className="text-xs font-medium text-red-500">
                              -{Math.round(variation.solde)}%
                            </span>
                          )}
                        </div>

                        {/* Stock */}
                        <p className={`text-sm ${
                          (variation.quantity || variation.stock || 0) > 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-500'
                        }`}>
                          {(variation.quantity || variation.stock || 0) > 0
                            ? `${variation.quantity || variation.stock} en stock`
                            : 'Épuisé'
                          }
                        </p>

                        {/* Badge de sélection */}
                        {selectedColor?.nom === variation.nomcouleur && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Section Autres Produits */}
              <SimilarProducts
                key={`similar-${product.reference}`}
                currentProduct={product}
                selectedVariation={selectedVariation}
              />
            </motion.div>
          )}
        </div>
      </section>

      <ScrollToTop />
      <Footer />
    </>
  );
};

export default ProductDetails;


