import { useEffect, useRef, useState } from 'react';
import banner from '@/assets/images/banner.avif';

/**
 * BannerCarousel - Défilement infini parfait avec CSS Transform
 * Fonctionne avec n'importe quel nombre de bannières
 * Autoplay 5s (pause au survol)
 * Navigation fluide sans saut visible - Boutons toujours actifs
 */
const BannerCarousel = () => {
  const trackRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const pauseAuto = useRef(false);
  const isResetting = useRef(false);

  // Bannières originales (peut être n'importe quel nombre)
  const originalBanners = [banner, banner, banner, banner];
  const totalBanners = originalBanners.length;

  // Triple duplication pour un défilement infini parfait
  // [...banners, ...banners, ...banners]
  const infiniteBanners = [
    ...originalBanners,
    ...originalBanners,
    ...originalBanners
  ];

  // Commence au milieu (2ème set)
  const initialIndex = totalBanners;

  // Déplace la track avec transform
  const moveToIndex = (index, withTransition = true) => {
    const track = trackRef.current;
    if (!track) return;

    if (withTransition) {
      track.style.transition = 'transform 0.5s ease-in-out';
    } else {
      track.style.transition = 'none';
    }

    const offset = -index * 100;
    track.style.transform = `translateX(${offset}%)`;
  };

  // Navigation suivante
  const next = () => {
    if (isResetting.current) return;

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    moveToIndex(nextIndex, true);

    // Si on dépasse le 2ème set, reset au début du 2ème set
    if (nextIndex >= totalBanners * 2) {
      isResetting.current = true;
      setTimeout(() => {
        setCurrentIndex(totalBanners);
        moveToIndex(totalBanners, false);
        isResetting.current = false;
      }, 550); // Juste après l'animation
    }
  };

  // Navigation précédente
  const prev = () => {
    if (isResetting.current) return;

    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);
    moveToIndex(prevIndex, true);

    // Si on va avant le 2ème set, reset à la fin du 2ème set
    if (prevIndex < totalBanners) {
      isResetting.current = true;
      setTimeout(() => {
        setCurrentIndex(totalBanners * 2 - 1);
        moveToIndex(totalBanners * 2 - 1, false);
        isResetting.current = false;
      }, 550);
    }
  };

  // Initialisation
  useEffect(() => {
    setMounted(true);
    // Positionner au début du 2ème set
    const timer = setTimeout(() => {
      setCurrentIndex(initialIndex);
      moveToIndex(initialIndex, false);
    }, 100);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autoplay toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!pauseAuto.current && !isResetting.current) {
        next();
      }
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // Gestion du resize
  useEffect(() => {
    const handleResize = () => {
      if (!isResetting.current) {
        moveToIndex(currentIndex, false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  return (
    <section
      className={`relative w-full ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} transition-all duration-500 ease-out`}
      aria-label="Bannières promotionnelles"
      style={{
        marginTop: 'calc(var(--promo-offset,0px) + var(--nav-height,0px))',
        transitionProperty: 'opacity, transform, margin-top'
      }}
    >
      {/* Container plus large - max-width élargi */}
      <div className="w-full max-w-[96%] xl:max-w-[98%] 2xl:max-w-[1600px] mx-auto px-2 sm:px-4">
        {/* Wrapper avec design créatif */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-default-200/50 dark:border-default-700/50 bg-white/50 dark:bg-default-800/50 backdrop-blur-sm"
          onMouseEnter={() => (pauseAuto.current = true)}
          onMouseLeave={() => (pauseAuto.current = false)}
        >
          {/* Décorations d'angle */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-br-full pointer-events-none z-10"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-tl-full pointer-events-none z-10"></div>

          {/* Track des bannières */}
          <div className="relative overflow-hidden rounded-3xl">
            <div
              ref={trackRef}
              className="flex w-full"
              style={{
                transform: `translateX(-${initialIndex * 100}%)`,
                willChange: 'transform'
              }}
            >
              {infiniteBanners.map((src, i) => (
                <div
                  key={`banner-slide-${i}`}
                  className="shrink-0 w-full"
                >
                  <div className="relative w-full h-[50vw] sm:h-[42vw] md:h-[36vw] lg:h-[500px] xl:h-[550px]">
                    <img
                      src={src}
                      alt={`Bannière ${(i % totalBanners) + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/* Overlay gradient pour améliorer la lisibilité */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Boutons de navigation - Style moderne */}
          <button
            type="button"
            aria-label="Bannière précédente"
            onClick={prev}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center rounded-2xl bg-white/95 dark:bg-default-800/95 backdrop-blur-md shadow-xl border border-default-200 dark:border-default-700 text-default-700 dark:text-default-300 hover:text-primary hover:border-primary hover:bg-white dark:hover:bg-default-800 transition-all duration-300 hover:scale-110 z-20 group"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-x-0.5 transition-transform">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            type="button"
            aria-label="Bannière suivante"
            onClick={next}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center rounded-2xl bg-white/95 dark:bg-default-800/95 backdrop-blur-md shadow-xl border border-default-200 dark:border-default-700 text-default-700 dark:text-default-300 hover:text-primary hover:border-primary hover:bg-white dark:hover:bg-default-800 transition-all duration-300 hover:scale-110 z-20 group"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-0.5 transition-transform">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          {/* Indicateurs de position - Style moderne avec background */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
            {originalBanners.map((_, i) => (
              <button
                key={`banner-indicator-${i}`}
                onClick={() => {
                  const targetIndex = totalBanners + i;
                  setCurrentIndex(targetIndex);
                  moveToIndex(targetIndex, true);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-white ${
                  i === (currentIndex % totalBanners) 
                    ? 'w-8 bg-white' 
                    : 'w-2 bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Aller à la bannière ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerCarousel;

