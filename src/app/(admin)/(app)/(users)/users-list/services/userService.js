import axios from 'axios';

const API_BASE_URL = 'http://localhost:8089/api/v1';

export const userService = {
  // Récupérer tous les utilisateurs avec pagination
  getAllUsers: async (page = 0, size = 10) => {
    const response = await axios.get(`${API_BASE_URL}/user/all`, {
      params: {
        page,
        size
      }
    });

    // Adapter la structure pour correspondre aux données réelles
    const users = response.data;

    // Si c'est un tableau direct, on simule la pagination côté client
    if (Array.isArray(users)) {
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedUsers = users.slice(startIndex, endIndex);

      return {
        content: paginatedUsers.map(user => ({
          ...user,
          isBanned: user.banned // Mapper banned vers isBanned
        })),
        totalElements: users.length,
        totalPages: Math.ceil(users.length / size),
        number: page,
        size: size
      };
    }

    // Si c'est déjà une structure paginée, on l'adapte
    return {
      content: (response.data.content || response.data).map(user => ({
        ...user,
        isBanned: user.banned // Mapper banned vers isBanned
      })),
      totalElements: response.data.totalElements || response.data.length,
      totalPages: response.data.totalPages || Math.ceil((response.data.totalElements || response.data.length) / size),
      number: response.data.number || page,
      size: response.data.size || size
    };
  },

  // Basculer le statut de ban d'un utilisateur
  toggleUserBanStatus: async (userId, banStatus) => {
    const response = await axios.put(
      `${API_BASE_URL}/user/toggleUserBanStatus/${userId}`,
      null,
      {
        params: {
          banStatus
        }
      }
    );
    return response.data;
  },
};
