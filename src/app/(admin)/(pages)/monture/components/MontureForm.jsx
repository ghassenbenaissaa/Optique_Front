import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronLeft, ChevronRight, Check, X, Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { produitService, referenceDataService } from '../services/produitService';
import { CategorieProduit, GenderProduit, TailleProduit, TypeMonture } from '../types';

const MontureForm = ({ monture = null, onSuccess, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Données de référence
  const [marques, setMarques] = useState([]);
  const [couleurs, setCouleurs] = useState([]);
  const [materiaux, setMateriaux] = useState([]);
  const [formes, setFormes] = useState([]);

  // Images
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Variations
  const [variations, setVariations] = useState([
    { couleur: '', materiauProduit: '', quantity: 0, priceOverride: '', solde: '' }
  ]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: monture ? {
      name: monture.name,
      description: monture.description,
      price: monture.price,
      marque: monture.marque,
      categorie: monture.categorie,
      gender: monture.gender,
      taille: monture.taille,
      typeMonture: monture.typeMonture,
      formeProduit: monture.formeProduit,
      largeurTotale: monture.largeurTotale || '',
      largeurVerre: monture.largeurVerre || '',
      hauteurVerre: monture.hauteurVerre || '',
      largeurPont: monture.largeurPont || '',
      longueurBranche: monture.longueurBranche || '',
    } : {}
  });

  const totalSteps = 4;

  // Charger les données de référence
  useEffect(() => {
    loadReferenceData();
    if (monture) {
      // Charger les variations existantes
      if (monture.variations && monture.variations.length > 0) {
        setVariations(monture.variations.map(v => ({
          id: v.id,
          couleur: v.couleur,
          materiauProduit: v.materiauProduit,
          quantity: v.quantity,
          priceOverride: v.price || '',
          solde: v.solde || '',
        })));
      }
      // Charger les images existantes
      if (monture.imageUrl && monture.imageUrl.length > 0) {
        setImagePreviews(monture.imageUrl);
      }
    }
  }, [monture]);

  const loadReferenceData = async () => {
    try {
      setLoadingData(true);
      const [marquesData, couleursData, materiauxData, formesData] = await Promise.all([
        referenceDataService.getMarques(),
        referenceDataService.getCouleurs(),
        referenceDataService.getMateriaux(),
        referenceDataService.getFormes(),
      ]);
      setMarques(marquesData);
      setCouleurs(couleursData);
      setMateriaux(materiauxData);
      setFormes(formesData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement des données de référence');
    } finally {
      setLoadingData(false);
    }
  };

  // Gestion des images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);

    // Créer les aperçus
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Gestion des variations
  const addVariation = () => {
    setVariations([...variations, { couleur: '', materiauProduit: '', quantity: 0, priceOverride: '', solde: '' }]);
  };

  const removeVariation = (index) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const updateVariation = (index, field, value) => {
    const newVariations = [...variations];
    newVariations[index][field] = value;
    setVariations(newVariations);
  };

  // Navigation
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validation par étape
  const validateStep = () => {
    const values = watch();

    switch (currentStep) {
      case 1:
        if (!values.name || !values.description || !values.price || !values.marque ||
            !values.categorie || !values.gender || !values.taille || !values.typeMonture || !values.formeProduit) {
          toast.error('Veuillez remplir tous les champs obligatoires');
          return false;
        }
        break;
      case 2:
        // Les dimensions sont optionnelles
        break;
      case 3:
        if (!monture && images.length === 0) {
          toast.error('Veuillez ajouter au moins une image');
          return false;
        }
        break;
      case 4:
        if (variations.length === 0 || variations.some(v => !v.couleur || !v.materiauProduit || v.quantity < 0)) {
          toast.error('Veuillez remplir toutes les variations correctement');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      nextStep();
    }
  };

  // Soumission du formulaire
  const onSubmit = async (data) => {
    if (!validateStep()) return;

    try {
      setLoading(true);

      const formData = {
        ...data,
        images: images,
        variations: variations.map(v => ({
          id: v.id,
          couleur: v.couleur,
          materiauProduit: v.materiauProduit,
          quantity: parseInt(v.quantity),
          priceOverride: v.priceOverride ? parseFloat(v.priceOverride) : null,
          solde: v.solde ? parseFloat(v.solde) : null,
        })),
      };

      if (monture) {
        formData.id = monture.id;
        await produitService.updateProduit(formData);
        toast.success('Monture modifiée avec succès');
      } else {
        await produitService.addProduit(formData);
        toast.success('Monture ajoutée avec succès');
      }

      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde de la monture');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du formulaire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Progress bar */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">
            {monture ? 'Modifier la monture' : 'Ajouter une monture'}
          </h2>
          <span className="text-sm text-gray-600">Étape {currentStep} sur {totalSteps}</span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex-1 h-2 rounded-full transition-all ${
                step <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span className={currentStep === 1 ? 'text-blue-600 font-semibold' : ''}>Informations</span>
          <span className={currentStep === 2 ? 'text-blue-600 font-semibold' : ''}>Dimensions</span>
          <span className={currentStep === 3 ? 'text-blue-600 font-semibold' : ''}>Images</span>
          <span className={currentStep === 4 ? 'text-blue-600 font-semibold' : ''}>Variations</span>
        </div>
      </div>

      {/* Form content */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        {/* Étape 1 - Informations générales */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nom */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du produit <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name', { required: true })}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Ray-Ban Aviator Classic"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('description', { required: true })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez le produit..."
                />
              </div>

              {/* Prix */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix de base (TND) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('price', { required: true, min: 0 })}
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Marque */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marque <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('marque', { required: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une marque</option>
                  {marques.map((m) => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('categorie', { required: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {Object.values(CategorieProduit).map((cat) => (
                    <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('gender', { required: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un genre</option>
                  {Object.values(GenderProduit).map((gender) => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>

              {/* Taille */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taille <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('taille', { required: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une taille</option>
                  {Object.values(TailleProduit).map((taille) => (
                    <option key={taille} value={taille}>{taille.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>

              {/* Type de monture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de monture <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('typeMonture', { required: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un type</option>
                  {Object.values(TypeMonture).map((type) => (
                    <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>

              {/* Forme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Forme <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('formeProduit', { required: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une forme</option>
                  {formes.map((f) => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Étape 2 - Dimensions */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dimensions (optionnelles)</h3>
            <p className="text-sm text-gray-600 mb-4">Toutes les mesures sont en millimètres (mm)</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Largeur totale */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Largeur totale (mm)
                </label>
                <input
                  {...register('largeurTotale')}
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.0"
                />
              </div>

              {/* Largeur verre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Largeur verre (mm)
                </label>
                <input
                  {...register('largeurVerre')}
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.0"
                />
              </div>

              {/* Hauteur verre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hauteur verre (mm)
                </label>
                <input
                  {...register('hauteurVerre')}
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.0"
                />
              </div>

              {/* Largeur pont */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Largeur pont (mm)
                </label>
                <input
                  {...register('largeurPont')}
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.0"
                />
              </div>

              {/* Longueur branche */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longueur branche (mm)
                </label>
                <input
                  {...register('longueurBranche')}
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.0"
                />
              </div>
            </div>

            {/* Illustration des dimensions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-blue-800">
                💡 <strong>Astuce :</strong> Les dimensions aident vos clients à choisir la monture la plus adaptée à leur morphologie.
              </p>
            </div>
          </div>
        )}

        {/* Étape 3 - Images */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Images du produit</h3>

            {/* Upload zone */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Cliquez pour ajouter des images</p>
                <p className="text-sm text-gray-500">PNG, JPG, JPEG jusqu'à 10MB</p>
              </label>
            </div>

            {/* Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Principal
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Étape 4 - Variations */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Variations du produit</h3>
              <button
                type="button"
                onClick={addVariation}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <Plus size={16} />
                Ajouter une variation
              </button>
            </div>

            <div className="space-y-4">
              {variations.map((variation, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Variation #{index + 1}</h4>
                    {variations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariation(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Couleur */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Couleur <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={variation.couleur}
                        onChange={(e) => updateVariation(index, 'couleur', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner</option>
                        {couleurs.map((c) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Matériau */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Matériau <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={variation.materiauProduit}
                        onChange={(e) => updateVariation(index, 'materiauProduit', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner</option>
                        {materiaux.map((m) => (
                          <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Quantité */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantité <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={variation.quantity}
                        onChange={(e) => updateVariation(index, 'quantity', e.target.value)}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Prix override */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix spécifique (TND)
                      </label>
                      <input
                        type="number"
                        value={variation.priceOverride}
                        onChange={(e) => updateVariation(index, 'priceOverride', e.target.value)}
                        step="0.01"
                        min="0"
                        placeholder="Prix de base"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Solde */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Solde (%)
                      </label>
                      <input
                        type="number"
                        value={variation.solde}
                        onChange={(e) => updateVariation(index, 'solde', e.target.value)}
                        step="0.01"
                        min="0"
                        max="100"
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {variations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Aucune variation ajoutée</p>
                <button
                  type="button"
                  onClick={addVariation}
                  className="mt-4 text-blue-500 hover:text-blue-700"
                >
                  Ajouter votre première variation
                </button>
              </div>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <button
            type="button"
            onClick={currentStep === 1 ? onCancel : prevStep}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {currentStep === 1 ? (
              <>
                <X size={20} />
                <span>Annuler</span>
              </>
            ) : (
              <>
                <ChevronLeft size={20} />
                <span>Précédent</span>
              </>
            )}
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <span>Suivant</span>
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Check size={20} />
                  <span>{monture ? 'Modifier' : 'Ajouter'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MontureForm;

