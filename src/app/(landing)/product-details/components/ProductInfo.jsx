import { motion } from 'framer-motion';
import { LuCheck, LuX, LuShoppingCart, LuHeart } from 'react-icons/lu';
import ColorSelector from './ColorSelector';

const ProductInfo = ({
  product,
  selectedColor,
  onColorSelect,
  selectedVariation
}) => {
  if (!product) return null;

  const {
    name,
    brand,
    reference,
    description,
    price,
    originalPrice,
    maxDiscount,
    isAvailable,
    totalStock,
    colors
  } = product;

  // Calculer le prix en fonction de la variation sélectionnée
  const displayPrice = selectedVariation?.price || price;
  const displayOriginalPrice = selectedVariation?.solde > 0
    ? displayPrice / (1 - selectedVariation.solde / 100)
    : originalPrice;
  const displayDiscount = selectedVariation?.solde || maxDiscount;

  // Stock de la variation sélectionnée (le backend retourne 'quantity')
  const variationStock = selectedVariation?.quantity ?? selectedVariation?.stock ?? totalStock;
  const variationAvailable = variationStock > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Marque et référence */}
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
        {brand && (
          <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-primary/10 text-primary text-xs sm:text-sm font-semibold rounded-full">
            {brand}
          </span>
        )}
        {reference && (
          <span className="text-xs sm:text-sm text-default-500 dark:text-default-400">
            Réf: {reference}
          </span>
        )}
      </div>

      {/* Nom du produit */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-default-900 dark:text-default-100 leading-tight">
        {name}
      </h1>

      {/* Prix */}
      <div className="flex items-end gap-2 sm:gap-4 flex-wrap">
        <div className="flex items-baseline gap-1 sm:gap-2">
          <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {displayPrice?.toFixed(2)}
          </span>
          <span className="text-base sm:text-lg font-medium text-default-600 dark:text-default-400">
            TND
          </span>
        </div>

        {displayDiscount > 0 && displayOriginalPrice && (
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-base sm:text-xl text-default-400 line-through">
              {displayOriginalPrice?.toFixed(2)} TND
            </span>
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs sm:text-sm font-bold rounded-full shadow-lg">
              -{Math.round(displayDiscount)}%
            </span>
          </div>
        )}
      </div>

      {/* Disponibilité */}
      <div className="flex items-center gap-3">
        {variationAvailable ? (
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full">
            <LuCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-400">
              En stock
            </span>
            {variationStock <= 5 && (
              <span className="text-xs text-green-600 dark:text-green-400 hidden sm:inline">
                (Plus que {variationStock} disponible{variationStock > 1 ? 's' : ''})
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-full">
            <LuX className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-400">
              Rupture de stock
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-sm sm:text-base text-default-600 dark:text-default-400 leading-relaxed">
            {description}
          </p>
        </div>
      )}

      {/* Séparateur */}
      <div className="border-t border-default-200 dark:border-default-700"></div>

      {/* Sélecteur de couleurs */}
      <ColorSelector
        colors={colors}
        selectedColor={selectedColor}
        onColorSelect={onColorSelect}
      />

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!variationAvailable}
          className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 ${
            variationAvailable
              ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40'
              : 'bg-default-200 dark:bg-default-700 text-default-500 cursor-not-allowed'
          }`}
        >
          <LuShoppingCart className="w-5 h-5" />
          {variationAvailable ? 'Ajouter au panier' : 'Indisponible'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-14 h-12 sm:h-14 flex items-center justify-center gap-2 sm:gap-0 rounded-xl sm:rounded-2xl border-2 border-default-200 dark:border-default-700 text-default-600 dark:text-default-400 hover:border-danger hover:text-danger hover:bg-danger/10 transition-all duration-300"
        >
          <LuHeart className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="sm:hidden text-sm font-medium">Ajouter aux favoris</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductInfo;

