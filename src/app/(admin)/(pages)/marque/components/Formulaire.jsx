import { useState } from 'react';
import IconifyIcon from '@/components/client-wrapper/IconifyIcon';
import { marqueService } from '../services/marqueService';

const Formulaire = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validation du fichier
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Format d\'image non supporté. Utilisez JPG, PNG, GIF ou WebP.'
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          image: 'L\'image ne doit pas dépasser 5MB.'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('image');
    if (fileInput) fileInput.value = '';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');

    try {
      // Utilisation du service pour ajouter une marque
      await marqueService.addMarque({
        name: formData.name,
        image: formData.image,
      });

      setSuccessMessage('Marque ajoutée avec succès !');
      setFormData({ name: '', image: null });
      setImagePreview(null);

      // Reset file input
      const fileInput = document.getElementById('image');
      if (fileInput) fileInput.value = '';

      // Appeler onSuccess après un délai pour laisser voir le message de succès
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      const errorData = error?.response?.data;
      if (errorData?.message) {
        setErrors({ general: errorData.message });
      }
      else if (errorData?.errors) {
        setErrors(errorData.message || 'Erreur de validation');
      }
      else {
        setErrors({ general: 'Une erreur est survenue lors de l\'ajout de la marque.' });
      }
      console.error('Erreur lors de l\'ajout de la marque:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="px-6 py-8">
        <div className="text-center mb-6">
          <h4 className="mb-2.5 text-xl font-semibold text-primary">
            Ajouter une nouvelle marque
          </h4>
          <p className="text-base text-default-500">Remplissez les informations ci-dessous</p>
        </div>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <div className="flex items-center">
              <IconifyIcon icon="mdi:check-circle" className="mr-2" />
              {successMessage}
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
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium text-default-900 text-sm mb-2">
              Nom de la marque <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`form-input ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Ex: Ray-Ban, Oakley, Persol..."
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block font-medium text-default-900 text-sm mb-2">
              Logo de la marque
            </label>

            {/* Zone d'upload */}
            <div className="border-2 border-dashed border-default-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Aperçu logo"
                      className="w-32 h-32 object-contain rounded-lg border border-default-200 bg-white p-2"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      disabled={isLoading}
                    >
                      <IconifyIcon icon="mdi:close" className="text-xs" />
                    </button>
                  </div>
                  <p className="text-sm text-default-600">
                    Logo sélectionné : {formData.image?.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => document.getElementById('image').click()}
                    className="btn bg-secondary text-white btn-sm"
                    disabled={isLoading}
                  >
                    <IconifyIcon icon="mdi:image-edit" className="mr-2" />
                    Changer le logo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <IconifyIcon icon="mdi:cloud-upload" className="text-4xl text-default-400 mx-auto" />
                  <div>
                    <button
                      type="button"
                      onClick={() => document.getElementById('image').click()}
                      className="btn bg-primary text-white btn-sm"
                      disabled={isLoading}
                    >
                      <IconifyIcon icon="mdi:upload" className="mr-2" />
                      Sélectionner un logo
                    </button>
                  </div>
                  <p className="text-sm text-default-500">
                    JPG, PNG, GIF ou WebP (max 5MB)
                  </p>
                </div>
              )}
            </div>

            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              className="hidden"
              disabled={isLoading}
            />

            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
            <p className="text-sm text-default-500 mt-1">
              <IconifyIcon icon="mdi:information" className="inline mr-1" />
              Le logo est optionnel mais recommandé pour une meilleure identification
            </p>
          </div>

          {/* Aperçu de la marque */}
          {formData.name && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <h5 className="text-sm font-semibold text-gray-700 mb-3">Aperçu de la marque :</h5>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Aperçu marque"
                      className="w-20 h-20 object-contain rounded-lg border-2 border-blue-300 bg-white p-2 mx-auto mb-2"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-white border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <IconifyIcon icon="mdi:image-outline" className="text-2xl text-blue-400" />
                    </div>
                  )}
                  <span className="font-semibold text-blue-600">{formData.name}</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`btn bg-primary text-white w-full ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-600'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <IconifyIcon icon="mdi:loading" className="animate-spin mr-2" />
                  Ajout en cours...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <IconifyIcon icon="mdi:plus" className="mr-2" />
                  Ajouter la marque
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Formulaire;
