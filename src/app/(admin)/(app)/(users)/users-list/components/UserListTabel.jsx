import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { LuChevronLeft, LuChevronRight, LuCircleCheck, LuCircleX, LuDownload, LuLoader, LuPlus, LuSearch, LuSlidersHorizontal, LuUserX } from 'react-icons/lu';
import Swal from 'sweetalert2';
import { userService } from '../services/userService';
import { getBanStatusLabel, formatDate } from '../types';

const UserListTabel = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [banningUser, setBanningUser] = useState(null);

  // Récupérer les utilisateurs
  const fetchUsers = async (page = 0) => {
    try {
      setLoading(true);
      console.log('Fetching users for page:', page);
      const response = await userService.getAllUsers(page, 10);
      console.log('API Response:', response);

      setUsers(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalUsers(response.totalElements || 0);
      setCurrentPage(page);

      console.log('Users set:', response.content?.length || 0, 'users');
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Bannir/débannir un utilisateur
  const handleToggleBan = async (userId, currentBanStatus) => {
    try {
      setBanningUser(userId);
      const newBanStatus = !currentBanStatus;
      await userService.toggleUserBanStatus(userId, newBanStatus);

      // Rafraîchir la liste des utilisateurs
      await fetchUsers(currentPage);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    } finally {
      setBanningUser(null);
    }
  };

  // Bannir un utilisateur avec confirmation SweetAlert
  const banUser = async (user) => {
    // SweetAlert2 pour la confirmation de bannissement
    const result = await Swal.fire({
      title: 'Bannir cet utilisateur ?',
      html: `
        <div class="text-center">
          <div class="flex items-center justify-center mb-3">
            <div class="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 font-semibold mr-3">
              ${user.firstname.charAt(0)}${user.lastname.charAt(0)}
            </div>
            <div class="text-left">
              <div class="font-semibold text-lg">${user.firstname} ${user.lastname}</div>
              <div class="text-gray-600 text-sm">${user.email}</div>
            </div>
          </div>
          <p class="text-red-600 font-medium">⚠️ Cette action est irréversible !</p>
          <p class="text-gray-600 text-sm mt-2">L'utilisateur sera définitivement banni et ne pourra plus accéder à la plateforme.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui, bannir',
      cancelButtonText: 'Annuler',
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        popup: 'swal2-popup-large',
        title: 'swal2-title-red'
      }
    });

    if (result.isConfirmed) {
      // Afficher le loading pendant l'action
      Swal.fire({
        title: 'Bannissement en cours...',
        html: `Bannissement de <strong>${user.firstname} ${user.lastname}</strong>`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await userService.toggleUserBanStatus(user.id, true);

        // Rafraîchir la liste des utilisateurs
        await fetchUsers(currentPage);

        // Succès
        Swal.fire({
          title: 'Utilisateur banni !',
          html: `<strong>${user.firstname} ${user.lastname}</strong> a été banni avec succès.`,
          icon: 'success',
          confirmButtonColor: '#059669',
          timer: 3000,
          timerProgressBar: true,
        });
      } catch (error) {
        console.error('Erreur lors du bannissement:', error);

        // Erreur
        Swal.fire({
          title: 'Erreur !',
          text: 'Une erreur est survenue lors du bannissement de l\'utilisateur.',
          icon: 'error',
          confirmButtonColor: '#dc2626',
        });
      }
    }
  };

  // Gérer la pagination
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      fetchUsers(page);
    }
  };

  // Filtrer les utilisateurs affichés
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' ||
      user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === '' ||
      (statusFilter === 'Banni' && user.isBanned) ||
      (statusFilter === 'Actif' && !user.isBanned);

    return matchesSearch && matchesStatus;
  });

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    fetchUsers();
  }, []);

  return <div className="card">
      <div className="card-header">
        <h6 className="card-title">Liste des Utilisateurs</h6>
      </div>

      <div className="card-header">
        <div className="md:flex items-center md:space-y-0 space-y-4 gap-3">
          <div className="relative">
            <input
              type="text"
              className="form-input form-input-sm ps-9"
              placeholder="Rechercher par nom ou email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 start-0 flex items-center ps-3">
              <LuSearch className="size-3.5 flex items-center text-default-500 fill-default-100" />
            </div>
          </div>

          <select
            className="form-input form-input-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="Actif">Actif</option>
            <option value="Banni">Banni</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <LuLoader className="size-6 animate-spin text-primary" />
                  <span className="ml-2">Chargement...</span>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-default-200">
                  <thead className="bg-default-150">
                    <tr className="text-sm font-normal text-default-700 whitespace-nowrap">
                      <th className="ps-4 text-start">
                        <input id="checkbox-all" type="checkbox" className="form-checkbox" />
                      </th>
                      <th className="px-3.5 py-3 text-start">ID</th>
                      <th className="px-3.5 py-3 text-start">Nom</th>
                      <th className="px-3.5 py-3 text-start">Email</th>
                      <th className="px-3.5 py-3 text-start">Téléphone</th>
                      <th className="px-3.5 py-3 text-start">Adresse</th>
                      <th className="px-3.5 py-3 text-start">Date d'inscription</th>
                      <th className="px-3.5 py-3 text-start">Statut</th>
                      <th className="px-3.5 py-3 text-start">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="text-default-800 font-normal text-sm whitespace-nowrap">
                        <td className="py-3 ps-4">
                          <input type="checkbox" className="form-checkbox" />
                        </td>
                        <td className="px-3.5 py-3 text-primary">#{user.id}</td>
                        <td className="flex py-3 px-3.5 items-center gap-3">
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                            {user.firstname.charAt(0)}{user.lastname.charAt(0)}
                          </div>
                          <div>
                            <h6 className="mb-1.5 font-semibold">
                              <Link to="#" className="text-default-800">
                                {user.firstname} {user.lastname}
                              </Link>
                            </h6>
                          </div>
                        </td>
                        <td className="py-3 px-3.5">{user.email}</td>
                        <td className="py-3 px-3.5">{user.numTel}</td>
                        <td className="py-3 px-3.5">{user.adresse}</td>
                        <td className="py-3 px-3.5">{formatDate(user.createdDate)}</td>
                        <td className="px-3.5 py-3">
                          {!user.isBanned ? (
                            <span className="py-0.5 px-2.5 inline-flex items-center gap-x-1 text-xs font-medium bg-success/10 text-success rounded">
                              <LuCircleCheck className="size-3" />
                              Actif
                            </span>
                          ) : (
                            <span className="py-0.5 px-2.5 inline-flex items-center gap-x-1 text-xs font-medium bg-danger/10 text-danger rounded">
                              <LuCircleX className="size-3" />
                              Banni
                            </span>
                          )}
                        </td>
                        <td className="px-3.5 py-3">
                          {user.isBanned ? (
                            <div className="text-center">
                              <p className="text-xs text-red-600 mb-1">Action irréversible</p>
                              <button
                                disabled
                                className="btn btn-sm bg-gray-200 text-gray-500 cursor-not-allowed"
                              >
                                <LuUserX className="size-3 mr-1" />
                                Déjà banni
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => banUser(user)}
                              className="btn btn-sm bg-danger/10 text-danger hover:bg-danger hover:text-white"
                            >
                              <LuUserX className="size-3 mr-1" />
                              Bannir
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        <div className="card-footer">
          <p className="text-default-500 text-sm">
            Affichage de <b>{Math.min(10, filteredUsers.length)}</b> sur <b>{totalUsers}</b> résultats
          </p>
          <nav className="flex items-center gap-2" aria-label="Pagination">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="btn btn-sm border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LuChevronLeft className="size-4 me-1" /> Précédent
            </button>

            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              const pageNum = Math.max(0, Math.min(currentPage - 2 + index, totalPages - 1));
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`btn size-7.5 ${currentPage === pageNum 
                    ? 'bg-primary text-white' 
                    : 'bg-transparent border border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/10'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="btn btn-sm border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
              <LuChevronRight className="size-4 ms-1" />
            </button>
          </nav>
        </div>
      </div>
    </div>;
};

export default UserListTabel;
