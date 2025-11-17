import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import filtreService from '../services/filtreService';
import { DEFAULT_FILTER_VALUES } from '../types/filtre';
const filterConfig = [{
  id: 'type-verre',
  title: 'Type de verre',
  options: [{
    id: 'type-vue',
    label: 'Lunettes de vue'
  }, {
    id: 'type-soleil',
    label: 'Lunettes de soleil'
  }, {
    id: 'type-ia',
    label: 'Lunettes IA'
  }]
}, {
  id: 'genre',
  title: 'Genre',
  options: [{
    id: 'genre-homme',
    label: 'Homme'
  }, {
    id: 'genre-femme',
    label: 'Femme'
  }, {
    id: 'genre-unisex',
    label: 'Unisexe'
  }, {
    id: 'genre-enfant',
    label: 'Enfant'
  }]
}, {
  id: 'taille',
  title: 'Taille',
  options: [{
    id: 'taille-extra-petit',
    label: 'Extra Petit'
  }, {
    id: 'taille-petit',
    label: 'Petit'
  }, {
    id: 'taille-moyen',
    label: 'Moyen'
  }, {
    id: 'taille-grand',
    label: 'Grand'
  }, {
    id: 'taille-extra-grand',
    label: 'Extra Grand'
  }, {
    id: 'taille-sur-mesure',
    label: 'Sur mesure',
    isCustomSize: true
  }]
}, {
  id: 'forme',
  title: 'Forme',
  options: [{
    id: 'forme-rectangulaire',
    label: 'Rectangulaire'
  }, {
    id: 'forme-ronde',
    label: 'Ronde'
  }, {
    id: 'forme-ovale',
    label: 'Ovale'
  }, {
    id: 'forme-carree',
    label: 'Carrée'
  }, {
    id: 'forme-papillon',
    label: 'Papillon'
  }, {
    id: 'forme-aviateur',
    label: 'Aviateur'
  }, {
    id: 'forme-wayfarer',
    label: 'Wayfarer'
  }]
}, {
  id: 'couleur',
  title: 'Couleur',
  options: [{
    id: 'couleur-noir',
    label: 'Noir',
    isColor: true,
    colorCode: '#000000'
  }, {
    id: 'couleur-marron',
    label: 'Marron',
    isColor: true,
    colorCode: '#8B4513'
  }, {
    id: 'couleur-bleu',
    label: 'Bleu',
    isColor: true,
    colorCode: '#0000FF'
  }, {
    id: 'couleur-rouge',
    label: 'Rouge',
    isColor: true,
    colorCode: '#FF0000'
  }, {
    id: 'couleur-vert',
    label: 'Vert',
    isColor: true,
    colorCode: '#00FF00'
  }, {
    id: 'couleur-gris',
    label: 'Gris',
    isColor: true,
    colorCode: '#808080'
  }, {
    id: 'couleur-rose',
    label: 'Rose',
    isColor: true,
    colorCode: '#FFC0CB'
  }, {
    id: 'couleur-violet',
    label: 'Violet',
    isColor: true,
    colorCode: '#800080'
  }, {
    id: 'couleur-or',
    label: 'Or',
    isColor: true,
    colorCode: '#FFD700'
  }, {
    id: 'couleur-argent',
    label: 'Argent',
    isColor: true,
    colorCode: '#C0C0C0'
  }, {
    id: 'couleur-transparent',
    label: 'Transparent',
    isColor: true,
    colorCode: '#FFFFFF'
  }]
}, {
  id: 'materiau',
  title: 'Matériau',
  options: [{
    id: 'materiau-plastique',
    label: 'Plastique'
  }, {
    id: 'materiau-metal',
    label: 'Métal'
  }, {
    id: 'materiau-acetate',
    label: 'Acétate'
  }, {
    id: 'materiau-titane',
    label: 'Titane'
  }, {
    id: 'materiau-bois',
    label: 'Bois'
  }, {
    id: 'materiau-aluminium',
    label: 'Aluminium'
  }]
}, {
  id: 'type-monture',
  title: 'Type de monture',
  options: [{
    id: 'monture-cerclee',
    label: 'Cerclée',
  }, {
    id: 'monture-demi-cerclee',
    label: 'Demi-cerclée',
  }, {
    id: 'monture-sans',
    label: 'Sans monture',
  }]
}];
const ProductFilter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // État pour les filtres dynamiques depuis l'API
  const [filterValues, setFilterValues] = useState(null);
  const [filterLoading, setFilterLoading] = useState(true);
  const [filterError, setFilterError] = useState(null);

  // Récupérer les valeurs des filtres depuis l'API
  useEffect(() => {
    const fetchFilterValues = async () => {
      try {
        setFilterLoading(true);
        setFilterError(null);

        const data = await filtreService.getFilter();
        setFilterValues(data);

      } catch (error) {
        console.error('Erreur lors du chargement des filtres:', error);
        setFilterError(error.message);

        setFilterValues(DEFAULT_FILTER_VALUES);
      } finally {
        setFilterLoading(false);
      }
    };

    fetchFilterValues();
  }, []);

  return <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card border border-default-200 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="card-body">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between gap-3"
        >
          <h6 className="card-title text-lg font-bold text-default-900 dark:text-default-100">
            Filtres
          </h6>
          {filterLoading && (
            <div className="flex items-center gap-2 text-xs text-default-500">
              <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <span>Chargement...</span>
            </div>
          )}
        </motion.div>

        {/* Skeleton Loader */}
        {filterLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 space-y-6"
          >
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="space-y-3">
                {/* Titre du filtre skeleton */}
                <div className="h-5 bg-default-200 dark:bg-default-700 rounded-lg w-32 animate-pulse"></div>
                {/* Options skeleton */}
                <div className="space-y-2">
                  <div className="h-8 bg-default-100 dark:bg-default-800 rounded-lg animate-pulse"></div>
                  <div className="h-8 bg-default-100 dark:bg-default-800 rounded-lg w-5/6 animate-pulse"></div>
                  <div className="h-8 bg-default-100 dark:bg-default-800 rounded-lg w-4/6 animate-pulse"></div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
            </motion.div>

            <div className="mt-6 hs-accordion-group" data-hs-accordion-always-open="">
              {filterConfig.map((section, index) => <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="hs-accordion mt-6 first:mt-0"
                  id={`hs-accordion-${section.id}`}
                >
                  {/* ...existing code... */}
              <button className="hs-accordion-toggle group inline-flex items-center justify-between gap-x-3 w-full font-semibold text-start text-default-800 dark:text-default-200 rounded-lg text-base hover:text-primary transition-colors duration-300" aria-expanded="false" aria-controls={`hs-collapse-${section.id}`}>
                {section.title}
                <div className="relative">
                  <LuChevronDown size={18} className="text-base hs-accordion-active:hidden block group-hover:text-primary transition-colors" />
                  <LuChevronUp size={18} className="text-base hs-accordion-active:block hidden group-hover:text-primary transition-colors" />
                </div>
              </button>

              <div id={`hs-collapse-${section.id}`} className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" role="region" aria-labelledby={`hs-accordion-${section.id}`}>
                {section.isSlider ? (
                  // Slider de prix
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 space-y-4"
                  >


                  </motion.div>
                ) : (
                  // Affichage normal pour les autres filtres
                  <div className={`mt-4 flex ${section.id === 'couleur' ? 'flex-wrap gap-2' : 'flex-col gap-3'}`}>
                    {section.options?.map((opt, optIndex) => opt.isColor ? (
                      <motion.label
                        key={opt.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 + optIndex * 0.05 }}
                        className="relative cursor-pointer group"
                        htmlFor={opt.id}
                        title={opt.label}
                      >
                        <input
                          id={opt.id}
                          type="checkbox"
                          className="size-7 cursor-pointer rounded-md focus:ring-2 focus:ring-primary/30 transition-all duration-300 hover:scale-110 appearance-none border-2"
                          style={{
                            backgroundColor: opt.colorCode,
                            borderColor: opt.colorCode === '#FFFFFF' ? '#E5E7EB' : opt.colorCode
                          }}
                        />
                        <div className="absolute inset-0 rounded-md border-2 border-transparent group-hover:border-primary/50 transition-all duration-300 pointer-events-none"></div>

                        {/* Tooltip pour le nom de la couleur */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-default-900 dark:bg-default-100 text-white dark:text-default-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                          {opt.label}
                        </div>
                      </motion.label>
                    ) : (
                      <motion.div
                        key={opt.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + optIndex * 0.05 }}
                        className="flex gap-3 items-center group hover:bg-primary/5 rounded-lg px-2 py-1.5 transition-all duration-300"
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox checked:bg-primary border-default-300 rounded transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                          id={opt.id}
                        />
                        {opt.icon && (
                          <div className="flex-shrink-0">
                            {opt.icon}
                          </div>
                        )}
                        <label
                          htmlFor={opt.id}
                          className="text-sm text-default-700 dark:text-default-300 align-middle cursor-pointer select-none group-hover:text-default-900 dark:group-hover:text-default-100 transition-colors duration-300 flex-1"
                        >
                          {opt.label}
                        </label>
                      </motion.div>
                    ))}

                  </div>
                )}
              </div>
            </motion.div>)}
        </div>
          </>
        )}
      </div>
    </motion.div>;
};
export default ProductFilter;
