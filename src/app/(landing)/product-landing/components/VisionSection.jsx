import { useState, useEffect, useRef } from 'react';
import { LuSun, LuGlasses } from 'react-icons/lu';
import { Link } from 'react-router';

/**
 * VisionSection - Section "Chaque vision de vous"
 * Section moderne et élégante avec animation d'apparition au scroll
 * Deux CTA pour lunettes de soleil et lunettes de vue
 */
const VisionSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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
      className="relative py-16 md:py-20 lg:py-24 overflow-hidden"
    >
      {/* Éléments de fond décoratifs avec blur */}
      <div className="absolute top-1/4 start-0 size-96 bg-primary/5 blur-3xl rounded-full"></div>
      <div className="absolute bottom-1/4 end-0 size-96 bg-purple-500/5 blur-3xl rounded-full"></div>

      <div className="container relative z-10">
        {/* Animation fade-in + slide-up avec Tailwind */}
        <div
          className={`transition-all duration-1000 ease-out ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Conteneur centré avec largeur max */}
          <div className="max-w-4xl mx-auto text-center">
            {/* Sous-titre léger */}
            <p
              className={`text-primary font-medium text-sm md:text-base tracking-wider uppercase mb-4 transition-all delay-100 duration-1000 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              C'est toujours une belle journée pour acheter des lunettes en ligne
            </p>

            {/* Titre principal avec typographie expressive */}
            <h2
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-default-900 dark:text-default-100 mb-6 leading-tight transition-all delay-200 duration-1000 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              Chaque vision{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  de vous
                </span>
                {/* Décoration sous le texte */}
                <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-10 transform -skew-x-12"></span>
              </span>
            </h2>

            {/* Texte descriptif fluide */}
            <p
              className={`text-lg md:text-xl text-default-600 dark:text-default-400 mb-10 leading-relaxed max-w-3xl mx-auto transition-all delay-300 duration-1000 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              Exprimez votre style et votre vision avec des lunettes et des
              lunettes de soleil abordables. Découvrez des milliers de modèles
              avec l'essai virtuel, la livraison en 2 jours et des montures à
              partir de seulement{' '}
              <span className="font-bold text-primary">50 TND</span> !
            </p>

            {/* Conteneur des boutons CTA */}
            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 transition-all delay-500 duration-1000 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              {/* Bouton Lunettes de soleil - Style principal avec gradient */}
              <Link to="#product">
                <button
                  type="button"
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary to-purple-600 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden min-w-[240px] sm:min-w-[260px]"
                >
                  {/* Effet de brillance au survol */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>

                  <LuSun className="size-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="relative">Acheter des lunettes de soleil</span>
                </button>
              </Link>

              {/* Bouton Lunettes de vue - Style secondaire avec bordure */}
              <Link to="#product">
                <button
                  type="button"
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-default-900 dark:text-default-100 bg-transparent border-2 border-default-300 dark:border-default-700 rounded-xl hover:border-primary dark:hover:border-primary hover:bg-primary/5 transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 min-w-[240px] sm:min-w-[260px]"
                >
                  <LuGlasses className="size-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative">Acheter des lunettes de vue</span>

                  {/* Petit indicateur animé */}
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-3/4 transition-all duration-300"></span>
                </button>
              </Link>
            </div>

            {/* Badge de confiance / Info supplémentaire */}
            <div
              className={`mt-12 flex items-center justify-center gap-6 text-sm text-default-500 transition-all delay-700 duration-1000 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Livraison gratuite dès 50 TND</span>
              </div>
              <span className="hidden sm:inline text-default-300">•</span>
              <div className="hidden sm:flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Essai virtuel gratuit</span>
              </div>
              <span className="hidden md:inline text-default-300">•</span>
              <div className="hidden md:flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Retours sous 30 jours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;

