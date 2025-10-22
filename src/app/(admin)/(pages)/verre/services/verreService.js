import api from '@/lib/axios';

// Wrapper pour exposer une interface proche de fetch Response
// Retourne un objet { ok, status, json: async () => data }
async function toFetchLike(promise) {
  try {
    const response = await promise; // Axios response
    return {
      ok: true,
      status: response.status,
      json: async () => response.data,
    };
  } catch (error) {
    // Erreur réseau (pas de response) ou erreur serveur avec response
    if (!error.response) {
      console.error('[VerreService] Erreur réseau ou serveur indisponible.', error);
      return {
        ok: false,
        status: 0,
        json: async () => ({ message: 'Erreur réseau ou serveur indisponible' }),
      };
    }

    const { status, data } = error.response;
    return {
      ok: false,
      status,
      json: async () => data,
    };
  }
}

// Services API pour la ressource Verre (compatibles avec l'ancien contrat fetch)
export const fetchAllVerres = () => {
  return toFetchLike(api.get('/verre/admin/all'));
};

export const addVerre = (payload) => {
  return toFetchLike(
    api.post('/verre/add', payload, {
      headers: { 'Content-Type': 'application/json' },
    })
  );
};

export const updateVerre = (payload) => {
  return toFetchLike(
    api.put('/verre/update', payload, {
      headers: { 'Content-Type': 'application/json' },
    })
  );
};

export const deleteVerre = (id) => {
  return toFetchLike(
    api.delete(`/verre/delete/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    })
  );
};
