import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const MontureDetail = ({ monture, onClose }) => {
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Obtenir les images de la variation sélectionnée
  const getCurrentVariation = () => {
    return monture.variations?.[selectedVariation] || null;
  };

  const getCurrentImages = () => {
    const variation = getCurrentVariation();
    return variation?.imageUrl || monture.imageUrl || [];
  };

  const nextImage = () => {
    const images = getCurrentImages();
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    const images = getCurrentImages();
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleVariationChange = (index) => {
    setSelectedVariation(index);
    setCurrentImageIndex(0); // Reset to first image when changing variation
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="card max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-default-200 bg-default-50">
          <div>
            <h2 className="text-3xl font-bold text-default-900">{monture.name}</h2>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-sm text-default-500 font-mono">{monture.reference}</p>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                {monture.marque}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-default-100 rounded-lg transition-colors group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 p-6">
            {/* Colonne 1 - Sélecteur de variations */}
            <div className="space-y-4">
              <div className="card overflow-hidden">
                <div className="bg-default-50 px-6 py-4 border-b border-default-200">
                  <h3 className="text-lg font-semibold text-default-900 flex items-center gap-2">
                    <Eye size={20} className="text-blue-600" />
                    Variations ({monture.variations?.length || 0})
                  </h3>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto">
                  <div className="space-y-3">
                    {monture.variations && monture.variations.map((variation, index) => (
                      <div
                        key={variation.id}
                        onClick={() => handleVariationChange(index)}
                        className={`cursor-pointer bg-default-50 hover:bg-default-100 rounded-lg p-3 border-2 transition-all duration-200 ${
                          index === selectedVariation
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-transparent hover:border-default-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {variation.hexcouleur && (
                              <div
                                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: variation.hexcouleur }}
                                title={variation.nomcouleur}
                              />
                            )}
                            <div>
                              <p className="font-semibold text-default-900 text-sm">
                                {variation.nomcouleur}
                              </p>
                              <p className="text-xs text-default-500">{variation.materiauProduit}</p>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-semibold ${
                            variation.isAvailable && variation.quantity > 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {variation.isAvailable && variation.quantity > 0 ? 'Dispo' : 'Rupture'}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-4">
                            <div>
                              {variation.solde && variation.solde > 0 ? (
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-red-600 text-sm">
                                    {(variation.price - (variation.price * variation.solde / 100)).toFixed(2)} TND
                                  </span>
                                  <span className="text-xs text-default-400 line-through">
                                    {variation.price.toFixed(2)} TND
                                  </span>
                                </div>
                              ) : (
                                <span className="font-bold text-default-900 text-sm">{variation.price?.toFixed(2)} TND</span>
                              )}
                            </div>
                            <div className={`text-xs font-semibold ${
                              variation.quantity > 10 ? 'text-green-600' : 
                              variation.quantity > 0 ? 'text-orange-600' : 'text-red-600'
                            }`}>
                              Stock: {variation.quantity}
                            </div>
                          </div>
                          {(variation.solde && variation.solde > 0) && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              -{variation.solde}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne 2 - Galerie d'images de la variation sélectionnée */}
            <div className="space-y-4">
              <div className="card overflow-hidden">
                <div className="bg-default-50 px-6 py-4 border-b border-default-200">
                  <h3 className="text-lg font-semibold text-default-900">
                    Images - {getCurrentVariation()?.nomcouleur || 'Variation sélectionnée'}
                  </h3>
                </div>
                <div className="p-4">
                  <div className="relative">
                    <div className="relative h-80 bg-default-100 rounded-xl overflow-hidden shadow-inner">
                      {getCurrentImages().length > 0 ? (
                        <img
                          src={getCurrentImages()[currentImageIndex]}
                          alt={`${monture.name} - ${getCurrentVariation()?.nomcouleur}`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-default-400 bg-default-100">
                          <div className="text-center">
                            <span className="text-6xl mb-4 block">👓</span>
                            <p className="text-sm text-default-500">Aucune image disponible</p>
                          </div>
                        </div>
                      )}

                      {/* Navigation images */}
                      {getCurrentImages().length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                          >
                            <ChevronLeft size={20} className="text-default-700" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                          >
                            <ChevronRight size={20} className="text-default-700" />
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
                            {currentImageIndex + 1} / {getCurrentImages().length}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Thumbnails */}
                    {getCurrentImages().length > 1 && (
                      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {getCurrentImages().map((url, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                              index === currentImageIndex
                                ? 'border-blue-500 ring-2 ring-blue-200 shadow-md'
                                : 'border-default-200 hover:border-default-400'
                            }`}
                          >
                            <img
                              src={url}
                              alt={`${monture.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Informations sur la variation sélectionnée */}
              {getCurrentVariation() && (
                <div className="card overflow-hidden">
                  <div className="bg-default-50 px-6 py-4 border-b border-default-200">
                    <h3 className="text-lg font-semibold text-default-900">Variation sélectionnée</h3>
                  </div>
                  <div className="p-5">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        {getCurrentVariation().hexcouleur && (
                          <div
                            className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                            style={{ backgroundColor: getCurrentVariation().hexcouleur }}
                          />
                        )}
                        <div>
                          <p className="font-semibold text-default-900">{getCurrentVariation().nomcouleur}</p>
                          <p className="text-sm text-default-600">{getCurrentVariation().materiauProduit}</p>
                          <p className="text-xs text-default-500 font-mono">{getCurrentVariation().sku}</p>
                        </div>
                      </div>

                      <div className="bg-default-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-default-600 font-medium uppercase tracking-wide">Prix</p>
                            {getCurrentVariation().solde && getCurrentVariation().solde > 0 ? (
                              <div>
                                <p className="font-bold text-red-600 text-lg">
                                  {(getCurrentVariation().price - (getCurrentVariation().price * getCurrentVariation().solde / 100)).toFixed(2)} TND
                                </p>
                                <p className="text-sm text-default-400 line-through">
                                  {getCurrentVariation().price.toFixed(2)} TND
                                </p>
                              </div>
                            ) : (
                              <p className="font-bold text-default-900 text-lg">{getCurrentVariation().price?.toFixed(2)} TND</p>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-default-600 font-medium uppercase tracking-wide">Stock</p>
                            <p className={`font-bold text-lg ${
                              getCurrentVariation().quantity > 10 ? 'text-green-600' : 
                              getCurrentVariation().quantity > 0 ? 'text-orange-600' : 'text-red-600'
                            }`}>
                              {getCurrentVariation().quantity}
                            </p>
                          </div>
                        </div>
                        {(getCurrentVariation().solde && getCurrentVariation().solde > 0) && (
                          <div className="mt-3 text-center">
                            <span className="bg-red-500 text-white text-sm px-4 py-2 rounded-full font-bold">
                              SOLDE -{getCurrentVariation().solde}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Colonne 3 - Informations détaillées */}
            <div className="space-y-4">
              {/* Informations générales */}
              <div className="card overflow-hidden">
                <div className="bg-default-50 px-6 py-4 border-b border-default-200">
                  <h3 className="text-lg font-semibold text-default-900">Informations générales</h3>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-default-50 rounded-lg p-3">
                        <p className="text-xs text-default-600 font-medium uppercase tracking-wide">Marque</p>
                        <p className="text-sm font-semibold text-default-900 mt-1">{monture.marque}</p>
                      </div>
                      <div className="bg-default-50 rounded-lg p-3">
                        <p className="text-xs text-default-600 font-medium uppercase tracking-wide">Genre</p>
                        <p className="text-sm font-semibold text-default-900 mt-1">{monture.gender}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-default-50 rounded-lg p-3">
                        <p className="text-xs text-default-600 font-medium uppercase tracking-wide">Catégorie</p>
                        <p className="text-sm font-semibold text-default-900 mt-1 capitalize">
                          {monture.categorie?.replace(/_/g, ' ').toLowerCase()}
                        </p>
                      </div>
                      <div className="bg-default-50 rounded-lg p-3">
                        <p className="text-xs text-default-600 font-medium uppercase tracking-wide">Taille</p>
                        <p className="text-sm font-semibold text-default-900 mt-1">
                          {monture.taille?.replace(/_/g, ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-default-50 rounded-lg p-3">
                        <p className="text-xs text-default-600 font-medium uppercase tracking-wide">Type</p>
                        <p className="text-sm font-semibold text-default-900 mt-1">
                          {monture.typeMonture?.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <div className="bg-default-50 rounded-lg p-3">
                        <p className="text-xs text-default-600 font-medium uppercase tracking-wide">Forme</p>
                        <p className="text-sm font-semibold text-default-900 mt-1">{monture.formeProduit}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="card overflow-hidden">
                <div className="bg-default-50 px-6 py-4 border-b border-default-200">
                  <h3 className="text-lg font-semibold text-default-900">Description</h3>
                </div>
                <div className="p-5">
                  <p className="text-default-700 leading-relaxed text-sm">{monture.description}</p>
                </div>
              </div>

              {/* Dimensions */}
              {(monture.largeurTotale || monture.largeurVerre || monture.hauteurVerre ||
                monture.largeurPont || monture.longueurBranche) && (
                <div className="card overflow-hidden">
                  <div className="bg-default-50 px-6 py-4 border-b border-default-200">
                    <h3 className="text-lg font-semibold text-default-900">Dimensions (mm)</h3>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-1 gap-3">
                      {monture.largeurTotale && (
                        <div className="flex justify-between items-center py-2 border-b border-default-100 last:border-0">
                          <p className="text-sm text-default-600">Largeur totale</p>
                          <p className="text-sm font-bold text-default-900 bg-default-100 px-2 py-1 rounded">{monture.largeurTotale} mm</p>
                        </div>
                      )}
                      {monture.largeurVerre && (
                        <div className="flex justify-between items-center py-2 border-b border-default-100 last:border-0">
                          <p className="text-sm text-default-600">Largeur verre</p>
                          <p className="text-sm font-bold text-default-900 bg-default-100 px-2 py-1 rounded">{monture.largeurVerre} mm</p>
                        </div>
                      )}
                      {monture.hauteurVerre && (
                        <div className="flex justify-between items-center py-2 border-b border-default-100 last:border-0">
                          <p className="text-sm text-default-600">Hauteur verre</p>
                          <p className="text-sm font-bold text-default-900 bg-default-100 px-2 py-1 rounded">{monture.hauteurVerre} mm</p>
                        </div>
                      )}
                      {monture.largeurPont && (
                        <div className="flex justify-between items-center py-2 border-b border-default-100 last:border-0">
                          <p className="text-sm text-default-600">Largeur pont</p>
                          <p className="text-sm font-bold text-default-900 bg-default-100 px-2 py-1 rounded">{monture.largeurPont} mm</p>
                        </div>
                      )}
                      {monture.longueurBranche && (
                        <div className="flex justify-between items-center py-2 border-b border-default-100 last:border-0">
                          <p className="text-sm text-default-600">Longueur branche</p>
                          <p className="text-sm font-bold text-default-900 bg-default-100 px-2 py-1 rounded">{monture.longueurBranche} mm</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MontureDetail;
