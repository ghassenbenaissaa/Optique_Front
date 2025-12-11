import { motion } from 'framer-motion';
import {
  LuRuler,
  LuMaximize,
  LuUser,
  LuTag,
  LuShapes,
  LuBox,
  LuEye,
  LuGlasses
} from 'react-icons/lu';

const ProductSpecifications = ({ dimensions = {}, characteristics = {} }) => {
  const dimensionItems = [
    {
      label: 'Largeur totale',
      value: dimensions.largeurTotale,
      unit: 'mm',
      icon: LuMaximize
    },
    {
      label: 'Largeur du verre',
      value: dimensions.largeurVerre,
      unit: 'mm',
      icon: LuEye
    },
    {
      label: 'Hauteur du verre',
      value: dimensions.hauteurVerre,
      unit: 'mm',
      icon: LuRuler
    },
    {
      label: 'Largeur du pont',
      value: dimensions.largeurPont,
      unit: 'mm',
      icon: LuGlasses
    },
    {
      label: 'Longueur des branches',
      value: dimensions.longueurBranche,
      unit: 'mm',
      icon: LuRuler
    }
  ].filter(item => item.value != null);

  const formatCharacteristic = (key, value) => {
    if (!value) return null;

    // Mapping des valeurs enum vers labels lisibles
    const enumMappings = {
      // Genre
      'HOMME': 'Homme',
      'FEMME': 'Femme',
      'UNISEX': 'Unisexe',
      'ENFANT': 'Enfant',
      // Taille
      'EXTRA_PETIT': 'Extra petit',
      'PETIT': 'Petit',
      'MOYEN': 'Moyen',
      'GRAND': 'Grand',
      'EXTRA_GRAND': 'Extra grand',
      // Type de monture
      'CERCLÉE': 'Cerclée',
      'DEMI_CERCLÉE': 'Demi-cerclée',
      'SANS_MONTURE': 'Sans monture',
      // Catégorie
      'LUNETTE_DE_VUE': 'Lunettes de vue',
      'LUNETTE_DE_SOLEIL': 'Lunettes de soleil',
      'LUNETTE_IA': 'Lunettes IA'
    };

    return enumMappings[value] || value;
  };

  const characteristicItems = [
    {
      label: 'Genre',
      value: formatCharacteristic('genre', characteristics.genre),
      icon: LuUser
    },
    {
      label: 'Type',
      value: formatCharacteristic('type', characteristics.type),
      icon: LuTag
    },
    {
      label: 'Taille',
      value: formatCharacteristic('taille', characteristics.taille),
      icon: LuBox
    },
    {
      label: 'Forme',
      value: characteristics.forme,
      icon: LuShapes
    },
    {
      label: 'Matériau',
      value: characteristics.materiau,
      icon: LuBox
    },
    {
      label: 'Type de monture',
      value: formatCharacteristic('typeMonture', characteristics.typeMonture),
      icon: LuGlasses
    }
  ].filter(item => item.value);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (dimensionItems.length === 0 && characteristicItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Dimensions */}
      {dimensionItems.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-default-800 dark:text-default-100 flex items-center gap-2">
            <LuRuler className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Dimensions
          </h3>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4"
          >
            {dimensionItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative bg-gradient-to-br from-default-50 to-white dark:from-default-800/50 dark:to-default-900/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-default-200/50 dark:border-default-700/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="flex items-start justify-between mb-1 sm:mb-2">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary/70 group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-default-800 dark:text-default-100">
                    {item.value}
                    <span className="text-xs sm:text-sm font-normal text-default-500 ml-1">{item.unit}</span>
                  </p>
                  <p className="text-xs text-default-500 dark:text-default-400 mt-1">
                    {item.label}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}

      {/* Caractéristiques */}
      {characteristicItems.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-default-800 dark:text-default-100 flex items-center gap-2">
            <LuTag className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Caractéristiques
          </h3>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/60 dark:bg-default-800/40 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-default-200/50 dark:border-default-700/50 overflow-hidden"
          >
            {characteristicItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`flex items-center justify-between p-3 sm:p-4 ${
                    index !== characteristicItems.length - 1 
                      ? 'border-b border-default-200/50 dark:border-default-700/50' 
                      : ''
                  } hover:bg-primary/5 transition-colors duration-200`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary/70" />
                    <span className="text-xs sm:text-sm text-default-600 dark:text-default-400">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-default-800 dark:text-default-200 text-right">
                    {item.value}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProductSpecifications;

