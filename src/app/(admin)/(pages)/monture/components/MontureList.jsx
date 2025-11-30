import { useState, useEffect } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import MontureCard from './MontureCard';
import MontureDetail from './MontureDetail';
import { produitService } from '../services/produitService';

const MontureList = ({ onAddMonture, onEditMonture }) => {
  const [montures, setMontures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(9);
  const [selectedMonture, setSelectedMonture] = useState(null);

  // Charger les montures
  useEffect(() => {
    loadMontures();
  }, []);

  const loadMontures = async () => {
    try {
      setLoading(true);
      const data = await produitService.getAllProduits();
      setMontures(data);
    } catch (error) {
      console.error('Erreur lors du chargement des montures:', error);
      toast.error('Erreur lors du chargement des montures');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les montures par recherche
  const filteredMontures = montures.filter(monture =>
    monture.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    monture.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    monture.marque?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Montures à afficher (avec pagination)
  const displayedMontures = filteredMontures.slice(0, displayCount);
  const hasMore = displayCount < filteredMontures.length;

  // Gérer la suppression
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await produitService.deleteProduit(id);
        await Swal.fire({
          title: 'Supprimé !',
          text: 'La monture a été supprimée avec succès.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          confirmButtonText: 'OK'
        });
        loadMontures();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        await Swal.fire({
          title: 'Erreur !',
          text: 'Une erreur est survenue lors de la suppression.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  // Voir les détails
  const handleView = (monture) => {
    setSelectedMonture(monture);
  };

  // Charger plus de produits
  const loadMore = () => {
    setDisplayCount(prev => prev + 9);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-default-600">Chargement des montures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec recherche et bouton ajouter */}
      <div className="card">
        <div className="card-header">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-default-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher une monture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input ps-11"
              />
            </div>

            {/* Bouton ajouter */}
            <button
              onClick={onAddMonture}
              className="btn bg-primary text-white"
            >
              <Plus size={20} className="me-2" />
              <span>Ajouter une monture</span>
            </button>
          </div>

          {/* Statistiques */}
          <div className="mt-4 flex items-center gap-4 text-sm text-default-600">
            <span className="font-semibold">{filteredMontures.length} monture(s) trouvée(s)</span>
            {searchTerm && (
              <span className="text-blue-600">• Recherche active</span>
            )}
          </div>
        </div>
      </div>

      {/* Grille de cartes */}
      {filteredMontures.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-xl font-semibold text-default-900 mb-2">
            Aucune monture trouvée
          </h3>
          <p className="text-default-600 mb-6">
            {searchTerm
              ? 'Essayez de modifier votre recherche'
              : 'Commencez par ajouter votre première monture'}
          </p>
          {!searchTerm && (
            <button
              onClick={onAddMonture}
              className="btn bg-primary text-white"
            >
              <Plus size={20} className="me-2" />
              <span>Ajouter une monture</span>
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedMontures.map((monture) => (
              <MontureCard
                key={monture.id}
                monture={monture}
                onView={handleView}
                onEdit={onEditMonture}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Bouton "Voir plus" */}
          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={loadMore}
                className="btn border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/10"
              >
                Voir plus ({filteredMontures.length - displayCount} restant{filteredMontures.length - displayCount > 1 ? 's' : ''})
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal de détails */}
      {selectedMonture && (
        <MontureDetail
          monture={selectedMonture}
          onClose={() => setSelectedMonture(null)}
        />
      )}
    </div>
  );
};

export default MontureList;

