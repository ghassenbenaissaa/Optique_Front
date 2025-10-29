// filepath: d:\GHASSEN\Projet Optique\OptiqueFront\src\app\(landing)\product-landing\components\PromoBanner.jsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

/**
 * PromoBanner
 * - Bande promotionnelle fine placée au-dessus de la Navbar (fixed top-0)
 * - S'affiche au chargement, se cache lors d'un scroll vers le bas et réapparaît en scroll up / retour en haut
 * - Pleine largeur, responsive, style cohérent
 * - Correction : debounce et seuils pour éviter la vibration
 */
const PromoBanner = () => {
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const barRef = useRef(null);
  const ticking = useRef(false);
  const scrollTimeout = useRef(null);

  // Met à jour la variable CSS globale selon la visibilité et la hauteur mesurée
  const updateOffsetVar = () => {
    const root = document.documentElement;
    const h = barRef.current?.offsetHeight || 0;
    root.style.setProperty('--promo-offset', visible ? `${h}px` : '0px');
    root.style.setProperty('--promo-transition-duration', '300ms');
  };

  useEffect(() => {
    const onScroll = () => {
      // Debounce avec requestAnimationFrame pour éviter les calculs multiples
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || 0;

          // Zone de sécurité en haut : toujours visible
          if (currentY < 10) {
            if (!visible) setVisible(true);
            lastScrollY.current = currentY;
            ticking.current = false;
            return;
          }

          // Calculer le delta de scroll
          const delta = currentY - lastScrollY.current;

          // Seuil de déclenchement augmenté pour éviter les micro-scrolls
          if (Math.abs(delta) < 20) {
            ticking.current = false;
            return;
          }

          // Clearner le timeout précédent
          if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
          }

          // Délai de stabilisation : attendre que le scroll soit stable
          scrollTimeout.current = setTimeout(() => {
            const finalY = window.scrollY || 0;
            const finalDelta = finalY - lastScrollY.current;

            // Scroll vers le bas : cacher
            if (finalDelta > 20) {
              setVisible(false);
            }
            // Scroll vers le haut : montrer (mais seulement si on a scrollé suffisamment)
            else if (finalDelta < -20) {
              setVisible(true);
            }

            lastScrollY.current = finalY;
          }, 100); // Attendre 100ms de stabilité

          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    // Initialisation
    lastScrollY.current = window.scrollY || 0;
    if (lastScrollY.current > 50) setVisible(false);

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [visible]);

  useEffect(() => {
    // Mesurer la hauteur à l'affichage et lors des resize
    updateOffsetVar();
    const onResize = () => {
      requestAnimationFrame(updateOffsetVar);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [visible]);

  // Observer la variable CSS pour détecter l'ouverture du menu mobile
  useEffect(() => {
    const checkMenuState = () => {
      const isOpen = document.documentElement.style.getPropertyValue('--mobile-menu-open') === '1';
      setMobileMenuOpen(isOpen);
    };

    // Observer les changements de style sur documentElement
    const observer = new MutationObserver(checkMenuState);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });

    // Vérification initiale
    checkMenuState();

    return () => observer.disconnect();
  }, []);

  return (
    <div
      role="region"
      aria-label="Promotion"
      ref={barRef}
      className={`fixed inset-x-0 top-0 z-[60] transition-all motion-reduce:transition-none duration-300 ease-in-out will-change-transform ${
        visible && !mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
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
