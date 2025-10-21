const API_BASE_URL = 'http://localhost:8089/api/v1';

// Services API pour la ressource Verre
// On retourne l'objet Response pour laisser la logique existante dans les composants (ok/json/erreurs)
export const fetchAllVerres = () => {
  return fetch(`${API_BASE_URL}/verre/admin/all`);
};

export const addVerre = (payload) => {
  return fetch(`${API_BASE_URL}/verre/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};

export const updateVerre = (payload) => {
  return fetch(`${API_BASE_URL}/verre/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};

export const deleteVerre = (id) => {
  return fetch(`${API_BASE_URL}/verre/delete/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
