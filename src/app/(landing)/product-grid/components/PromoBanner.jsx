import { motion, useReducedMotion } from 'framer-motion';
import { LuSparkles } from 'react-icons/lu';
import { useState, useEffect, useRef, useMemo } from 'react';

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
  const heightRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  // Génère une liste stable de particules (moins nombreuses) une fois pour toutes
  const particles = useMemo(() => {
    const count = prefersReducedMotion ? 0 : 8; // réduire drastiquement le coût
    return Array.from({ length: count }).map((_, i) => ({
      key: `p-${i}-${Math.random().toString(36).slice(2)}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
  }, [prefersReducedMotion]);

  // Met à jour la variable CSS globale depuis la hauteur mémorisée
  const writeOffsetVar = (h) => {
    const root = document.documentElement;
    root.style.setProperty('--promo-offset', visible ? `${h}px` : '0px');
    root.style.setProperty('--promo-transition-duration', '300ms');
  };

  // Observer de taille sans forcer reflow au scroll
  useEffect(() => {
    if (!barRef.current) return;
    const el = barRef.current;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = Math.ceil(entry.contentRect.height || 0);
        if (h !== heightRef.current) {
          heightRef.current = h;
          requestAnimationFrame(() => writeOffsetVar(h));
        }
      }
    });
    ro.observe(el);
    // écrire une fois à l'init
    requestAnimationFrame(() => writeOffsetVar(heightRef.current));
    return () => ro.disconnect();
  }, [visible]);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || 0;
          if (currentY < 10) {
            if (!visible) setVisible(true);
            lastScrollY.current = currentY;
            ticking.current = false;
            return;
          }
          const delta = currentY - lastScrollY.current;
          if (Math.abs(delta) < 30) {
            ticking.current = false;
            return;
          }
          if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
          scrollTimeout.current = setTimeout(() => {
            const finalY = window.scrollY || 0;
            const finalDelta = finalY - lastScrollY.current;
            if (finalDelta > 20) setVisible(false);
            else if (finalDelta < -20) setVisible(true);
            lastScrollY.current = finalY;
          }, 120);
          ticking.current = false;
        });
      }
    };

    lastScrollY.current = window.scrollY || 0;
    if (lastScrollY.current > 50) setVisible(false);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [visible]);

  // Surveille uniquement les changements de la variable css concernée (optimisé)
  useEffect(() => {
    const checkMenuState = () => {
      const val = document.documentElement.style.getPropertyValue('--mobile-menu-open');
      setMobileMenuOpen(val === '1');
    };
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'style') checkMenuState();
      }
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    checkMenuState();
    return () => obs.disconnect();
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      ref={barRef}
      role="region"
      aria-label="Promotion"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: visible && !mobileMenuOpen ? 0 : -100, opacity: visible && !mobileMenuOpen ? 1 : 0 }}
      exit={{ y: -100, opacity: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 18 }}
      className="fixed inset-x-0 top-0 z-[60] overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-primary bg-[length:200%_100%] will-change-transform"
    >
      {!prefersReducedMotion && (
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.key}
              className="absolute size-1.5 bg-white rounded-full"
              style={{ left: p.left, top: p.top }}
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
            />
          ))}
        </div>
      )}

      <div className="container relative z-10 py-2.5">
        <div className="flex items-center justify-center gap-3 text-white">
          {!prefersReducedMotion && (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
              <LuSparkles className="size-5" />
            </motion.div>
          )}
          <p className="text-sm md:text-base font-medium text-center">
            <span className="font-bold">Offre spéciale :</span> -20% sur toute la collection avec le code{' '}
            <span className="inline-block font-bold bg-white text-primary px-2 py-0.5 rounded-md mx-1">LUNETTES20</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PromoBanner;
