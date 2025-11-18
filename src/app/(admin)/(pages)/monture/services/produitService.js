import api from '@/lib/axios';

function appendVariationFields(formData, variations) {
  (variations || []).forEach((v, i) => {
    if (v.id != null) formData.append(`variations[${i}].id`, String(v.id));
    formData.append(`variations[${i}].couleur`, v.couleur ?? '');
    formData.append(`variations[${i}].materiauProduit`, v.materiauProduit ?? '');
    formData.append(`variations[${i}].quantity`, String(Number.isFinite(v.quantity) ? v.quantity : parseInt(v.quantity ?? 0)));
    if (v.priceOverride != null && v.priceOverride !== '') formData.append(`variations[${i}].priceOverride`, String(v.priceOverride));
    if (v.solde != null && v.solde !== '') formData.append(`variations[${i}].solde`, String(v.solde));
    const files = v.images || [];
    files.forEach((file) => {
      if (file instanceof File) {
        formData.append(`variations[${i}].images`, file);
      }
    });
    if (v.deletedImageUrls && v.deletedImageUrls.length > 0) {
      v.deletedImageUrls.forEach(url => {
        formData.append(`variations[${i}].deletedImageUrls`, url);
      });
    }
  });
}

export const produitService = {
  getAllProduits: async () => {
    const response = await api.get('/produit/all/admin');
    return response.data;
  },

  addProduit: async (data) => {
    if (data.variations && data.variations.length > 0) {
      for (let i = 0; i < data.variations.length; i++) {
        const variation = data.variations[i];
        const files = variation.images || [];
        if (files.length === 0) {
          throw new Error(`La variation ${i + 1} (${variation.couleur || 'couleur non définie'}) doit avoir au moins une image.`);
        }
        const validFiles = files.filter(file => file instanceof File);
        if (validFiles.length === 0) {
          throw new Error(`La variation ${i + 1} (${variation.couleur || 'couleur non définie'}) ne contient aucun fichier valide.`);
        }
      }
    }

    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', String(data.price));
    formData.append('Marque', data.marque);
    formData.append('categorie', data.categorie);
    formData.append('gender', data.gender);
    formData.append('taille', data.taille);
    formData.append('typeMonture', data.typeMonture);
    formData.append('formeProduit', data.formeProduit);

    if (data.largeurTotale != null && data.largeurTotale !== '') formData.append('largeurTotale', String(data.largeurTotale));
    if (data.largeurVerre != null && data.largeurVerre !== '') formData.append('largeurVerre', String(data.largeurVerre));
    if (data.hauteurVerre != null && data.hauteurVerre !== '') formData.append('hauteurVerre', String(data.hauteurVerre));
    if (data.largeurPont != null && data.largeurPont !== '') formData.append('largeurPont', String(data.largeurPont));
    if (data.longueurBranche != null && data.longueurBranche !== '') formData.append('longueurBranche', String(data.longueurBranche));

    appendVariationFields(formData, data.variations);


    const response = await api.post('/produit/add', formData);
    return response.data;
  },

  updateProduit: async (data) => {
   if (data.variations && data.variations.length > 0) {
      for (let i = 0; i < data.variations.length; i++) {
        const variation = data.variations[i];
        const newFiles = variation.images || [];
        const existingImages = variation.existingImageUrls || [];
        const deletedImages = variation.deletedImageUrls || [];
        const remainingExistingImages = Math.max(0, existingImages.length - deletedImages.length);
        const totalImagesAfterUpdate = remainingExistingImages + newFiles.length;
        if (totalImagesAfterUpdate === 0) {
          throw new Error(`La variation ${i + 1} (${variation.couleur || 'couleur non définie'}) doit avoir au moins une image.`);
        }
        if (newFiles.length > 0) {
          const validFiles = newFiles.filter(file => file instanceof File);
          if (validFiles.length !== newFiles.length) {
            throw new Error(`La variation ${i + 1} (${variation.couleur || 'couleur non définie'}) contient des fichiers invalides.`);
          }
        }
      }
    }

    const formData = new FormData();

    formData.append('id', String(data.id));
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', String(data.price));
    formData.append('Marque', data.marque);
    formData.append('categorie', data.categorie);
    formData.append('gender', data.gender);
    formData.append('taille', data.taille);
    formData.append('typeMonture', data.typeMonture);
    formData.append('formeProduit', data.formeProduit);
    if (typeof data.isAvailable !== 'undefined') formData.append('isAvailable', String(!!data.isAvailable));

    if (data.largeurTotale != null && data.largeurTotale !== '') formData.append('largeurTotale', String(data.largeurTotale));
    if (data.largeurVerre != null && data.largeurVerre !== '') formData.append('largeurVerre', String(data.largeurVerre));
    if (data.hauteurVerre != null && data.hauteurVerre !== '') formData.append('hauteurVerre', String(data.hauteurVerre));
    if (data.largeurPont != null && data.largeurPont !== '') formData.append('largeurPont', String(data.largeurPont));
    if (data.longueurBranche != null && data.longueurBranche !== '') formData.append('longueurBranche', String(data.longueurBranche));
    appendVariationFields(formData, data.variations);

    const response = await api.put('/produit/update', formData);
    return response.data;
  },

  deleteProduit: async (id) => {
    await api.delete(`/produit/delete/${id}`);
  },

  applySolde: async (data) => {
    await api.put('/produit/solde', data);
  },
};

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
