import { useState, useEffect } from 'react';
import IconifyIcon from '@/components/client-wrapper/IconifyIcon';
import { materiauxService } from '../services/materiauxService';

const FormulaireModification = ({ materiau, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    id: materiau?.id || '',
    name: materiau?.name || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Mettre à jour le formulaire quand le matériau change
  useEffect(() => {
    if (materiau) {
      setFormData({
        id: materiau.id,
        name: materiau.name
      });
    }
  }, [materiau]);

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
      await materiauxService.updateMateriau(formData);
      setSuccessMessage('Matériau modifié avec succès !');

      // Appeler onSuccess après un délai pour laisser voir le message de succès
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(formData);
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
        setErrors({ general: "Une erreur est survenue lors de la modification du matériau." });
      }
      console.error('Erreur lors de la modification du matériau:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="px-6 py-8">
        <div className="text-center mb-6">
          <h4 className="mb-2.5 text-xl font-semibold text-primary">
            Modifier le matériau
          </h4>
          <p className="text-base text-default-500">Modifiez les informations du matériau</p>
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

        {/* Statut actuel du matériau */}
        {materiau && (
          <div className={`mb-6 p-4 rounded-lg border ${
            materiau.available 
              ? 'bg-green-50 border-green-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-lg">{materiau.name}</span>
              </div>
              <div>
                {materiau.available ? (
                  <span className="inline-flex items-center gap-x-1.5 py-0.5 px-2.5 rounded text-xs font-medium bg-success/15 text-success">
                    <IconifyIcon icon="mdi:check-circle" />
                    Disponible
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-x-1.5 py-0.5 px-2.5 rounded text-xs font-medium bg-warning/15 text-warning">
                    <IconifyIcon icon="mdi:pause-circle" />
                    Indisponible
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="text-left w-full">
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium text-default-900 text-sm mb-2">
              Nom du matériau <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`form-input ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Ex: Acétate, Titane, Plastique..."
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
            <p className="text-sm text-default-500 mt-1">
              <IconifyIcon icon="mdi:information" className="inline mr-1" />
              Modifiez le nom du matériau selon vos besoins
            </p>
          </div>

          {/* Aperçu du matériau modifié */}
          {formData.name && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Aperçu des modifications :</h5>
              <div className="flex items-center justify-center">
                <div className="bg-white border-2 border-dashed border-blue-300 px-4 py-2 rounded-lg">
                  <span className="font-semibold text-lg text-blue-600">{formData.name}</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 flex-1"
              disabled={isLoading}
            >
              <IconifyIcon icon="mdi:close" className="mr-2" />
              Annuler
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
                  <IconifyIcon icon="mdi:check" className="mr-2" />
                  Modifier le matériau
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
