// filepath: d:\GHASSEN\Projet Optique\OptiqueFront\src\app\(landing)\product-landing\components\PromoBanner.jsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

/**
 * PromoBanner
 * - Bande promotionnelle fine placée au-dessus de la Navbar (fixed top-0)
 * - S'affiche au chargement, se cache lors d'un scroll vers le bas et réapparaît en scroll up / retour en haut
 * - Pleine largeur, responsive, style cohérent
 */
const PromoBanner = () => {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const barRef = useRef(null);

  // Met à jour la variable CSS globale selon la visibilité et la hauteur mesurée
  const updateOffsetVar = () => {
    const root = document.documentElement;
    const h = barRef.current?.offsetHeight || 0;
    root.style.setProperty('--promo-offset', visible ? `${h}px` : '0px');
    // Ajouter une classe pour indiquer que la transition est en cours
    root.style.setProperty('--promo-transition-duration', '300ms');
  };

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY || 0;
      if (currentY < 8) {
        setVisible(true);
        lastScrollY.current = currentY;
        return;
      }
      const delta = currentY - lastScrollY.current;
      if (Math.abs(delta) < 6) return;
      if (delta > 0) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };

    lastScrollY.current = window.scrollY || 0;
    if (lastScrollY.current > 32) setVisible(false);

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Mesurer la hauteur à l'affichage et lors des resize
    updateOffsetVar();
    const onResize = () => {
      // attendre la fin du layout
      requestAnimationFrame(updateOffsetVar);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [visible]);

  return (
    <div
      role="region"
      aria-label="Promotion"
      ref={barRef}
      className={`fixed inset-x-0 top-0 z-[60] transition-transform motion-reduce:transition-none duration-300 ease-in-out will-change-transform ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Bande pleine largeur avec gradient + séparateur bas */}
      <div className="w-full bg-gradient-to-r from-primary to-purple-500 text-white border-b border-default-200/60">
        <div className="flex items-center justify-center gap-3 px-4 sm:px-6 py-1 md:py-2">
          <span className="text-sm md:text-[0.95rem] leading-6 text-center">
            Livraison gratuite dès 50 TND — Profitez-en maintenant !
          </span>
          <span className="hidden md:inline-block text-white/70">•</span>
          <Link
            to="#product"
            className="hidden md:inline-flex items-center text-white/95 underline-offset-4 hover:underline"
          >
            Voir nos produits
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
