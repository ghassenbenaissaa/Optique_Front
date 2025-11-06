import { motion, AnimatePresence } from 'framer-motion';
import { LuX, LuFilter } from 'react-icons/lu';
import { useState } from 'react';
import ProductFilter from './ProductFilter';

/**
 * MobileFilter - Bouton et panneau latéral pour les filtres sur mobile
 * Design moderne avec animations fluides
 */
const MobileFilter = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bouton flottant mobile */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 end-6 z-40 btn size-14 rounded-full bg-primary text-white shadow-2xl hover:shadow-primary/50 transition-all duration-300"
      >
        <LuFilter className="size-6" />
      </motion.button>

      {/* Panneau latéral */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            />

            {/* Panneau */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 start-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-default-900 z-50 shadow-2xl overflow-y-auto lg:hidden"
            >
              {/* En-tête */}
              <div className="sticky top-0 bg-white dark:bg-default-900 border-b border-default-200 dark:border-default-700 p-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-bold text-default-900 dark:text-default-100">
                  Filtres
                </h3>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="size-10 flex items-center justify-center rounded-full bg-default-100 dark:bg-default-800 text-default-600 dark:text-default-300 hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <LuX className="size-5" />
                </motion.button>
              </div>

              {/* Contenu */}
              <div className="p-4">
                <ProductFilter />
              </div>

              {/* Footer avec boutons d'action */}
              <div className="sticky bottom-0 bg-white dark:bg-default-900 border-t border-default-200 dark:border-default-700 p-4 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 btn bg-default-100 dark:bg-default-800 text-default-700 dark:text-default-300 hover:bg-default-200 transition-all duration-300"
                >
                  Annuler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 btn bg-primary text-white hover:bg-primary/90 transition-all duration-300"
                >
                  Appliquer
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileFilter;

