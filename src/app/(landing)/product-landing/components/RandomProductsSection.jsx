import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import api from '@/lib/axios';
import { LuShoppingCart, LuHeart } from 'react-icons/lu';

/**
 * RandomProductsSection - Section "Découvrez nos montures populaires"
 * Affiche 4 produits aléatoires récupérés depuis l'API avec un design premium
 */
const RandomProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Fonction pour sélectionner 4 produits aléatoires
  const getRandomProducts = (productsArray, count = 4) => {
    const shuffled = [...productsArray].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  // Récupération des produits depuis l'API
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/produit/all');

        if (isMounted) {
          const productsData = Array.isArray(response?.data)
            ? response.data
            : response?.data?.data || [];

          // Sélectionner 4 produits aléatoires
          const randomProducts = getRandomProducts(productsData, 4);
          setProducts(randomProducts);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Erreur lors du chargement des produits:', err);
          setError('Impossible de charger les produits.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Animation d'apparition au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-12 md:py-16 lg:py-20 overflow-hidden"
    >
      {/* Fond décoratif avec gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-default-50 via-white to-default-50 dark:from-default-900 dark:via-default-900/50 dark:to-default-900"></div>
      <div className="absolute top-1/3 start-1/4 size-96 bg-primary/5 blur-3xl rounded-full"></div>
      <div className="absolute bottom-1/3 end-1/4 size-96 bg-purple-500/5 blur-3xl rounded-full"></div>

      <div className="container relative z-10">
        {/* En-tête de section */}
        <div
          className={`text-center mb-10 md:mb-12 transition-all duration-1000 ease-out ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Badge */}
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary rounded-full">
            Sélection du moment
          </span>

          {/* Titre principal */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-default-900 dark:text-default-100 mb-3">
            Découvrez nos{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                montures populaires
              </span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -z-10 transform -skew-x-12"></span>
            </span>
          </h2>

          {/* Sous-titre */}
          <p className="text-base md:text-lg text-default-600 dark:text-default-400 max-w-2xl mx-auto">
            Une sélection unique de montures tendances pour affirmer votre style
          </p>
        </div>

        {/* Contenu : Loading / Error / Grille de produits */}
        <div className="relative">
          {/* État de chargement */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
              <p className="mt-6 text-default-600 dark:text-default-400 font-medium">
                Chargement des produits...
              </p>
            </div>
          )}

          {/* État d'erreur */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Grille de produits - NOUVEAU DESIGN CRÉATIF */}
          {!loading && !error && products.length > 0 && (
            <div className="flex justify-center mb-10">
              <div
                className={`grid gap-6 md:gap-8 w-full ${
                  products.length === 1 ? 'grid-cols-1 max-w-[320px]' :
                  products.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-[680px]' :
                  products.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-[1040px]' :
                  'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-[1400px]'
                }`}
              >
              {products.map((product, index) => {
                const productName = product.nom || product.name || 'Monture';
                const productPrice = product.price || product.prix || 0;
                const productImage =
                  Array.isArray(product.variations) &&
                  product.variations.length > 0 &&
                  Array.isArray(product.variations[0].imageUrl) &&
                  product.variations[0].imageUrl.length > 0
                    ? product.variations[0].imageUrl[0]
                    : null;

                // Extraire les couleurs uniques depuis les variations (backend retourne nomcouleur et hexcouleur)
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
                const productColors = Array.from(uniqueColorsMap.values());

                const productKey = `product-${index}-${productName}-${Date.now()}`;

                return (
                  <div
                    key={productKey}
                    className={`group transition-all duration-700 ease-out ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{
                      transitionDelay: `${index * 150}ms`,
                    }}
                  >
                    <Link
                      to={`/product/${encodeURIComponent(product.reference)}`}
                      className="block"
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <div className="relative bg-white/60 dark:bg-default-800/60 backdrop-blur-md rounded-3xl overflow-hidden border border-default-200/50 dark:border-default-700/50 transition-all duration-500 hover:shadow-2xl hover:border-primary/30 hover:scale-[1.02]">

                        {/* Container image rectangulaire - TAILLE AUGMENTÉE */}
                        <div className="relative p-4 bg-gradient-to-br from-default-50/50 to-transparent dark:from-default-900/30">
                          <div className="relative aspect-[5/4] rounded-2xl overflow-hidden bg-white dark:bg-default-800 shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
                            {productImage ? (
                              <img
                                src={productImage}
                                alt={productName}
                                className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-4xl font-bold text-primary/30">
                                  {productName.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Badge prix flottant */}
                          <div className="absolute top-4 right-4 bg-white/90 dark:bg-default-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-default-200/50 dark:border-default-700/50">
                            <div className="flex items-center gap-1.5">
                              <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                {productPrice.toFixed(0)}
                              </span>
                              <span className="text-xs font-semibold text-default-600 dark:text-default-400">
                                TND
                              </span>
                            </div>
                          </div>

                          {/* Actions rapides en bas à gauche */}
                          <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <button className="w-9 h-9 rounded-full bg-white/90 dark:bg-default-800/90 backdrop-blur-sm flex items-center justify-center text-default-700 dark:text-default-300 hover:bg-primary hover:text-white transition-all duration-300 shadow-lg hover:scale-110">
                              <LuShoppingCart className="w-4 h-4" />
                            </button>
                            <button className="w-9 h-9 rounded-full bg-white/90 dark:bg-default-800/90 backdrop-blur-sm flex items-center justify-center text-default-700 dark:text-default-300 hover:bg-primary hover:text-white transition-all duration-300 shadow-lg hover:scale-110">
                              <LuHeart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Informations produit avec design épuré */}
                        <div className="px-6 pb-6 pt-2">
                          {/* Nom du produit */}
                          <h3 className="text-center text-base md:text-lg font-semibold text-default-800 dark:text-default-100 mb-3 line-clamp-1 group-hover:text-primary transition-colors duration-300">
                            {productName}
                          </h3>

                          {/* Couleurs disponibles en ligne horizontale */}
                          {Array.isArray(productColors) && productColors.length > 0 && (
                            <div className="flex items-center justify-center gap-2 mb-3">
                              {productColors.slice(0, 5).map((color, colorIndex) => {
                                const colorValue = color.code || color.couleur || '#cccccc';
                                const colorKey = `color-dot-${productKey}-${colorIndex}`;

                                return (
                                  <div
                                    key={colorKey}
                                    className="relative group/color"
                                  >
                                    <div
                                      className="w-6 h-6 rounded-full cursor-pointer transition-all duration-300 hover:scale-125 border-2 border-white dark:border-default-700 shadow-md"
                                      style={{
                                        backgroundColor: colorValue,
                                        boxShadow: `0 2px 8px ${colorValue}50`
                                      }}
                                    ></div>

                                    {/* Tooltip */}
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/color:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                                      <div className="bg-default-900 dark:bg-default-100 text-white dark:text-default-900 px-2 py-1 rounded text-xs font-medium shadow-lg">
                                        {color.nom || color.name || 'Couleur'}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                              {productColors.length > 5 && (
                                <span className="text-xs font-medium text-default-500 dark:text-default-400">
                                  +{productColors.length - 5}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Bouton "Découvrir" au centre */}
                          <div className="text-center mt-4">
                            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all duration-300">
                              <span>Découvrir</span>
                              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </span>
                          </div>
                        </div>

                        {/* Effet de brillance circulaire */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                      </div>
                    </Link>
                  </div>
                );
              })}
              </div>
            </div>
          )}

          {/* Bouton "Afficher plus" */}
          {!loading && !error && products.length > 0 && (
            <div
              className={`text-center transition-all duration-1000 delay-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Link
                to="/product"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <button
                  type="button"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary to-purple-600 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 overflow-hidden relative"
                >
                  {/* Effet de brillance */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>

                  <span className="relative">Afficher plus de produits</span>
                  <svg
                    className="relative w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </Link>

              {/* Texte d'information */}
              <p className="mt-4 text-sm text-default-500 dark:text-default-400">
                Explorez notre collection complète de montures
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RandomProductsSection;

