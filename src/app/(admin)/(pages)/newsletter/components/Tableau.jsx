import { useState, useEffect } from 'react';
import { LuChevronLeft, LuChevronRight, LuSearch, LuMail } from 'react-icons/lu';
import { newsletterService } from '../services/newsletterService';

const NewsletterTableau = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fonction pour récupérer les abonnés depuis l'API
  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const data = await newsletterService.getNewsletters();
      setNewsletters(data);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Erreur lors du chargement des abonnés');
      console.error('Erreur lors du chargement des abonnés:', err);
    } finally {
      setLoading(false);
    }
  };

  // Charger les abonnés au montage du composant
  useEffect(() => {
    fetchNewsletters();
  }, []);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '-';

    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      return dateString;
    }
  };

  // Filtrer les abonnés selon le terme de recherche
  const newslettersFiltered = newsletters.filter(newsletter =>
    newsletter.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculs pour la pagination
  const totalPages = Math.ceil(newslettersFiltered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNewsletters = newslettersFiltered.slice(startIndex, endIndex);

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
                placeholder="Rechercher un email...."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                <LuSearch className="size-3.5 flex items-center text-default-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center">
                    <p>Chargement des abonnés...</p>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center text-red-500">
                    <p>Erreur: {error}</p>
                    <button
                      onClick={fetchNewsletters}
                      className="mt-2 btn btn-sm bg-primary text-white"
                    >
                      Réessayer
                    </button>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-default-200">
                    <thead className="bg-default-150">
                      <tr className="text-sm font-normal text-default-700">
                        <th className="px-3.5 py-3 text-start">Email</th>
                        <th className="px-3.5 py-3 text-start">Date d'inscription</th>
                        <th className="px-3.5 py-3 text-start">Confirmé</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-default-200">
                      {currentNewsletters.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="px-3.5 py-8 text-center text-default-500">
                            {searchTerm ? 'Aucun abonné trouvé pour cette recherche' : 'Aucun abonné trouvé'}
                          </td>
                        </tr>
                      ) : (
                        currentNewsletters.map((newsletter, index) => (
                          <tr key={`${newsletter.email}-${index}`} className="text-default-800 font-normal">
                            <td className="px-3.5 py-2.5 whitespace-nowrap text-sm">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                                  <LuMail className="size-4 text-primary" />
                                </div>
                                <h6 className="text-default-800 font-semibold">{newsletter.email}</h6>
                              </div>
                            </td>

                            <td className="px-3.5 py-2.5 whitespace-nowrap text-sm">
                              <span className="text-default-600">{formatDate(newsletter.subscriptionDate)}</span>
                            </td>

                            <td className="px-3.5 py-2.5 whitespace-nowrap">
                              {newsletter.confirmed ? (
                                <span className="inline-flex items-center gap-x-1.5 py-0.5 px-2.5 rounded text-xs font-medium bg-success/15 text-success">
                                  Oui
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-x-1.5 py-0.5 px-2.5 rounded text-xs font-medium bg-danger/15 text-danger">
                                  Non
                                </span>
                              )}
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
                Affichage de <b>{startIndex + 1}</b> à <b>{Math.min(endIndex, newslettersFiltered.length)}</b> sur <b>{newslettersFiltered.length}</b> abonné(s)
                {searchTerm && <span className="block sm:inline"> (filtré sur {newsletters.length} au total)</span>}
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

                {totalPages > 1 && (
                  <div className="flex sm:hidden items-center gap-1">
                    <span className="text-sm text-default-500">
                      {currentPage} / {totalPages}
                    </span>
                  </div>
                )}

                {totalPages > 1 && (
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

export default NewsletterTableau;

