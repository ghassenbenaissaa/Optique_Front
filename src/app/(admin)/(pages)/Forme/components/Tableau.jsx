import { useState, useEffect } from 'react';
import { LuChevronLeft, LuChevronRight, LuPlus, LuSearch, LuSquarePen, LuTrash2, LuImage } from 'react-icons/lu';
import Swal from 'sweetalert2';

const FormeList = ({ onAddForme, onEditForme }) => {
  const [formes, setFormes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fonction pour récupérer les formes depuis l'API
  const fetchFormes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8089/api/v1/formeProduit/admin');

      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }

      const data = await response.json();
      setFormes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors du chargement des formes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer une forme avec SweetAlert2
  const deleteForme = async (id, name, imageUrl) => {
    // SweetAlert2 pour la confirmation de suppression
    const result = await Swal.fire({
      title: 'Supprimer la forme ?',
      html: `
        <div class="text-center">
          <div class="flex items-center justify-center mb-3">
            ${imageUrl ? 
              `<img src="${imageUrl}" alt="${name}" class="w-16 h-16 object-cover rounded-lg border-2 border-gray-300 mr-3" />` :
              `<div class="w-16 h-16 bg-gray-200 rounded-lg border-2 border-gray-300 mr-3 flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                </svg>
              </div>`
            }
            <span class="font-semibold text-lg">${name}</span>
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

    try {
      setDeletingId(id);

      // Afficher un loader pendant la suppression
      Swal.fire({
        title: 'Suppression en cours...',
        html: `Suppression de la forme <strong>${name}</strong>`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await fetch(`http://localhost:8089/api/v1/formeProduit/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        // Supprimer la forme de la liste locale
        setFormes(prevFormes => prevFormes.filter(forme => forme.id !== id));
        setError(null);

        // Afficher un message de succès
        Swal.fire({
          title: 'Suppression réussie !',
          html: `
            <div class="text-center">
              <div class="flex items-center justify-center mb-3">
                ${imageUrl ? 
                  `<img src="${imageUrl}" alt="${name}" class="w-16 h-16 object-cover rounded-lg border-2 border-gray-300 mr-3" />` :
                  `<div class="w-16 h-16 bg-gray-200 rounded-lg border-2 border-gray-300 mr-3 flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                    </svg>
                  </div>`
                }
                <span class="font-semibold">${name}</span>
              </div>
              <p class="text-gray-600">La forme a été supprimée avec succès.</p>
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      setError(`Erreur lors de la suppression: ${err.message}`);
      console.error('Erreur lors de la suppression:', err);

      // Afficher un message d'erreur
      Swal.fire({
        title: 'Erreur de suppression',
        text: `Impossible de supprimer la forme "${name}". ${err.message}`,
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

  // Charger les formes au montage du composant
  useEffect(() => {
    fetchFormes();
  }, []);

  // Filtrer les formes selon le terme de recherche
  const formesFiltered = formes.filter(forme =>
    forme.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculs pour la pagination
  const totalPages = Math.ceil(formesFiltered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFormes = formesFiltered.slice(startIndex, endIndex);

  // Fonction pour changer de page
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Réinitialiser la page à 1 quand on fait une recherche
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="grid grid-cols-1 gap-5 mb-5">
      <div className="card">
        <div className="card-header">
          <div className="md:flex md:space-y-0 space-y-3.5 gap-3 items-center">
            <div className="relative">
              <input
                type="text"
                className="ps-11 form-input form-input-sm w-full"
                placeholder="Rechercher une forme...."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                <LuSearch className="size-3.5 flex items-center text-default-500" />
              </div>
            </div>
          </div>

          <button
            className="btn btn-sm bg-primary text-white"
            onClick={onAddForme}
          >
            <LuPlus className="size-4 me-1" />
            Ajouter Forme
          </button>
        </div>

        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center">
                    <p>Chargement des formes...</p>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center text-red-500">
                    <p>Erreur: {error}</p>
                    <button
                      onClick={fetchFormes}
                      className="mt-2 btn btn-sm bg-primary text-white"
                    >
                      Réessayer
                    </button>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-default-200">
                    <thead className="bg-default-150">
                      <tr className="text-sm font-normal text-default-700">
                        <th className="px-3.5 py-3 text-start">Image</th>
                        <th className="px-3.5 py-3 text-start">Nom</th>
                        <th className="px-3.5 py-3 text-start">Disponibilité</th>
                        <th className="px-3.5 py-3 text-start">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-default-200">
                      {currentFormes.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-3.5 py-8 text-center text-default-500">
                            {searchTerm ? 'Aucune forme trouvée pour cette recherche' : 'Aucune forme trouvée'}
                          </td>
                        </tr>
                      ) : (
                        currentFormes.map(forme => (
                          <tr key={forme.id} className="text-default-800 font-normal">
                            <td className="px-3.5 py-2.5 whitespace-nowrap text-sm">
                              <div className="flex items-center">
                                {forme.imageUrl ? (
                                  <img
                                    src={forme.imageUrl}
                                    alt={forme.name}
                                    className="w-12 h-12 object-cover rounded-lg border border-default-200"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div
                                  className={`w-12 h-12 bg-default-100 rounded-lg border border-default-200 flex items-center justify-center ${forme.imageUrl ? 'hidden' : 'flex'}`}
                                >
                                  <LuImage className="size-5 text-default-400" />
                                </div>
                              </div>
                            </td>

                            <td className="px-3.5 py-2.5 whitespace-nowrap text-sm">
                              <h6 className="text-default-800 font-semibold">{forme.name}</h6>
                            </td>

                            <td className="px-3.5 py-2.5 whitespace-nowrap">
                              {forme.isAvailable ? (
                                <span className="inline-flex items-center gap-x-1.5 py-0.5 px-2.5 rounded text-xs font-medium bg-success/15 text-success">
                                  Disponible
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-x-1.5 py-0.5 px-2.5 rounded text-xs font-medium bg-danger/15 text-danger">
                                  Indisponible
                                </span>
                              )}
                            </td>

                            <td className="px-3.5 py-2.5">
                              <div className="flex items-center gap-2">
                                <button
                                  className="btn size-7.5 bg-warning/10 text-warning hover:bg-warning hover:text-white"
                                  title="Modifier"
                                  onClick={() => onEditForme(forme)}
                                >
                                  <LuSquarePen className="size-3" />
                                </button>
                                <button
                                  className="btn size-7.5 bg-danger/10 text-danger hover:bg-danger hover:text-white"
                                  title="Supprimer"
                                  onClick={() => deleteForme(forme.id, forme.name, forme.imageUrl)}
                                  disabled={deletingId === forme.id}
                                >
                                  {deletingId === forme.id ? (
                                    <span className="loader loader-sm"></span>
                                  ) : (
                                    <LuTrash2 className="size-3" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
          <div className="card-footer">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-default-500 text-sm text-center sm:text-left">
                Affichage de <b>{startIndex + 1}</b> à <b>{Math.min(endIndex, formesFiltered.length)}</b> sur <b>{formesFiltered.length}</b> forme(s)
                {searchTerm && <span className="block sm:inline"> (filtré sur {formes.length} au total)</span>}
              </p>

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

                {/* Affichage des numéros de pages - Adaptatif */}
                {totalPages > 1 && (
                  <>
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
                  </>
                )}

                <button
                  type="button"
                  className={`btn btn-sm border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/10 ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <span className="hidden sm:inline">Suivant</span>
                  <LuChevronRight className="size-4 sm:ms-1" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormeList;
