import { useState, useEffect } from 'react';
import IconifyIcon from '@/components/client-wrapper/IconifyIcon';

const FormulaireModification = ({ monture, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    quantity: '',
    marque: '',
    couleur: '',
    isAvailable: true,
    categorie: '',
    gender: '',
    taille: '',
    typeMonture: '',
    materiauProduit: '',
    formeProduit: '',
    largeurTotale: '',
    largeurVerre: '',
    hauteurVerre: '',
    largeurPont: '',
    longueurBranche: ''
  });

  // États pour la gestion des images
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagesPreviews, setImagesPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // États pour les données de référence
  const [marques, setMarques] = useState([]);
  const [couleurs, setCouleurs] = useState([]);
  const [materiaux, setMateriaux] = useState([]);
  const [formes, setFormes] = useState([]);
  const [loadingRefs, setLoadingRefs] = useState(true);

  // Énumérations
  const categories = [
    { value: 'LUNETTE_DE_SOLEIL', label: 'Lunette de soleil' },
    { value: 'LUNETTE_DE_VUE', label: 'Lunette de vue' },
    { value: 'LUNETTE_IA', label: 'Lunette IA' }
  ];

  const genders = [
    { value: 'HOMME', label: 'Homme' },
    { value: 'FEMME', label: 'Femme' },
    { value: 'UNISEX', label: 'Unisexe' },
    { value: 'ENFANT', label: 'Enfant' }
  ];

  const tailles = [
    { value: 'EXTRA_PETIT', label: 'Extra petit' },
    { value: 'PETIT', label: 'Petit' },
    { value: 'MOYEN', label: 'Moyen' },
    { value: 'GRAND', label: 'Grand' },
    { value: 'EXTRA_GRAND', label: 'Extra grand' }
  ];

  const typesMonture = [
    { value: 'CERCLÉE', label: 'Cerclée' },
    { value: 'DEMI_CERCLÉE', label: 'Demi-cerclée' },
    { value: 'SANS_MONTURE', label: 'Sans monture' }
  ];

  // Initialiser le formulaire avec les données de la monture à modifier
  useEffect(() => {
    if (monture) {
      // Améliorer la récupération de l'ID avec plus de robustesse
      const getId = () => {
        const possibleIds = [monture.realId, monture.id, monture.Id];
        console.log('🔍 DEBUG: Monture reçue:', monture);
        console.log('🔍 DEBUG: possibleIds:', possibleIds);
        console.log('🔍 DEBUG: Type de monture:', typeof monture);
        console.log('🔍 DEBUG: Clés de la monture:', Object.keys(monture));

        for (const id of possibleIds) {
          console.log('🔍 DEBUG: Vérification ID:', id, 'Type:', typeof id, 'isNaN:', isNaN(id));
          if (id !== undefined && id !== null && id !== '' && !isNaN(parseInt(id))) {
            console.log('✅ DEBUG: ID valide trouvé:', id);
            return id.toString();
          }
        }
        console.warn('❌ DEBUG: Aucun ID valide trouvé pour la monture:', monture);
        return '';
      };

      const finalId = getId();
      console.log('🎯 DEBUG: ID final assigné:', finalId, 'Type:', typeof finalId);

      setFormData({
        id: finalId,
        name: monture.name || '',
        description: monture.description || '',
        price: monture.price?.toString() || '',
        quantity: monture.quantity?.toString() || '',
        marque: monture.marque || '',
        couleur: monture.couleur || '',
        isAvailable: monture.isAvailable !== undefined ? monture.isAvailable : true,
        categorie: monture.categorie || '',
        gender: monture.gender || '',
        taille: monture.taille || '',
        typeMonture: monture.typeMonture || '',
        materiauProduit: monture.materiauProduit || '',
        formeProduit: monture.formeProduit || '',
        largeurTotale: monture.largeurTotale?.toString() || '',
        largeurVerre: monture.largeurVerre?.toString() || '',
        hauteurVerre: monture.hauteurVerre?.toString() || '',
        largeurPont: monture.largeurPont?.toString() || '',
        longueurBranche: monture.longueurBranche?.toString() || ''
      });

      // Initialiser les images existantes
      if (monture.imageUrl && Array.isArray(monture.imageUrl)) {
        setExistingImages(monture.imageUrl);
        console.log('🖼️ DEBUG: Images existantes trouvées:', monture.imageUrl);
      } else {
        setExistingImages([]);
        console.log('🖼️ DEBUG: Aucune image existante');
      }

      console.log('💾 FormData qui va être assigné:', {
        id: finalId,
        name: monture.name || '',
        // autres champs...
      });
      console.log('🔍 ID dans formData:', finalId, 'Type:', typeof finalId);
    }
  }, [monture]);

  // Charger les données de référence
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        setLoadingRefs(true);
        const [marquesRes, couleursRes, materiauxRes, formesRes] = await Promise.all([
          fetch('http://localhost:8089/api/v1/marque/admin'),
          fetch('http://localhost:8089/api/v1/couleur/admin'),
          fetch('http://localhost:8089/api/v1/materiauProduit/admin'),
          fetch('http://localhost:8089/api/v1/formeProduit/admin')
        ]);

        const [marquesData, couleursData, materiauxData, formesData] = await Promise.all([
          marquesRes.ok ? marquesRes.json() : { data: [] },
          couleursRes.ok ? couleursRes.json() : { data: [] },
          materiauxRes.ok ? materiauxRes.json() : { data: [] },
          formesRes.ok ? formesRes.json() : { data: [] }
        ]);

        // Extraire les données selon le format de réponse avec vérifications de sécurité
        setMarques(Array.isArray(marquesData.data) ? marquesData.data : Array.isArray(marquesData) ? marquesData : []);
        setCouleurs(Array.isArray(couleursData.data) ? couleursData.data : Array.isArray(couleursData) ? couleursData : []);
        setMateriaux(Array.isArray(materiauxData.data) ? materiauxData.data : Array.isArray(materiauxData) ? materiauxData : []);
        setFormes(Array.isArray(formesData.data) ? formesData.data : Array.isArray(formesData) ? formesData : []);
      } catch (error) {
        console.error('Erreur lors du chargement des données de référence:', error);
        // En cas d'erreur, initialiser avec des tableaux vides pour éviter les erreurs de rendu
        setMarques([]);
        setCouleurs([]);
        setMateriaux([]);
        setFormes([]);
      } finally {
        setLoadingRefs(false);
      }
    };

    fetchReferenceData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;

    if (type === 'checkbox') {
      processedValue = checked;
    } else if (type === 'number') {
      processedValue = value === '' ? '' : value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Gérer la sélection des fichiers image
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Créer des aperçus d'image
    const previews = files.map(file => URL.createObjectURL(file));
    setImagesPreviews(previews);

    // Réinitialiser les erreurs d'image
    setErrors(prev => ({
      ...prev,
      images: ''
    }));
  };

  // Supprimer une image sélectionnée
  const handleImageRemove = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);

    // Mettre à jour les aperçus
    const newPreviews = imagesPreviews.filter((_, i) => i !== index);
    setImagesPreviews(newPreviews);
  };

  // Supprimer une image existante
  const handleExistingImageRemove = (index) => {
    const newExistingImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(newExistingImages);
  };

  const validateForm = () => {
    const newErrors = {};

    console.log('🔍 VALIDATION - FormData actuel:', formData);
    console.log('🔍 VALIDATION - ID à valider:', formData.id, 'Type:', typeof formData.id);
    console.log('🔍 VALIDATION - ID vide?:', !formData.id);
    console.log('🔍 VALIDATION - ID === ""?:', formData.id === '');
    console.log('🔍 VALIDATION - parseInt(ID):', parseInt(formData.id));
    console.log('🔍 VALIDATION - isNaN(parseInt(ID)):', isNaN(parseInt(formData.id)));

    // Validation de l'ID
    if (!formData.id || formData.id === '' || isNaN(parseInt(formData.id))) {
      newErrors.id = 'ID de la monture manquant ou invalide';
      console.log('❌ VALIDATION ÉCHOUÉE - ID invalide:', formData.id);
    } else {
      console.log('✅ VALIDATION RÉUSSIE - ID valide:', formData.id);
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    }

    if (!formData.price) {
      newErrors.price = 'Le prix est obligatoire';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Le prix doit être positif';
      }
    }

    if (!formData.quantity && formData.quantity !== '0') {
      newErrors.quantity = 'La quantité est obligatoire';
    } else {
      const quantity = parseInt(formData.quantity);
      if (isNaN(quantity) || quantity < 0) {
        newErrors.quantity = 'La quantité doit être >= 0';
      }
    }

    if (!formData.categorie) {
      newErrors.categorie = 'La catégorie est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fonction pour formater le prix
  const formatPrice = (price) => {
    try {
      const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
      return new Intl.NumberFormat('ar-TN', {
        style: 'currency',
        currency: 'TND',
        minimumFractionDigits: 3
      }).format(numPrice);
    } catch (error) {
      const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
      return `${numPrice.toFixed(3)} DT`;
    }
  };

  // javascript
  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizeNumberString = (v) => {
      if (v === null || v === undefined) return '';
      const s = String(v).trim();
      if (s === '') return '';
      // Remplacer la virgule par un point si l'utilisateur a saisi une virgule
      const normalized = s.replace(',', '.');
      const n = Number(normalized);
      return Number.isFinite(n) ? String(n) : '';
    };

    const normalizeIntString = (v) => {
      if (v === null || v === undefined) return '';
      const s = String(v).trim();
      if (s === '') return '';
      const normalized = s.replace(',', '.');
      const n = parseInt(Number(normalized));
      return Number.isFinite(n) ? String(n) : '';
    };

    console.log('🚀 SUBMIT - FormData avant validation:', formData);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');

    try {
      if (selectedImages.length > 0) {
        const formDataToSend = new FormData();

        // Champs obligatoires — convertir explicitement et vérifier
        const idStr = normalizeIntString(formData.id);
        const priceStr = normalizeNumberString(formData.price);
        const quantityStr = normalizeIntString(formData.quantity);

        if (!idStr) {
          setErrors({ id: 'ID invalide' });
          setIsLoading(false);
          return;
        }
        if (!priceStr) {
          setErrors({ price: 'Prix invalide' });
          setIsLoading(false);
          return;
        }
        if (quantityStr === '') {
          setErrors({ quantity: 'Quantité invalide' });
          setIsLoading(false);
          return;
        }

        formDataToSend.append('id', idStr);
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', priceStr);
        formDataToSend.append('quantity', quantityStr);
        formDataToSend.append('isAvailable', String(!!formData.isAvailable));
        formDataToSend.append('categorie', formData.categorie);

        // Optionnels — n'ajouter que si valides
        if (formData.marque) formDataToSend.append('marque', formData.marque);
        if (formData.couleur) formDataToSend.append('couleur', formData.couleur);
        if (formData.gender) formDataToSend.append('gender', formData.gender);
        if (formData.taille) formDataToSend.append('taille', formData.taille);
        if (formData.typeMonture) formDataToSend.append('typeMonture', formData.typeMonture);
        if (formData.materiauProduit) formDataToSend.append('materiauProduit', formData.materiauProduit);
        if (formData.formeProduit) formDataToSend.append('formeProduit', formData.formeProduit);

        // Dimensions (float) — n'ajouter que si valides
        const largeurTotale = normalizeNumberString(formData.largeurTotale);
        if (largeurTotale) formDataToSend.append('largeurTotale', largeurTotale);

        const largeurVerre = normalizeNumberString(formData.largeurVerre);
        if (largeurVerre) formDataToSend.append('largeurVerre', largeurVerre);

        const hauteurVerre = normalizeNumberString(formData.hauteurVerre);
        if (hauteurVerre) formDataToSend.append('hauteurVerre', hauteurVerre);

        const largeurPont = normalizeNumberString(formData.largeurPont);
        if (largeurPont) formDataToSend.append('largeurPont', largeurPont);

        const longueurBranche = normalizeNumberString(formData.longueurBranche);
        if (longueurBranche) formDataToSend.append('longueurBranche', longueurBranche);

        // Images nouvelles
        selectedImages.forEach((image) => {
          formDataToSend.append('images', image);
        });

        // Images existantes à conserver
        existingImages.forEach((imageUrl) => {
          formDataToSend.append('existingImages', imageUrl);
        });

        // Laisser le browser définir Content-Type (boundary) ; préciser Accept
        const response = await fetch('http://localhost:8089/api/v1/produit/update', {
          method: 'PUT',
          headers: {
            'Accept': 'application/json'
          },
          body: formDataToSend
        });

        if (response.ok) {
          setSuccessMessage('Monture modifiée avec succès !');
          setSelectedImages([]);
          setImagesPreviews([]);
          if (onSuccess) setTimeout(() => onSuccess(), 1500);
        } else {
          let errorMessage = 'Une erreur est survenue lors de la modification.';
          try {
            const errorData = await response.json();
            if (errorData.message) errorMessage = errorData.message;
            else if (errorData.errors) {
              setErrors(errorData.errors);
              setIsLoading(false);
              return;
            }
          } catch (e) {
            errorMessage = `Erreur HTTP: ${response.status}`;
          }
          setErrors({ general: errorMessage });
        }
      } else {
        // JSON path — garder la logique existante mais normaliser les nombres
        const dataToSend = {
          id: Number(normalizeIntString(formData.id)),
          name: formData.name,
          description: formData.description,
          price: Number(normalizeNumberString(formData.price)),
          quantity: Number(normalizeIntString(formData.quantity)),
          marque: formData.marque || null,
          couleur: formData.couleur || null,
          isAvailable: !!formData.isAvailable,
          categorie: formData.categorie,
          gender: formData.gender || null,
          taille: formData.taille || null,
          typeMonture: formData.typeMonture || null,
          materiauProduit: formData.materiauProduit || null,
          formeProduit: formData.formeProduit || null,
          largeurTotale: normalizeNumberString(formData.largeurTotale) ? Number(normalizeNumberString(formData.largeurTotale)) : null,
          largeurVerre: normalizeNumberString(formData.largeurVerre) ? Number(normalizeNumberString(formData.largeurVerre)) : null,
          hauteurVerre: normalizeNumberString(formData.hauteurVerre) ? Number(normalizeNumberString(formData.hauteurVerre)) : null,
          largeurPont: normalizeNumberString(formData.largeurPont) ? Number(normalizeNumberString(formData.largeurPont)) : null,
          longueurBranche: normalizeNumberString(formData.longueurBranche) ? Number(normalizeNumberString(formData.longueurBranche)) : null,
          imageUrl: existingImages
        };

        console.log('📤 SUBMIT - Données à envoyer (JSON):', dataToSend);

        const response = await fetch('http://localhost:8089/api/v1/produit/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(dataToSend)
        });

        if (response.ok) {
          setSuccessMessage('Monture modifiée avec succès !');
          if (onSuccess) setTimeout(() => onSuccess(), 1500);
        } else {
          let errorMessage = 'Une erreur est survenue lors de la modification.';
          try {
            const errorData = await response.json();
            if (errorData.message) errorMessage = errorData.message;
            else if (errorData.errors) {
              setErrors(errorData.errors);
              setIsLoading(false);
              return;
            }
          } catch (e) {
            errorMessage = `Erreur HTTP: ${response.status}`;
          }
          setErrors({ general: errorMessage });
        }
      }
    } catch (error) {
      console.error('❌ SUBMIT - Erreur lors de la modification:', error);
      setErrors({ general: 'Erreur de connexion au serveur.' });
    } finally {
      setIsLoading(false);
    }
  };


  if (!monture) {
    return (
      <div className="card">
        <div className="px-6 py-8 text-center">
          <p className="text-red-500">Aucune monture sélectionnée pour modification.</p>
        </div>
      </div>
    );
  }

  if (loadingRefs) {
    return (
      <div className="card">
        <div className="px-6 py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-default-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="px-6 py-8">
        <div className="text-center mb-6">
          <h4 className="mb-2.5 text-xl font-semibold text-primary">
            Modifier la monture
          </h4>
          <p className="text-base text-default-500">
            Modifiez les informations de "{monture.name}"
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <div className="flex items-center">
              <IconifyIcon icon="mdi:check-circle" className="mr-2" />
              {successMessage}
            </div>
          </div>
        )}

        {errors.id && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <div className="flex items-center">
              <IconifyIcon icon="mdi:alert-circle" className="mr-2" />
              {errors.id}
            </div>
          </div>
        )}

        {errors.general && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <div className="flex items-center">
              <IconifyIcon icon="mdi:alert-circle" className="mr-2" />
              {errors.general}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="text-left w-full">
          {/* Informations de base */}
          <div className="mb-6">
            <h5 className="text-lg font-semibold text-gray-700 mb-4">Informations de base</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="name" className="block font-medium text-default-900 text-sm mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Ex: Monture aviateur classique"
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="categorie" className="block font-medium text-default-900 text-sm mb-2">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  id="categorie"
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleInputChange}
                  className={`form-input ${errors.categorie ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {errors.categorie && (
                  <p className="text-red-500 text-sm mt-1">{errors.categorie}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block font-medium text-default-900 text-sm mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`form-input ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Description détaillée de la monture..."
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="price" className="block font-medium text-default-900 text-sm mb-2">
                  Prix <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`form-input pr-12 ${errors.price ? 'border-red-500' : ''}`}
                    placeholder="0.000"
                    step="0.001"
                    min="0"
                    disabled={isLoading}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    DT
                  </span>
                </div>
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="quantity" className="block font-medium text-default-900 text-sm mb-2">
                  Quantité <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className={`form-input ${errors.quantity ? 'border-red-500' : ''}`}
                  placeholder="0"
                  min="0"
                  disabled={isLoading}
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                )}
              </div>
            </div>
          </div>

          {/* Caractéristiques */}
          <div className="mb-6">
            <h5 className="text-lg font-semibold text-gray-700 mb-4">Caractéristiques</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="mb-4">
                <label htmlFor="marque" className="block font-medium text-default-900 text-sm mb-2">
                  Marque
                </label>
                <select
                  id="marque"
                  name="marque"
                  value={formData.marque}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={isLoading}
                >
                  <option value="">Sélectionner une marque</option>
                  {marques.map(marque => (
                    <option key={marque.id || marque.name} value={marque.name}>
                      {marque.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="couleur" className="block font-medium text-default-900 text-sm mb-2">
                  Couleur
                </label>
                <select
                  id="couleur"
                  name="couleur"
                  value={formData.couleur}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={isLoading}
                >
                  <option value="">Sélectionner une couleur</option>
                  {couleurs.map(couleur => (
                    <option key={couleur.id || couleur.name} value={couleur.name}>
                      {couleur.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="gender" className="block font-medium text-default-900 text-sm mb-2">
                  Genre
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={isLoading}
                >
                  <option value="">Sélectionner un genre</option>
                  {genders.map(gender => (
                    <option key={gender.value} value={gender.value}>{gender.label}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="taille" className="block font-medium text-default-900 text-sm mb-2">
                  Taille
                </label>
                <select
                  id="taille"
                  name="taille"
                  value={formData.taille}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={isLoading}
                >
                  <option value="">Sélectionner une taille</option>
                  {tailles.map(taille => (
                    <option key={taille.value} value={taille.value}>{taille.label}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="typeMonture" className="block font-medium text-default-900 text-sm mb-2">
                  Type de monture
                </label>
                <select
                  id="typeMonture"
                  name="typeMonture"
                  value={formData.typeMonture}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={isLoading}
                >
                  <option value="">Sélectionner un type</option>
                  {typesMonture.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="materiauProduit" className="block font-medium text-default-900 text-sm mb-2">
                  Matériau
                </label>
                <select
                  id="materiauProduit"
                  name="materiauProduit"
                  value={formData.materiauProduit}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={isLoading}
                >
                  <option value="">Sélectionner un matériau</option>
                  {materiaux.map(materiau => (
                    <option key={materiau.id || materiau.name} value={materiau.name}>
                      {materiau.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="formeProduit" className="block font-medium text-default-900 text-sm mb-2">
                  Forme
                </label>
                <select
                  id="formeProduit"
                  name="formeProduit"
                  value={formData.formeProduit}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={isLoading}
                >
                  <option value="">Sélectionner une forme</option>
                  {formes.map(forme => (
                    <option key={forme.id || forme.name} value={forme.name}>
                      {forme.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div className="mb-6">
            <h5 className="text-lg font-semibold text-gray-700 mb-4">Dimensions (en mm)</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="mb-4">
                <label htmlFor="largeurTotale" className="block font-medium text-default-900 text-sm mb-2">
                  Largeur totale
                </label>
                <input
                  type="number"
                  id="largeurTotale"
                  name="largeurTotale"
                  value={formData.largeurTotale}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="largeurVerre" className="block font-medium text-default-900 text-sm mb-2">
                  Largeur verre
                </label>
                <input
                  type="number"
                  id="largeurVerre"
                  name="largeurVerre"
                  value={formData.largeurVerre}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="hauteurVerre" className="block font-medium text-default-900 text-sm mb-2">
                  Hauteur verre
                </label>
                <input
                  type="number"
                  id="hauteurVerre"
                  name="hauteurVerre"
                  value={formData.hauteurVerre}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="largeurPont" className="block font-medium text-default-900 text-sm mb-2">
                  Largeur pont
                </label>
                <input
                  type="number"
                  id="largeurPont"
                  name="largeurPont"
                  value={formData.largeurPont}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="longueurBranche" className="block font-medium text-default-900 text-sm mb-2">
                  Longueur branche
                </label>
                <input
                  type="number"
                  id="longueurBranche"
                  name="longueurBranche"
                  value={formData.longueurBranche}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Disponibilité */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleInputChange}
                className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                disabled={isLoading}
              />
              <span className="ml-2 text-sm font-medium text-default-900">
                Monture disponible
              </span>
            </label>
          </div>

          {/* Gestion des images */}
          <div className="mb-6">
            <h5 className="text-lg font-semibold text-gray-700 mb-4">Images de la monture</h5>

            {/* Images existantes */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <h6 className="text-md font-medium text-gray-600 mb-2">Images actuelles</h6>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {existingImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Image existante ${index + 1}`}
                        className="w-full h-auto rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => handleExistingImageRemove(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                        title="Supprimer l'image"
                      >
                        <IconifyIcon icon="mdi:close" className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sélection de nouvelles images */}
            <div className="mb-4">
              <label htmlFor="images" className="block font-medium text-default-900 text-sm mb-2">
                Ajouter de nouvelles images
              </label>
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                onChange={handleImageChange}
                multiple
                className="form-input"
                disabled={isLoading}
              />
              {errors.images && (
                <p className="text-red-500 text-sm mt-1">{errors.images}</p>
              )}
            </div>

            {/* Aperçu des nouvelles images */}
            {imagesPreviews.length > 0 && (
              <div className="mb-4">
                <h6 className="text-md font-medium text-gray-600 mb-2">Nouvelles images à ajouter</h6>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imagesPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Aperçu ${index + 1}`}
                        className="w-full h-auto rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                        title="Supprimer l'image"
                      >
                        <IconifyIcon icon="mdi:close" className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {existingImages.length === 0 && imagesPreviews.length === 0 && (
              <p className="text-center text-gray-500 text-sm">
                Aucune image disponible
              </p>
            )}
          </div>

          {/* Aperçu de la monture modifiée */}
          {formData.name && formData.categorie && formData.price && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <h5 className="text-sm font-semibold text-gray-700 mb-3">Aperçu de la monture modifiée :</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="bg-white border-2 border-dashed border-blue-300 px-3 py-2 rounded-lg">
                    <span className="font-semibold text-blue-600">{formData.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Nom</p>
                </div>
                <div>
                  <div className="bg-white border-2 border-dashed border-blue-300 px-3 py-2 rounded-lg">
                    <span className="font-semibold text-purple-600">
                      {categories.find(c => c.value === formData.categorie)?.label || formData.categorie}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Catégorie</p>
                </div>
                <div>
                  <div className="bg-white border-2 border-dashed border-blue-300 px-3 py-2 rounded-lg">
                    <span className="font-semibold text-green-600">{formatPrice(formData.price)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Prix</p>
                </div>
                <div>
                  <div className="bg-white border-2 border-dashed border-blue-300 px-3 py-2 rounded-lg">
                    <span className={`font-semibold ${formData.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {formData.isAvailable ? '✓ Dispo' : '✗ Indispo'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Statut</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="btn bg-default-200 text-default-600 hover:bg-default-300 flex-1"
              disabled={isLoading}
            >
              <div className="flex items-center justify-center">
                <IconifyIcon icon="mdi:close" className="mr-2" />
                Annuler
              </div>
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className={`btn bg-primary text-white flex-1 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-600'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <IconifyIcon icon="mdi:loading" className="animate-spin mr-2" />
                  Modification en cours...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <IconifyIcon icon="mdi:content-save" className="mr-2" />
                  Sauvegarder les modifications
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormulaireModification;
