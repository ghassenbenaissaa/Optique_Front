import { Eye, Edit, Trash2 } from 'lucide-react';

const MontureCard = ({ monture, onView, onEdit, onDelete }) => {
  // Calculer le stock total
  const totalStock = monture.variations?.reduce((acc, v) => acc + v.quantity, 0) || 0;

  // Vérifier si au moins une variation est en solde
  const hasDiscount = monture.variations?.some(v => v.solde && v.solde > 0) || false;

  // Récupérer le solde maximum pour l'affichage du badge
  const maxSolde = hasDiscount && monture.variations
    ? Math.max(...monture.variations.map(v => v.solde || 0))
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Badge en solde */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          -{maxSolde}%
        </div>
      )}

      {/* Badge disponibilité */}
      <div className={`absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-xs font-semibold ${
        monture.isAvailable && totalStock > 0
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      }`}>
        {monture.isAvailable && totalStock > 0 ? 'Disponible' : 'Rupture'}
      </div>

      {/* Image */}
      <div className="relative h-64 bg-gray-100 overflow-hidden cursor-pointer" onClick={() => onView(monture)}>
        {monture.imageUrl && monture.imageUrl.length > 0 ? (
          <img
            src={monture.imageUrl[0]}
            alt={monture.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-6xl">👓</span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-5">
        {/* Référence */}
        <p className="text-xs text-gray-500 font-mono mb-1">{monture.reference}</p>

        {/* Nom */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {monture.name}
        </h3>

        {/* Marque et catégorie */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-gray-600 font-medium">{monture.marque}</span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-500 capitalize">
            {monture.categorie?.replace(/_/g, ' ').toLowerCase()}
          </span>
        </div>

        {/* Informations produit */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
            {monture.gender}
          </span>
          <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
            {monture.taille?.replace(/_/g, ' ')}
          </span>
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {monture.typeMonture?.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Prix - Toujours afficher le prix de base */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-gray-900">
            {monture.price.toFixed(2)} TND
          </span>
        </div>

        {/* Stock */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <span className="text-gray-600">Stock total:</span>
          <span className={`font-semibold ${totalStock > 10 ? 'text-green-600' : totalStock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
            {totalStock} unités
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onView(monture)}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <Eye size={16} />
            <span className="text-sm font-medium">Voir</span>
          </button>
          <button
            onClick={() => onEdit(monture)}
            className="flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white py-2 px-3 rounded-lg transition-colors duration-200"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(monture.id)}
            className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg transition-colors duration-200"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MontureCard;
