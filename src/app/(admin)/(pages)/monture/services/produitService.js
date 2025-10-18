import axios from 'axios';

const API_BASE_URL = 'http://localhost:8089/api/v1';

// Service pour les produits
export const produitService = {
  // Récupérer tous les produits
  getAllProduits: async () => {
    const response = await axios.get(`${API_BASE_URL}/produit/all/admin`);
    return response.data;
  },

  // Ajouter un produit
  addProduit: async (data) => {
    const formData = new FormData();

    // Ajouter les champs simples
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('Marque', data.marque);
    formData.append('categorie', data.categorie);
    formData.append('gender', data.gender);
    formData.append('taille', data.taille);
    formData.append('typeMonture', data.typeMonture);
    formData.append('formeProduit', data.formeProduit);

    // Ajouter les dimensions optionnelles
    if (data.largeurTotale) formData.append('largeurTotale', data.largeurTotale.toString());
    if (data.largeurVerre) formData.append('largeurVerre', data.largeurVerre.toString());
    if (data.hauteurVerre) formData.append('hauteurVerre', data.hauteurVerre.toString());
    if (data.largeurPont) formData.append('largeurPont', data.largeurPont.toString());
    if (data.longueurBranche) formData.append('longueurBranche', data.longueurBranche.toString());

    // Ajouter les images
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    // ⚠️ Changement: Envoyer rawVariations au lieu de variations
    formData.append('rawVariations', JSON.stringify(data.variations));

    const response = await axios.post(`${API_BASE_URL}/produit/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Mettre à jour un produit
  updateProduit: async (data) => {
    const formData = new FormData();

    formData.append('id', data.id.toString());
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('Marque', data.marque);
    formData.append('categorie', data.categorie);
    formData.append('gender', data.gender);
    formData.append('taille', data.taille);
    formData.append('typeMonture', data.typeMonture);
    formData.append('formeProduit', data.formeProduit);

    if (data.largeurTotale) formData.append('largeurTotale', data.largeurTotale.toString());
    if (data.largeurVerre) formData.append('largeurVerre', data.largeurVerre.toString());
    if (data.hauteurVerre) formData.append('hauteurVerre', data.hauteurVerre.toString());
    if (data.largeurPont) formData.append('largeurPont', data.largeurPont.toString());
    if (data.longueurBranche) formData.append('longueurBranche', data.longueurBranche.toString());

    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    // ⚠️ Changement: Envoyer rawVariations au lieu de variations
    formData.append('rawVariations', JSON.stringify(data.variations));

    const response = await axios.put(`${API_BASE_URL}/produit/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Supprimer un produit
  deleteProduit: async (id) => {
    await axios.delete(`${API_BASE_URL}/produit/delete/${id}`);
  },

  // Appliquer un solde
  applySolde: async (data) => {
    await axios.put(`${API_BASE_URL}/produit/solde`, data);
  },
};

// Services pour les données de référence
export const referenceDataService = {
  getMarques: async () => {
    const response = await axios.get(`${API_BASE_URL}/marque/admin`);
    return response.data;
  },

  getMateriaux: async () => {
    const response = await axios.get(`${API_BASE_URL}/materiauProduit/admin`);
    return response.data;
  },

  getCouleurs: async () => {
    const response = await axios.get(`${API_BASE_URL}/couleur/admin`);
    return response.data;
  },

  getFormes: async () => {
    const response = await axios.get(`${API_BASE_URL}/formeProduit/admin`);
    return response.data;
  },
};
