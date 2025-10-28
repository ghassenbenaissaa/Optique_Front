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
      className={`relative w-full overflow-hidden ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} transition-all duration-500 ease-out`}
      aria-label="Bannières promotionnelles"
      style={{
        marginTop: 'calc(var(--promo-offset,0px) + var(--nav-height,0px))',
        transitionProperty: 'opacity, transform, margin-top'
      }}
      onMouseEnter={() => (pauseAuto.current = true)}
      onMouseLeave={() => (pauseAuto.current = false)}
    >
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
            <div className="relative w-full h-[48vw] sm:h-[42vw] md:h-[36vw] lg:h-[520px]">
              <img
                src={src}
                alt={`Bannière ${(i % totalBanners) + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Boutons de navigation flottants - toujours actifs */}
      <button
        type="button"
        aria-label="Bannière précédente"
        onClick={prev}
        className="hidden sm:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-default-200 text-default-700 hover:text-primary hover:bg-white transition-all hover:scale-110 z-10"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button
        type="button"
        aria-label="Bannière suivante"
        onClick={next}
        className="hidden sm:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-default-200 text-default-700 hover:text-primary hover:bg-white transition-all hover:scale-110 z-10"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* Indicateurs de position (optionnel) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {originalBanners.map((_, i) => (
          <div
            key={`banner-indicator-${i}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === (currentIndex % totalBanners) 
                ? 'w-8 bg-primary' 
                : 'w-2 bg-white/50'
            }`}
            aria-label={`Bannière ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default BannerCarousel;

