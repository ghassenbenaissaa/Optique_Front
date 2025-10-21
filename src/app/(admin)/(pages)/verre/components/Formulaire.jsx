import { useState } from 'react';
import IconifyIcon from '@/components/client-wrapper/IconifyIcon';
import { addVerre } from '../services/verreService';
import { MateriauVerre } from '../types';

const Formulaire = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    type: '',
    indice: '',
    materiau: '',
    basePrice: ''
  });
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type.trim()) {
      newErrors.type = 'Le type est obligatoire';
    }

    if (!formData.indice) {
      newErrors.indice = "L'indice est obligatoire";
    } else {
      const indice = parseFloat(formData.indice);
      if (isNaN(indice) || indice <= 0) {
        newErrors.indice = "L'indice doit être un nombre positif";
      }
    }

    if (!formData.materiau.trim()) {
      newErrors.materiau = 'Le matériau est obligatoire';
    }

    if (!formData.basePrice) {
      newErrors.basePrice = 'Le prix de base est obligatoire';
    } else {
      const price = parseFloat(formData.basePrice);
      if (isNaN(price) || price < 0) {
        newErrors.basePrice = 'Le prix doit être un nombre positif ou égal à zéro';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fonction pour formater le prix en dinars tunisiens
  const formatPrice = (price) => {
    try {
      const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
      return new Intl.NumberFormat('ar-TN', {
        style: 'currency',
        currency: 'TND',
        minimumFractionDigits: 3
      }).format(numPrice);
    } catch (error) {
      // Fallback en cas d'erreur de formatage
      const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
      return `${numPrice.toFixed(3)} DT`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');

    try {
      const dataToSend = {
        type: formData.type,
        indice: parseFloat(formData.indice),
        materiau: formData.materiau,
        basePrice: parseFloat(formData.basePrice),
        isAvailable: formData.isAvailable
      };

      const response = await addVerre(dataToSend);

      if (response.ok) {
        setSuccessMessage('Verre ajouté avec succès !');

        // Reset du formulaire après succès
        setFormData({
          type: '',
          indice: '',
          materiau: '',
          basePrice: '',
          isAvailable: true
        });

        // Appeler onSuccess après un délai pour laisser voir le message de succès
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      } else {
        // Gestion des erreurs avec le nouveau format d'API
        let errorMessage = "Une erreur est survenue lors de l'ajout du verre.";
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.errors) {
            setErrors(errorData.errors);
            return;
          }
        } catch (e) {
          errorMessage = `Erreur HTTP: ${response.status}`;
        }
        setErrors({ general: errorMessage });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du verre:", error);
      setErrors({ general: 'Erreur de connexion au serveur.' });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="card">
      <div className="px-6 py-8">
        <div className="text-center mb-6">
          <h4 className="mb-2.5 text-xl font-semibold text-primary">
            Ajouter un nouveau verre
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="type" className="block font-medium text-default-900 text-sm mb-2">
                Type de verre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`form-input ${errors.type ? 'border-red-500' : ''}`}
                placeholder="Ex: Progressif, Unifocal, Bifocal..."
                disabled={isLoading}
              />
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="indice" className="block font-medium text-default-900 text-sm mb-2">
                Indice de réfraction <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="indice"
                name="indice"
                value={formData.indice}
                onChange={handleInputChange}
                className={`form-input ${errors.indice ? 'border-red-500' : ''}`}
                placeholder="Ex: 1.5, 1.6, 1.67..."
                step="0.01"
                min="1"
                max="2"
                disabled={isLoading}
              />
              {errors.indice && (
                <p className="text-red-500 text-sm mt-1">{errors.indice}</p>
              )}
              <p className="text-sm text-default-500 mt-1">
                Généralement entre 1.5 et 1.9
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="materiau" className="block font-medium text-default-900 text-sm mb-2">
                Matériau <span className="text-red-500">*</span>
              </label>
              <select
                id="materiau"
                name="materiau"
                value={formData.materiau}
                onChange={handleInputChange}
                className={`form-input ${errors.materiau ? 'border-red-500' : ''}`}
                disabled={isLoading}
              >
                <option value="">Sélectionner un matériau</option>
                {[MateriauVerre.MINERAL, MateriauVerre.ORGANIQUE, MateriauVerre.POLYCARBONATE, MateriauVerre.TRIVEX, MateriauVerre.HI_INDEX].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              {errors.materiau && (
                <p className="text-red-500 text-sm mt-1">{errors.materiau}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="basePrice" className="block font-medium text-default-900 text-sm mb-2">
                Prix de base <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="basePrice"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  className={`form-input pr-12 ${errors.basePrice ? 'border-red-500' : ''}`}
                  placeholder="0.000"
                  step="0.001"
                  min="0"
                  disabled={isLoading}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                  DT
                </span>
              </div>
              {errors.basePrice && (
                <p className="text-red-500 text-sm mt-1">{errors.basePrice}</p>
              )}
              <p className="text-sm text-default-500 mt-1">
                Prix en dinars tunisiens (HT)
              </p>
            </div>
          </div>

          {/* Aperçu du verre */}
          {formData.type && formData.indice && formData.materiau && formData.basePrice && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <h5 className="text-sm font-semibold text-gray-700 mb-3">Aperçu du verre :</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="bg-white border-2 border-dashed border-blue-300 px-3 py-2 rounded-lg">
                    <span className="font-semibold text-blue-600">{formData.type}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Type</p>
                </div>
                <div>
                  <div className="bg-white border-2 border-dashed border-blue-300 px-3 py-2 rounded-lg">
                    <span className="font-mono font-semibold text-primary">{formData.indice}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Indice</p>
                </div>
                <div>
                  <div className="bg-white border-2 border-dashed border-blue-300 px-3 py-2 rounded-lg">
                    <span className="font-semibold text-gray-600">{formData.materiau}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Matériau</p>
                </div>
                <div>
                  <div className="bg-white border-2 border-dashed border-blue-300 px-3 py-2 rounded-lg">
                    <span className="font-semibold text-green-600">{formatPrice(formData.basePrice)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Prix</p>
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
                  Ajouter le verre
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
