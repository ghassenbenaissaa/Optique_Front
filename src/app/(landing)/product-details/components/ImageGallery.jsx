// filepath: d:\GHASSEN\Projet Optique\OptiqueFront\src\app\(landing)\product-details\components\ImageGallery.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuChevronLeft, LuChevronRight, LuZoomIn, LuX } from 'react-icons/lu';

const ImageGallery = ({ images = [], productName = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset index when images change
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-3xl bg-gradient-to-br from-default-100 to-default-50 dark:from-default-800 dark:to-default-900 flex items-center justify-center">
        <span className="text-6xl font-bold text-primary/20">{productName.charAt(0)}</span>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Image principale */}
      <div className="relative group">
        <motion.div
          className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-white dark:bg-default-800 border border-default-200/50 dark:border-default-700/50 shadow-lg sm:shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`${productName} - Image ${currentIndex + 1}`}
              className="w-full h-full object-contain p-4 sm:p-6 cursor-zoom-in"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsZoomed(true)}
            />
          </AnimatePresence>

          {/* Bouton zoom - visible seulement sur desktop */}
          <button
            onClick={() => setIsZoomed(true)}
            className="hidden sm:flex absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-default-800/90 backdrop-blur-sm items-center justify-center text-default-600 hover:text-primary hover:bg-white transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100"
          >
            <LuZoomIn className="w-5 h-5" />
          </button>

          {/* Navigation arrows - toujours visible sur mobile, hover sur desktop */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 dark:bg-default-800/90 backdrop-blur-sm flex items-center justify-center text-default-600 hover:text-primary hover:bg-white transition-all duration-300 shadow-lg sm:opacity-0 sm:group-hover:opacity-100"
              >
                <LuChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 dark:bg-default-800/90 backdrop-blur-sm flex items-center justify-center text-default-600 hover:text-primary hover:bg-white transition-all duration-300 shadow-lg sm:opacity-0 sm:group-hover:opacity-100"
              >
                <LuChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Indicateur de position */}
          {images.length > 1 && (
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 bg-white/90 dark:bg-default-800/90 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-5 sm:w-6 bg-primary'
                      : 'w-2 bg-default-300 dark:bg-default-600 hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Thumbnails - caché sur très petit écran, scroll horizontal interne */}
      {images.length > 1 && (
        <div className="hidden xs:flex gap-2 sm:gap-3 overflow-x-auto overflow-y-hidden pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent max-w-full">
          {images.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                index === currentIndex
                  ? 'border-primary ring-2 ring-primary/30 shadow-lg'
                  : 'border-default-200 dark:border-default-700 hover:border-primary/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={image}
                alt={`${productName} - Miniature ${index + 1}`}
                className="w-full h-full object-contain bg-white dark:bg-default-800 p-1"
              />
              {index === currentIndex && (
                <motion.div
                  className="absolute inset-0 bg-primary/10"
                  layoutId="thumbnailHighlight"
                />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Modal Zoom */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[currentIndex]}
                alt={`${productName} - Zoom`}
                className="w-full h-full object-contain"
              />

              {/* Close button */}
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
              >
                <LuX className="w-6 h-6" />
              </button>

              {/* Navigation in zoom mode */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                  >
                    <LuChevronLeft className="w-7 h-7" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                  >
                    <LuChevronRight className="w-7 h-7" />
                  </button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
                {currentIndex + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery;

