import { motion } from 'framer-motion';
import { LuSparkles } from 'react-icons/lu';
import { useState, useEffect, useRef } from 'react';

/**
 * PromoBanner - Bannière promotionnelle animée
 * Affiche une offre spéciale avec animation et gestion du scroll
 */
const PromoBanner = () => {
  const [isVisible] = useState(true);
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

  if (!isVisible) return null;

  return (
    <motion.div
      ref={barRef}
      role="region"
      aria-label="Promotion"
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: visible && !mobileMenuOpen ? 0 : -100,
        opacity: visible && !mobileMenuOpen ? 1 : 0
      }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className="fixed inset-x-0 top-0 z-[60] overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-primary bg-[length:200%_100%] animate-gradient"
    >
      {/* Animation de fond avec points lumineux */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute size-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 py-3">
        <div className="flex items-center justify-center gap-3 text-white">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <LuSparkles className="size-5" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm md:text-base font-medium text-center"
          >
            <span className="font-bold">Offre spéciale :</span> -20% sur toute la collection avec le code{' '}
            <motion.span
              className="inline-block font-bold bg-white text-primary px-2 py-0.5 rounded-md mx-1"
            >
              LUNETTES20
            </motion.span>
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default PromoBanner;

