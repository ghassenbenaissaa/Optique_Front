import { useState, useEffect } from 'react';
import { LuChevronLeft, LuChevronRight, LuPlus, LuSearch, LuSquarePen, LuTrash2, LuEye } from 'react-icons/lu';
import Swal from 'sweetalert2';

const MontureList = ({ onAddMonture, onEditMonture }) => {
  const [montures, setMontures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fonction pour récupérer les montures depuis l'API
  const fetchMontures = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8089/api/v1/produit/all/admin');

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const responseData = await response.json();

      // Vérifier le format de la réponse avec success/data
      let data = [];
      if (responseData.success && responseData.data) {
        data = responseData.data;
      } else if (Array.isArray(responseData)) {
        data = responseData;
      } else {
        throw new Error('Format de réponse API invalide');
      }

      // Validation et nettoyage des données
      const cleanedData = Array.isArray(data) ? data.map((monture, index) => {
        const hasRealId = monture.id && typeof monture.id === 'number';
        const id = hasRealId ? monture.id : `temp-${index}-${monture.name}-${Date.now()}`;

        return {
          id: id,
          realId: hasRealId ? monture.id : null,
          name: monture.name || 'Nom non défini',
          description: monture.description || '',
          price: monture.price || 0,
          quantity: monture.quantity || 0,
          reference: monture.reference || '',
          imageUrl: monture.imageUrl || '',
          marque: monture.marque || '',
          couleur: monture.couleur || '',
          isAvailable: monture.isAvailable !== undefined ? monture.isAvailable : true,
          categorie: monture.categorie || '',
          largeurTotale: monture.largeurTotale || null,
          largeurVerre: monture.largeurVerre || null,
          hauteurVerre: monture.hauteurVerre || null,
          largeurPont: monture.largeurPont || null,
          longueurBranche: monture.longueurBranche || null,
          gender: monture.gender || '',
          taille: monture.taille || '',
          typeMonture: monture.typeMonture || '',
          materiauProduit: monture.materiauProduit || '',
          formeProduit: monture.formeProduit || '',
          solde: monture.solde || null,
          canDelete: hasRealId
        };
      }).filter(monture =>
        monture &&
        typeof monture === 'object' &&
        monture.name !== 'Nom non défini'
      ) : [];

      setMontures(cleanedData);
    } catch (err) {
      console.error('Erreur lors du chargement des montures:', err);
      setError(`Erreur de chargement: ${err.message}`);
      setMontures([]);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer une monture
  const deleteMonture = async (monture) => {
    if (!monture.canDelete || !monture.realId) {
      await Swal.fire({
        title: 'Suppression impossible',
        html: `
          <div class="text-center">
            <div class="mb-3">
              <div class="bg-orange-100 text-orange-600 px-3 py-2 rounded-lg font-semibold mb-2">
                ${monture.name}
              </div>
            </div>
            <p class="text-gray-600">Cette monture ne peut pas être supprimée car elle n'a pas d'identifiant valide.</p>
          </div>
        `,
        icon: 'warning',
        confirmButtonColor: '#6b7280',
        confirmButtonText: 'Compris',
        customClass: {
          popup: 'rounded-lg',
          title: 'text-xl font-semibold text-gray-800',
          confirmButton: 'px-6 py-2 rounded-lg font-medium'
        }
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: 'Supprimer la monture ?',
        html: `
          <div class="text-center">
            <div class="mb-3">
              <div class="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg font-semibold mb-2">
                ${monture.name}
              </div>
              <div class="text-sm text-gray-600">
                <span class="font-medium">Marque:</span> ${monture.marque || 'N/A'} • 
                <span class="font-medium">Couleur:</span> ${monture.couleur || 'N/A'}
              </div>
            </div>
            <p class="text-gray-600">Cette action est irréversible.</p>
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
        reverseButtons: true,
        focusCancel: true,
        customClass: {
          popup: 'rounded-lg',
          title: 'text-xl font-semibold text-gray-800',
          confirmButton: 'px-6 py-2 rounded-lg font-medium',
          cancelButton: 'px-6 py-2 rounded-lg font-medium'
        }
      });

      if (!result.isConfirmed) return;

      setDeletingId(monture.id);

      Swal.fire({
        title: 'Suppression en cours...',
        html: `Suppression de la monture <strong>${monture.name}</strong>`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await fetch(`http://localhost:8089/api/v1/produit/delete/${monture.realId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setMontures(prevMontures => prevMontures.filter(m => m.id !== monture.id));
        setError(null);

        await Swal.fire({
          title: 'Suppression réussie !',
          html: `
            <div class="text-center">
              <div class="mb-3">
                <div class="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg font-semibold mb-2">
                  ${monture.name}
                </div>
              </div>
              <p class="text-gray-600">La monture a été supprimée avec succès.</p>
            </div>
          `,
          icon: 'success',
          confirmButtonColor: '#10b981',
          confirmButtonText: 'Parfait !',
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: 'rounded-lg',
            title: 'text-xl font-semibold text-gray-800',
            confirmButton: 'px-6 py-2 rounded-lg font-medium'
          }
        });
      } else {
        let errorMessage = 'Erreur lors de la suppression';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Erreur HTTP: ${response.status}`;
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError(`Erreur lors de la suppression: ${err.message}`);

      await Swal.fire({
        title: 'Erreur de suppression',
        text: `Impossible de supprimer la monture "${monture.name}". ${err.message}`,
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Compris',
        customClass: {
          popup: 'rounded-lg',
          title: 'text-xl font-semibold text-gray-800',
          confirmButton: 'px-6 py-2 rounded-lg font-medium'
        }
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Fonction pour formater le prix
  const formatPrice = (price) => {
    try {
      const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
      return new Intl.NumberFormat('ar-TN', {
        style: 'currency',
        currency: 'TND',
        minimumFractionDigits: 3
      }).format(numPrice);
    } catch (error) {
      const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
      return `${numPrice.toFixed(3)} DT`;
    }
  };

  // Fonction pour afficher les détails d'une monture
  const showDetails = (monture) => {
    const formatDimension = (value) => value ? `${value} mm` : 'N/A';

    Swal.fire({
      title: monture.name,
      html: `
        <div class="text-left space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <strong>Prix:</strong> ${formatPrice(monture.price)}<br>
              <strong>Quantité:</strong> ${monture.quantity}<br>
              <strong>Référence:</strong> ${monture.reference || 'N/A'}<br>
              <strong>Marque:</strong> ${monture.marque || 'N/A'}<br>
              <strong>Couleur:</strong> ${monture.couleur || 'N/A'}
            </div>
            <div>
              <strong>Catégorie:</strong> ${monture.categorie || 'N/A'}<br>
              <strong>Genre:</strong> ${monture.gender || 'N/A'}<br>
              <strong>Taille:</strong> ${monture.taille || 'N/A'}<br>
              <strong>Type:</strong> ${monture.typeMonture || 'N/A'}<br>
              <strong>Matériau:</strong> ${monture.materiauProduit || 'N/A'}
            </div>
          </div>
          
          <div>
            <strong>Description:</strong><br>
            <p class="text-sm text-gray-600 mt-1">${monture.description || 'Aucune description'}</p>
          </div>

          <div>
            <strong>Dimensions:</strong><br>
            <div class="grid grid-cols-2 gap-2 text-sm mt-1">
              <span>Largeur totale: ${formatDimension(monture.largeurTotale)}</span>
              <span>Largeur verre: ${formatDimension(monture.largeurVerre)}</span>
              <span>Hauteur verre: ${formatDimension(monture.hauteurVerre)}</span>
              <span>Largeur pont: ${formatDimension(monture.largeurPont)}</span>
              <span>Longueur branche: ${formatDimension(monture.longueurBranche)}</span>
            </div>
          </div>

          <div class="flex justify-center">
            <span class="inline-flex items-center gap-x-1.5 py-1 px-3 rounded text-sm font-medium ${
              monture.isAvailable 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }">
              ${monture.isAvailable ? '✓ Disponible' : '✗ Indisponible'}
            </span>
          </div>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: '600px',
      customClass: {
        popup: 'rounded-lg',
        title: 'text-xl font-semibold text-gray-800'
      }
    });
  };

  // Charger les montures au montage du composant
  useEffect(() => {
    fetchMontures();
  }, []);

  // Filtrer les montures selon le terme de recherche
  const monturesFiltered = montures.filter(monture => {
    if (!monture || typeof monture !== 'object') return false;

    const name = (monture.name || '').toString().toLowerCase();
    const marque = (monture.marque || '').toString().toLowerCase();
    const couleur = (monture.couleur || '').toString().toLowerCase();
    const search = (searchTerm || '').toLowerCase();

    return name.includes(search) || marque.includes(search) || couleur.includes(search);
  });

  // Calculs pour la pagination
  const totalPages = Math.max(1, Math.ceil(monturesFiltered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMontures = monturesFiltered.slice(startIndex, endIndex);

  // Fonction pour changer de page
  const goToPage = (page) => {
    const pageNum = parseInt(page);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // Réinitialiser la page à 1 quand on fait une recherche
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Fonction pour gérer l'édition
  const handleEdit = (monture) => {
    if (!monture || !monture.id) {
      console.error('Monture invalide pour édition:', monture);
      return;
    }

    if (typeof onEditMonture === 'function') {
      onEditMonture(monture);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 mb-5">
      <div className="card">
        <div className="card-header">
          <div className="md:flex md:space-y-0 space-y-3.5 gap-3 items-center">
            <div className="relative">
              <input
                type="text"
                className="ps-11 form-input form-input-sm w-full"
                placeholder="Rechercher une monture...."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value || '')}
              />
              <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                <LuSearch className="size-3.5 flex items-center text-default-500" />
              </div>
            </div>
          </div>

          <button
            className="btn btn-sm bg-primary text-white"
            onClick={onAddMonture}
            disabled={loading}
          >
            <LuPlus className="size-4 me-1" />
            Ajouter Monture
          </button>
        </div>

        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-2 text-default-600">Chargement des montures...</p>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center text-red-500">
                    <p className="mb-3">❌ {error}</p>
                    <button
                      onClick={fetchMontures}
                      className="btn btn-sm bg-primary text-white"
                    >
                      🔄 Réessayer
                    </button>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-default-200">
                    <thead className="bg-default-150">
                      <tr className="text-sm font-normal text-default-700">
                        <th className="px-3.5 py-3 text-start">Nom</th>
                        <th className="px-3.5 py-3 text-start">Marque</th>
                        <th className="px-3.5 py-3 text-start">Couleur</th>
                        <th className="px-3.5 py-3 text-start">Prix</th>
                        <th className="px-3.5 py-3 text-start">Quantité</th>
                        <th className="px-3.5 py-3 text-start">Disponibilité</th>
                        <th className="px-3.5 py-3 text-start">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-default-200">
                      {currentMontures.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-3.5 py-8 text-center text-default-500">
                            {searchTerm ? 'Aucune monture trouvée pour cette recherche' : 'Aucune monture trouvée'}
                          </td>
                        </tr>
                      ) : (
                        currentMontures.map((monture, index) => {
                          if (!monture || !monture.id) {
                            console.warn('Monture invalide détectée:', monture, 'à l\'index:', index);
                            return null;
                          }

                          return (
                            <tr key={`monture-${monture.id}-${index}`} className="text-default-800 font-normal">
                              <td className="px-3.5 py-2.5 whitespace-nowrap text-sm">
                                <h6 className="text-default-800 font-semibold">
                                  {monture.name}
                                </h6>
                                {monture.reference && (
                                  <p className="text-xs text-gray-500">Réf: {monture.reference}</p>
                                )}
                              </td>

                              <td className="px-3.5 py-2.5 whitespace-nowrap text-sm">
                                <span className="text-default-700">
                                  {monture.marque || 'N/A'}
                                </span>
                              </td>

                              <td className="px-3.5 py-2.5 whitespace-nowrap text-sm">
                                <span className="text-default-700">
                                  {monture.couleur || 'N/A'}
                                </span>
                              </td>

                              <td className="px-3.5 py-2.5 whitespace-nowrap text-sm">
                                <span className="text-green-600 font-semibold">
                                  {formatPrice(monture.price)}
                                </span>
                              </td>

                              <td className="px-3.5 py-2.5 whitespace-nowrap text-sm">
                                <span className={`font-semibold ${
                                  monture.quantity > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {monture.quantity}
                                </span>
                              </td>

                              <td className="px-3.5 py-2.5 whitespace-nowrap">
                                {monture.isAvailable ? (
                                  <span className="inline-flex items-center gap-x-1.5 py-0.5 px-2.5 rounded text-xs font-medium bg-success/15 text-success">
                                    ✓ Disponible
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-x-1.5 py-0.5 px-2.5 rounded text-xs font-medium bg-danger/15 text-danger">
                                    ✗ Indisponible
                                  </span>
                                )}
                              </td>

                              <td className="px-3.5 py-2.5">
                                <div className="flex items-center gap-2">
                                  <button
                                    className="btn size-7.5 bg-info/10 text-info hover:bg-info hover:text-white"
                                    title="Voir détails"
                                    onClick={() => showDetails(monture)}
                                  >
                                    <LuEye className="size-3" />
                                  </button>

                                  <button
                                    className="btn size-7.5 bg-warning/10 text-warning hover:bg-warning hover:text-white"
                                    title="Modifier"
                                    onClick={() => handleEdit(monture)}
                                    disabled={deletingId === monture.id}
                                  >
                                    <LuSquarePen className="size-3" />
                                  </button>

                                  <button
                                    className={`btn size-7.5 bg-danger/10 text-danger hover:bg-danger hover:text-white ${
                                      !monture.canDelete ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    title={monture.canDelete ? "Supprimer" : "Suppression impossible - ID manquant"}
                                    onClick={() => deleteMonture(monture)}
                                    disabled={deletingId === monture.id || !monture.canDelete}
                                  >
                                    {deletingId === monture.id ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                                    ) : (
                                      <LuTrash2 className="size-3" />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }).filter(Boolean)
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Pagination */}
          {!loading && !error && (
            <div className="card-footer">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-default-500 text-sm text-center sm:text-left">
                  Affichage de <b>{Math.min(startIndex + 1, monturesFiltered.length)}</b> à <b>{Math.min(endIndex, monturesFiltered.length)}</b> sur <b>{monturesFiltered.length}</b> monture(s)
                  {searchTerm && <span className="block sm:inline"> (filtré sur {montures.length} au total)</span>}
                </p>

                {totalPages > 1 && (
                  <nav className="flex items-center justify-center gap-1 sm:gap-2" aria-label="Pagination">
                    <button
                      type="button"
                      className={`btn btn-sm border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/10 ${
                        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <LuChevronLeft className="size-4 sm:me-1" />
                      <span className="hidden sm:inline">Précédent</span>
                    </button>

                    <div className="flex sm:hidden items-center gap-1">
                      <span className="text-sm text-default-500">
                        {currentPage} / {totalPages}
                      </span>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                      {currentPage > 2 && (
                        <>
                          <button
                            type="button"
                            className="btn size-7.5 border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary"
                            onClick={() => goToPage(1)}
                          >
                            1
                          </button>
                          {currentPage > 3 && <span className="text-default-500">...</span>}
                        </>
                      )}

                      {currentPage > 1 && (
                        <button
                          type="button"
                          className="btn size-7.5 border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary"
                          onClick={() => goToPage(currentPage - 1)}
                        >
                          {currentPage - 1}
                        </button>
                      )}

                      <button type="button" className="btn size-7.5 bg-primary text-white">
                        {currentPage}
                      </button>

                      {currentPage < totalPages && (
                        <button
                          type="button"
                          className="btn size-7.5 border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary"
                          onClick={() => goToPage(currentPage + 1)}
                        >
                          {currentPage + 1}
                        </button>
                      )}

                      {currentPage < totalPages - 1 && (
                        <>
                          {currentPage < totalPages - 2 && <span className="text-default-500">...</span>}
                          <button
                            type="button"
                            className="btn size-7.5 border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary"
                            onClick={() => goToPage(totalPages)}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      className={`btn btn-sm border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/10 ${
                        currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <span className="hidden sm:inline">Suivant</span>
                      <LuChevronRight className="size-4 sm:ms-1" />
                    </button>
                  </nav>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MontureList;
