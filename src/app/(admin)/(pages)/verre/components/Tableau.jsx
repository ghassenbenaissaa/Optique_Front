import { useState, useEffect } from 'react';
import { LuChevronLeft, LuChevronRight, LuPlus, LuSearch, LuSquarePen, LuTrash2 } from 'react-icons/lu';
import Swal from 'sweetalert2';

const VerreList = ({ onAddVerre, onEditVerre }) => {
  const [verres, setVerres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fonction pour récupérer les verres depuis l'API
  const fetchVerres = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8089/api/v1/verre/admin/all');

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const responseData = await response.json();

      // Vérifier le format de la réponse avec success/data
      let data = [];
      if (responseData.success && responseData.data) {
        data = responseData.data;
      } else if (Array.isArray(responseData)) {
        // Fallback si l'API retourne directement un array
        data = responseData;
      } else {
        throw new Error('Format de réponse API invalide');
      }

      // Validation et nettoyage des données
      const cleanedData = Array.isArray(data) ? data.map((verre, index) => {
        // Vérifier si l'objet a un ID réel, sinon marquer comme non supprimable
        const hasRealId = verre.id && typeof verre.id === 'number';
        const id = hasRealId ? verre.id : `temp-${index}-${verre.type}-${Date.now()}`;

        return {
          id: id,
          realId: hasRealId ? verre.id : null, // Stocker le vrai ID séparément
          type: verre.type || 'Type non défini',
          indice: verre.indice || 0,
          materiau: verre.materiau || 'Matériau non défini',
          basePrice: verre.basePrice || 0,
          isAvailable: verre.isAvailable !== undefined ? verre.isAvailable : true,
          canDelete: hasRealId // Indiquer si le verre peut être supprimé
        };
      }).filter(verre =>
        verre &&
        typeof verre === 'object' &&
        verre.type !== 'Type non défini'
      ) : [];

      setVerres(cleanedData);
    } catch (err) {
      console.error('Erreur lors du chargement des verres:', err);
      setError(`Erreur de chargement: ${err.message}`);
      setVerres([]);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer un verre avec SweetAlert2
  const deleteVerre = async (verre) => {
    // Vérifier si le verre peut être supprimé (a un ID réel)
    if (!verre.canDelete || !verre.realId) {
      await Swal.fire({
        title: 'Suppression impossible',
        html: `
          <div class="text-center">
            <div class="mb-3">
              <div class="bg-orange-100 text-orange-600 px-3 py-2 rounded-lg font-semibold mb-2">
                ${verre.type}
              </div>
            </div>
            <p class="text-gray-600">Ce verre ne peut pas être supprimé car il n'a pas d'identifiant valide.</p>
            <p class="text-sm text-gray-500 mt-2">Cela peut arriver si le verre vient d'être ajouté ou s'il y a un problème avec l'API.</p>
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
      // SweetAlert2 pour la confirmation de suppression
      const result = await Swal.fire({
        title: 'Supprimer le verre ?',
        html: `
          <div class="text-center">
            <div class="mb-3">
              <div class="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg font-semibold mb-2">
                ${verre.type}
              </div>
              <div class="text-sm text-gray-600">
                <span class="font-medium">Indice:</span> ${verre.indice} • 
                <span class="font-medium">Matériau:</span> ${verre.materiau}
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

      if (!result.isConfirmed) {
        return;
      }

      setDeletingId(verre.id);

      // Afficher un loader pendant la suppression
      Swal.fire({
        title: 'Suppression en cours...',
        html: `Suppression du verre <strong>${verre.type}</strong>`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Utiliser le realId pour la suppression
      const response = await fetch(`http://localhost:8089/api/v1/verre/delete/${verre.realId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        // Supprimer le verre de la liste locale
        setVerres(prevVerres => prevVerres.filter(v => v.id !== verre.id));
        setError(null);

        // Afficher un message de succès
        await Swal.fire({
          title: 'Suppression réussie !',
          html: `
            <div class="text-center">
              <div class="mb-3">
                <div class="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg font-semibold mb-2">
                  ${verre.type}
                </div>
                <div class="text-sm text-gray-600">
                  <span class="font-medium">Indice:</span> ${verre.indice} • 
                  <span class="font-medium">Matériau:</span> ${verre.materiau}
                </div>
              </div>
              <p class="text-gray-600">Le verre a été supprimé avec succès.</p>
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

      // Afficher un message d'erreur
      await Swal.fire({
        title: 'Erreur de suppression',
        text: `Impossible de supprimer le verre "${verre.type}". ${err.message}`,
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

  // Fonction pour formater le prix en dinars tunisiens
  const formatPrice = (price) => {
    try {
      const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
      return new Intl.NumberFormat('ar-TN', {
        style: 'currency',
        currency: 'TND',
        minimumFractionDigits: 3
      }).format(numPrice);
    } catch (error) {
      // Fallback en cas d'erreur de formatage
      console.error('Erreur de formatage du prix:', error);
      return `${numPrice.toFixed(3)} DT`;
    }
  };

  // Charger les verres au montage du composant
  useEffect(() => {
    fetchVerres();
  }, []);

  // Filtrer les verres selon le terme de recherche avec vérifications de sécurité
  const verresFiltered = verres.filter(verre => {
    if (!verre || typeof verre !== 'object') return false;

    const type = (verre.type || '').toString().toLowerCase();
    const materiau = (verre.materiau || '').toString().toLowerCase();
    const search = (searchTerm || '').toLowerCase();

    return type.includes(search) || materiau.includes(search);
  });

  // Calculs pour la pagination
  const totalPages = Math.max(1, Math.ceil(verresFiltered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVerres = verresFiltered.slice(startIndex, endIndex);

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

  // Fonction pour gérer l'édition avec vérification de sécurité
  const handleEdit = (verre) => {
    if (!verre || !verre.id) {
      console.error('Verre invalide pour édition:', verre);
      return;
    }

    if (typeof onEditVerre === 'function') {
      onEditVerre(verre);
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
                placeholder="Rechercher un verre...."
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
            onClick={onAddVerre}
            disabled={loading}
          >
            <LuPlus className="size-4 me-1" />
            Ajouter Verre
          </button>
        </div>

        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-2 text-default-600">Chargement des verres...</p>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center text-red-500">
                    <p className="mb-3">❌ {error}</p>
                    <button
                      onClick={fetchVerres}
                      className="btn btn-sm bg-primary text-white"
                    >
                      🔄 Réessayer
                    </button>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-default-200">
                    <thead className="bg-default-150">
                      <tr className="text-sm font-normal text-default-700">
                        <th className="px-3.5 py-3 text-start">Type</th>
                        <th className="px-3.5 py-3 text-start">Indice</th>
                        <th className="px-3.5 py-3 text-start">Matériau</th>
                        <th className="px-3.5 py-3 text-start">Prix de base</th>
                        <th className="px-3.5 py-3 text-start">Disponibilité</th>
                        <th className="px-3.5 py-3 text-start">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-default-200">
                      {currentVerres.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-3.5 py-8 text-center text-default-500">
                            {searchTerm ? 'Aucun verre trouvé pour cette recherche' : 'Aucun verre trouvé'}
                          </td>
                        </tr>
                      ) : (
                        currentVerres.map((verre, index) => {
                          // Vérification de sécurité pour chaque verre
                          if (!verre || !verre.id) {
                            console.warn('Verre invalide détecté:', verre, 'à l\'index:', index);
                            return null;
                          }

                          return (
                            <tr key={`verre-${verre.id}-${index}`} className="text-default-800 font-normal">
                              <td className="px-3.5 py-2.5 whitespace-nowrap text-sm">
                                <h6 className="text-default-800 font-semibold">
                                  {verre.type || 'Type non défini'}
                                </h6>
                              </td>

                              <td className="px-3.5 py-2.5 whitespace-nowrap text-sm">
                                <span className="font-mono text-primary font-semibold">
                                  {verre.indice || '0'}
                                </span>
                              </td>

                              <td className="px-3.5 py-2.5 whitespace-nowrap text-sm">
                                <span className="text-default-700">
                                  {verre.materiau || 'Matériau non défini'}
                                </span>
                              </td>

                              <td className="px-3.5 py-2.5 whitespace-nowrap text-sm">
                                <span className="text-green-600 font-semibold">
                                  {formatPrice(verre.basePrice)}
                                </span>
                              </td>

                              <td className="px-3.5 py-2.5 whitespace-nowrap">
                                {verre.isAvailable ? (
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
                                    className="btn size-7.5 bg-warning/10 text-warning hover:bg-warning hover:text-white"
                                    title="Modifier"
                                    onClick={() => handleEdit(verre)}
                                    disabled={deletingId === verre.id}
                                  >
                                    <LuSquarePen className="size-3" />
                                  </button>
                                  <button
                                    className={`btn size-7.5 bg-danger/10 text-danger hover:bg-danger hover:text-white ${
                                      !verre.canDelete ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    title={verre.canDelete ? "Supprimer" : "Suppression impossible - ID manquant"}
                                    onClick={() => deleteVerre(verre)}
                                    disabled={deletingId === verre.id || !verre.canDelete}
                                  >
                                    {deletingId === verre.id ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                                    ) : (
                                      <LuTrash2 className="size-3" />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }).filter(Boolean) // Enlever les éléments null
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Pagination uniquement si pas de chargement et pas d'erreur */}
          {!loading && !error && (
            <div className="card-footer">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-default-500 text-sm text-center sm:text-left">
                  Affichage de <b>{Math.min(startIndex + 1, verresFiltered.length)}</b> à <b>{Math.min(endIndex, verresFiltered.length)}</b> sur <b>{verresFiltered.length}</b> verre(s)
                  {searchTerm && <span className="block sm:inline"> (filtré sur {verres.length} au total)</span>}
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

                    {/* Version mobile : Seulement page actuelle et totale */}
                    <div className="flex sm:hidden items-center gap-1">
                      <span className="text-sm text-default-500">
                        {currentPage} / {totalPages}
                      </span>
                    </div>

                    {/* Version desktop : Numéros de pages complets */}
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

export default VerreList;
