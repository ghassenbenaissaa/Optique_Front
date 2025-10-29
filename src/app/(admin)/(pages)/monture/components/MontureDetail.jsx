import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const MontureDetail = ({ monture, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === monture.imageUrl.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? monture.imageUrl.length - 1 : prev - 1
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{monture.name}</h2>
            <p className="text-sm text-gray-500 font-mono mt-1">{monture.reference}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Partie gauche - Détails du produit */}
            <div className="space-y-6">
              {/* Galerie d'images */}
              <div className="relative">
                <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden">
                  {monture.imageUrl && monture.imageUrl.length > 0 ? (
                    <img
                      src={monture.imageUrl[currentImageIndex]}
                      alt={monture.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-8xl">👓</span>
                    </div>
                  )}

                  {/* Navigation images */}
                  {monture.imageUrl && monture.imageUrl.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      >
                        <ChevronRight size={20} />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full text-white text-sm">
                        {currentImageIndex + 1} / {monture.imageUrl.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {monture.imageUrl && monture.imageUrl.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto">
                    {monture.imageUrl.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img src={url} alt={`${monture.name} ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Informations générales */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Marque</p>
                    <p className="text-base font-semibold text-gray-900">{monture.marque}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Catégorie</p>
                    <p className="text-base font-semibold text-gray-900 capitalize">
                      {monture.categorie?.replace(/_/g, ' ').toLowerCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Genre</p>
                    <p className="text-base font-semibold text-gray-900">{monture.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Taille</p>
                    <p className="text-base font-semibold text-gray-900">
                      {monture.taille?.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="text-base font-semibold text-gray-900">
                      {monture.typeMonture?.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Forme</p>
                    <p className="text-base font-semibold text-gray-900">{monture.formeProduit}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{monture.description}</p>
              </div>

              {/* Dimensions */}
              {(monture.largeurTotale || monture.largeurVerre || monture.hauteurVerre ||
                monture.largeurPont || monture.longueurBranche) && (
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dimensions (mm)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {monture.largeurTotale && (
                      <div>
                        <p className="text-sm text-gray-600">Largeur totale</p>
                        <p className="text-base font-semibold text-gray-900">{monture.largeurTotale} mm</p>
                      </div>
                    )}
                    {monture.largeurVerre && (
                      <div>
                        <p className="text-sm text-gray-600">Largeur verre</p>
                        <p className="text-base font-semibold text-gray-900">{monture.largeurVerre} mm</p>
                      </div>
                    )}
                    {monture.hauteurVerre && (
                      <div>
                        <p className="text-sm text-gray-600">Hauteur verre</p>
                        <p className="text-base font-semibold text-gray-900">{monture.hauteurVerre} mm</p>
                      </div>
                    )}
                    {monture.largeurPont && (
                      <div>
                        <p className="text-sm text-gray-600">Largeur pont</p>
                        <p className="text-base font-semibold text-gray-900">{monture.largeurPont} mm</p>
                      </div>
                    )}
                    {monture.longueurBranche && (
                      <div>
                        <p className="text-sm text-gray-600">Longueur branche</p>
                        <p className="text-base font-semibold text-gray-900">{monture.longueurBranche} mm</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Partie droite - Variations */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Variations disponibles ({monture.variations?.length || 0})
                </h3>
                <div className="space-y-3">
                  {monture.variations && monture.variations.map((variation) => (
                    <div
                      key={variation.id}
                      className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {variation.hexcouleur && (
                              <div
                                className="w-5 h-5 rounded-full border-2 border-gray-300"
                                style={{ backgroundColor: variation.hexcouleur }}
                                title={variation.nomcouleur}
                              />
                            )}
                            <span className="font-semibold text-gray-900">{variation.nomcouleur}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600">{variation.materiauProduit}</span>
                          </div>
                          <p className="text-xs text-gray-500 font-mono">{variation.sku}</p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-semibold ${
                          variation.isAvailable && variation.quantity > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {variation.isAvailable && variation.quantity > 0 ? 'Disponible' : 'Rupture'}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Prix</p>
                          {variation.solde && variation.solde > 0 ? (
                            <div>
                              <p className="font-bold text-red-600">
                                {(variation.price - (variation.price * variation.solde / 100)).toFixed(2)} TND
                              </p>
                              <p className="text-xs text-gray-400 line-through">
                                {variation.price.toFixed(2)} TND
                              </p>
                            </div>
                          ) : (
                            <p className="font-bold text-gray-900">{variation.price?.toFixed(2)} TND</p>
                          )}
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Stock</p>
                          <p className={`font-bold ${
                            variation.quantity > 10 ? 'text-green-600' : 
                            variation.quantity > 0 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {variation.quantity}
                          </p>
                        </div>
                        {(variation.solde && variation.solde > 0) ? (
                          <div>
                            <p className="text-gray-600 text-xs mb-1">Solde</p>
                            <p className="font-bold text-red-600">-{variation.solde}%</p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MontureDetail;
