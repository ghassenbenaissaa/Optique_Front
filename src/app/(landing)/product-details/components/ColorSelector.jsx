import { motion } from 'framer-motion';
import { LuCheck } from 'react-icons/lu';

const ColorSelector = ({ colors = [], selectedColor, onColorSelect }) => {
  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-semibold text-default-700 dark:text-default-300 uppercase tracking-wider">
          Couleurs disponibles
        </h3>
        {selectedColor && (
          <span className="text-xs sm:text-sm text-primary font-medium">
            {selectedColor.nom}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        {colors.map((color, index) => {
          const isSelected = selectedColor?.nom === color.nom;
          const isOutOfStock = color.stock === 0;

          return (
            <motion.button
              key={index}
              onClick={() => !isOutOfStock && onColorSelect(color)}
              disabled={isOutOfStock}
              className={`relative group ${isOutOfStock ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              whileHover={!isOutOfStock ? { scale: 1.1 } : {}}
              whileTap={!isOutOfStock ? { scale: 0.95 } : {}}
            >
              {/* Cercle de couleur */}
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-300 ${
                  isSelected
                    ? 'border-primary ring-2 sm:ring-4 ring-primary/30 shadow-lg'
                    : 'border-default-200 dark:border-default-600 hover:border-primary/50'
                }`}
                style={{
                  backgroundColor: color.code,
                  boxShadow: isSelected ? `0 4px 15px ${color.code}50` : undefined
                }}
              >
                {/* Checkmark pour la sélection */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <LuCheck
                      className="w-5 h-5"
                      style={{
                        color: isLightColor(color.code) ? '#000' : '#fff'
                      }}
                    />
                  </motion.div>
                )}
              </div>

              {/* Barre pour rupture de stock */}
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-0.5 bg-red-500 rotate-45 rounded-full"></div>
                </div>
              )}

              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                <div className="bg-default-900 dark:bg-default-100 text-white dark:text-default-900 px-3 py-1.5 rounded-lg text-xs font-medium shadow-xl">
                  {color.nom}
                  {isOutOfStock && ' (Épuisé)'}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-default-900 dark:bg-default-100"></div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Légende stock */}
      {colors.some(c => c.stock === 0) && (
        <p className="text-xs text-default-500 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-default-300 relative">
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-4 h-0.5 bg-red-500 rotate-45 rounded-full"></span>
            </span>
          </span>
          Couleur en rupture de stock
        </p>
      )}
    </div>
  );
};

// Fonction utilitaire pour déterminer si une couleur est claire
function isLightColor(hexColor) {
  if (!hexColor) return true;
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
}

export default ColorSelector;

