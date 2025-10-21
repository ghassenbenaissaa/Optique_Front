// Types et interfaces pour la gestion des entreprises

/**
 * Interface pour la réponse de récupération d'une entreprise
 */
export const GetEntrepriseResponse = {
  id: 0,
  nom: '',
  adresse: '',
  email: '',
  telephone: '',
  numeroFiscal: '',
  timbreFiscale: 0,
  tva: 0,
  logoUrl: null
};

/**
 * Interface pour la requête d'ajout d'une entreprise
 */
export const AddEntrepriseRequest = {
  nom: '',
  adresse: '',
  email: '',
  telephone: '',
  numeroFiscal: '',
  timbreFiscale: 0,
  tva: 0
};

/**
 * Interface pour la requête de mise à jour d'une entreprise
 */
export const UpdateEntrepriseRequest = {
  id: 0,
  nom: '',
  adresse: '',
  email: '',
  telephone: '',
  numeroFiscal: '',
  timbreFiscale: 0,
  tva: 0
};

/**
 * Validation des champs d'entreprise
 */
export const validateEntreprise = (entreprise) => {
  const errors = {};

  if (!entreprise.nom || entreprise.nom.trim() === '') {
    errors.nom = 'Le nom de l\'entreprise est requis';
  }

  if (!entreprise.adresse || entreprise.adresse.trim() === '') {
    errors.adresse = 'L\'adresse est requise';
  }

  if (!entreprise.email || entreprise.email.trim() === '') {
    errors.email = 'L\'email est requis';
  } else if (!/\S+@\S+\.\S+/.test(entreprise.email)) {
    errors.email = 'L\'email n\'est pas valide';
  }

  if (!entreprise.telephone || entreprise.telephone.trim() === '') {
    errors.telephone = 'Le téléphone est requis';
  }

  if (!entreprise.numeroFiscal || entreprise.numeroFiscal.trim() === '') {
    errors.numeroFiscal = 'Le numéro fiscal est requis';
  }

  if (entreprise.timbreFiscale < 0) {
    errors.timbreFiscale = 'Le timbre fiscal ne peut pas être négatif';
  }

  if (entreprise.tva < 0 || entreprise.tva > 100) {
    errors.tva = 'La TVA doit être entre 0 et 100%';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
