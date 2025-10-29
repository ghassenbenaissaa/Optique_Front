import { useState, useEffect, useRef } from 'react';
import api from '@/lib/axios';

/**
 * ShapeSection - Section "Achetez selon la forme"
 * Affiche dynamiquement les formes de produits récupérées depuis l'API
 * Design moderne avec animations au scroll et effets hover élégants
 */
const ShapeSection = () => {
  const [shapes, setShapes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Récupération des formes depuis l'API
  useEffect(() => {
    let isMounted = true;

    const fetchShapes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/formeProduit/getAll');

        if (isMounted) {
          // L'API peut retourner les données directement ou dans response.data.data
          const shapesData = Array.isArray(response?.data)
            ? response.data
            : response?.data?.data || [];

          setShapes(shapesData);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Erreur lors du chargement des formes:', err);
          setError('Impossible de charger les formes. Veuillez réessayer plus tard.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchShapes();

    return () => {
      isMounted = false;
    };
  }, []);

  // Animation d'apparition au scroll avec IntersectionObserver
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
      className="relative py-8 md:py-12 lg:py-16 overflow-hidden bg-gradient-to-b from-transparent via-default-50/30 to-transparent dark:via-default-900/10"
    >
      {/* Éléments décoratifs de fond */}
      <div className="absolute top-0 end-0 size-80 bg-purple-500/5 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 start-0 size-80 bg-primary/5 blur-3xl rounded-full"></div>

      <div className="container relative z-10">
        {/* En-tête de section avec animation - ESPACEMENT RÉDUIT */}
        <div
          className={`text-center mb-8 md:mb-10 transition-all duration-1000 ease-out ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Badge supérieur */}
          <span className="inline-block px-4 py-1.5 mb-3 text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary rounded-full">
            Trouvez votre style
          </span>

          {/* Titre principal - TAILLE RÉDUITE */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-default-900 dark:text-default-100 mb-3">
            Achetez selon la{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                forme
              </span>
              {/* Décoration sous le texte */}
              <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -z-10 transform -skew-x-12"></span>
            </span>
          </h2>

          {/* Sous-titre - TAILLE RÉDUITE */}
          <p className="text-base md:text-lg text-default-600 dark:text-default-400 max-w-2xl mx-auto">
            Découvrez la forme parfaite qui complète votre visage et exprime votre personnalité
          </p>
        </div>

        {/* Contenu : Loading / Error / Grille de formes */}
        <div className="relative">
          {/* État de chargement */}
          {loading && (
            <div
              className={`flex flex-col items-center justify-center py-20 transition-all duration-500 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="relative">
                {/* Spinner animé */}
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                {/* Cercle intérieur pour effet plus élaboré */}
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-purple-500/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <p className="mt-6 text-default-600 dark:text-default-400 font-medium">
                Chargement des formes...
              </p>
            </div>
          )}

          {/* État d'erreur */}
          {!loading && error && (
            <div
              className={`flex flex-col items-center justify-center py-20 transition-all duration-500 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-red-600 dark:text-red-400 font-medium text-center max-w-md">
                {error}
              </p>
            </div>
          )}

          {/* Grille de formes - DESIGN CRÉATIF ET COMPACT */}
          {!loading && !error && shapes.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {shapes.map((shape, index) => {
                const shapeName = shape.nom || shape.name || 'Forme';
                const shapeImage = shape.imageUrl || shape.image || null;
                const shapeKey = `shape-${index}-${shapeName}`;

                return (
                  <div
                    key={shapeKey}
                    className={`group transition-all duration-700 ease-out ${
                      isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                    }`}
                    style={{
                      transitionDelay: `${index * 80}ms`,
                    }}
                  >
                    {/* Carte de forme - DESIGN CIRCULAIRE MODERNE */}
                    <a
                      href="#product"
                      className="block relative"
                    >
                      {/* Container principal avec effet glassmorphism */}
                      <div className="relative">
                        {/* Cercle de fond avec gradient animé */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 via-purple-500/10 to-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Cercle principal avec bordure */}
                        <div className="relative aspect-square rounded-full bg-white/80 dark:bg-default-800/80 backdrop-blur-sm border-2 border-default-200/50 dark:border-default-700/50 shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:border-primary/50 group-hover:scale-110">
                          {/* Container de l'image */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            {shapeImage ? (
                              <img
                                src={shapeImage}
                                alt={shapeName}
                                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-125 group-hover:rotate-6"
                                loading="lazy"
                              />
                            ) : (
                              // Placeholder moderne
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center backdrop-blur-sm">
                                <span className="text-xl font-bold text-primary/60">
                                  {shapeName.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Effet de brillance circulaire au survol */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full"></div>

                          {/* Anneau coloré qui apparaît au survol */}
                          <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-primary/20 transition-all duration-500"></div>
                        </div>
                      </div>

                      {/* Nom de la forme - EN DESSOUS DU CERCLE */}
                      <div className="mt-3 text-center">
                        <h3 className="text-xs sm:text-sm font-semibold text-default-800 dark:text-default-100 transition-colors duration-300 group-hover:text-primary px-1">
                          {shapeName}
                        </h3>

                        {/* Ligne décorative qui s'anime */}
                        <div className="mt-1.5 mx-auto w-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 group-hover:w-12 transition-all duration-500 rounded-full"></div>
                      </div>

                      {/* Badge flottant au survol */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          )}

          {/* Message si aucune forme disponible */}
          {!loading && !error && shapes.length === 0 && (
            <div
              className={`flex flex-col items-center justify-center py-20 transition-all duration-500 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="w-20 h-20 rounded-full bg-default-100 dark:bg-default-800 flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-default-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-default-600 dark:text-default-400 font-medium">
                Aucune forme disponible pour le moment
              </p>
            </div>
          )}
        </div>

        {/* CTA ou information supplémentaire (optionnel) */}
        {!loading && !error && shapes.length > 0 && (
          <div
            className={`text-center mt-12 transition-all duration-1000 delay-500 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="text-sm text-default-500 dark:text-default-400 mb-4">
              Besoin d'aide pour choisir ? Contactez nos experts
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-primary hover:text-purple-600 font-medium transition-colors duration-300"
            >
              <span>Guide des formes</span>
              <svg
                className="w-5 h-5"
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
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShapeSection;

