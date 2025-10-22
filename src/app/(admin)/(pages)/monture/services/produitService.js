import api from '@/lib/axios';

// Service pour les produits
export const produitService = {
  // Récupérer tous les produits
  getAllProduits: async () => {
    const response = await api.get('/produit/all/admin');
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

    const response = await api.post('/produit/add', formData, {
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

    const response = await api.put('/produit/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Supprimer un produit
  deleteProduit: async (id) => {
    await api.delete(`/produit/delete/${id}`);
  },

  // Appliquer un solde
  applySolde: async (data) => {
    await api.put('/produit/solde', data);
  },
};

// Services pour les données de référence
export const referenceDataService = {
  getMarques: async () => {
    const response = await api.get('/marque/admin');
    return response.data;
  },

  getMateriaux: async () => {
    const response = await api.get('/materiauProduit/admin');
    return response.data;
  },

  getCouleurs: async () => {
    const response = await api.get('/couleur/admin');
    return response.data;
  },

  getFormes: async () => {
    const response = await api.get('/formeProduit/admin');
    return response.data;
  },
};
