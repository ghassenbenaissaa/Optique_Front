import { useState, useEffect } from 'react';
import IconifyIcon from '@/components/client-wrapper/IconifyIcon';
import { couleurService } from '../services/couleurService';
import { HEX_COLOR_REGEX } from '../types';

const FormulaireModification = ({ couleur, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    id: couleur?.id || '',
    name: couleur?.name || '',
    codeHex: couleur?.codeHex || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Mettre à jour le formulaire quand la couleur change
  useEffect(() => {
    if (couleur) {
      setFormData({
        id: couleur.id,
        name: couleur.name,
        codeHex: couleur.codeHex
      });
    }
  }, [couleur]);

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
    }

    if (!formData.codeHex.trim()) {
      newErrors.codeHex = 'Le code hexadécimal est obligatoire';
    } else if (!HEX_COLOR_REGEX.test(formData.codeHex)) {
      newErrors.codeHex = 'Le code hexadécimal doit être au format #RRGGBB ou #RGB';
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
      await couleurService.updateCouleur(formData);
      setSuccessMessage('Couleur modifiée avec succès !');

      // Appeler onSuccess après un délai pour laisser voir le message de succès
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(formData);
        }, 1500);
      }
    } catch (error) {
      const errorData = error?.response?.data;
      if (errorData?.errors) {
        setErrors(errorData.errors);
      } else {
        setErrors({ general: 'Une erreur est survenue lors de la modification de la couleur.' });
      }
      console.error('Erreur lors de la modification de la couleur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="px-6 py-8">
        <div className="text-center mb-6">
          <h4 className="mb-2.5 text-xl font-semibold text-primary">
            Modifier la couleur
          </h4>
          <p className="text-base text-default-500">Modifiez les informations de la couleur</p>
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
              Nom de la couleur <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`form-input ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Ex: Rouge, Bleu, Vert..."
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="codeHex" className="block font-medium text-default-900 text-sm mb-2">
              Code hexadécimal <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-mono">
                  #
                </span>
                <input
                  type="text"
                  id="codeHex"
                  name="codeHex"
                  value={formData.codeHex.replace('#', '')}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^A-Fa-f0-9]/g, '').slice(0, 6);
                    handleInputChange({
                      target: {
                        name: 'codeHex',
                        value: '#' + value
                      }
                    });
                  }}
                  className={`form-input pl-8 ${errors.codeHex ? 'border-red-500' : ''}`}
                  placeholder="FF0000"
                  disabled={isLoading}
                  maxLength={6}
                />
              </div>

              {/* Color Picker avec design neutre */}
              <div className="relative">
                <input
                  type="color"
                  value={formData.codeHex || '#000000'}
                  onChange={(e) => {
                    handleInputChange({
                      target: {
                        name: 'codeHex',
                        value: e.target.value.toUpperCase()
                      }
                    });
                  }}
                  className="absolute inset-0 w-12 h-10 opacity-0 cursor-pointer z-10"
                  title="Choisir une couleur"
                  disabled={isLoading}
                />
                <div className="w-12 h-10 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer transition-colors">
                  <IconifyIcon icon="mdi:palette" className="text-blue-500 text-lg" />
                </div>
              </div>

              {/* Color Preview */}
              {formData.codeHex && (
                <div
                  className="w-10 h-10 border border-gray-300 rounded shadow-sm"
                  style={{ backgroundColor: formData.codeHex }}
                  title={`Aperçu de la couleur: ${formData.codeHex}`}
                ></div>
              )}
            </div>
            {errors.codeHex && (
              <p className="text-red-500 text-sm mt-1">{errors.codeHex}</p>
            )}
            <p className="text-sm text-default-500 mt-1">
              <IconifyIcon icon="mdi:information" className="inline mr-1" />
              Utilisez le sélecteur de couleur ou saisissez le code sans le #
            </p>
          </div>

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
                  Modifier la couleur
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
