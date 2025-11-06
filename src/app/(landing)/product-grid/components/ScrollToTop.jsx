import { motion, AnimatePresence } from 'framer-motion';
import { LuArrowUp } from 'react-icons/lu';
import { useState, useEffect } from 'react';

/**
 * ScrollToTop - Bouton flottant pour remonter en haut de page
 * Apparaît après un certain scroll avec animation élégante
 */
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-6 start-6 z-40 size-12 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 text-white shadow-2xl hover:shadow-primary/50 transition-all duration-300 group"
          aria-label="Retour en haut"
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <LuArrowUp className="size-5" />
          </motion.div>

          {/* Effet de lueur */}
          <div className="absolute inset-0 rounded-full bg-primary blur-xl opacity-50 group-hover:opacity-70 transition-opacity -z-10"></div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;

