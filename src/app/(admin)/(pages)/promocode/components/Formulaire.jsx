import { useState } from 'react';
import IconifyIcon from '@/components/client-wrapper/IconifyIcon';
import { promoCodeService } from '../services/promocodeService';

const Formulaire = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    code: '',
    remisePourcentage: '',
    dateExpiration: ''
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

    if (!formData.code.trim()) {
      newErrors.code = 'Le code promo est obligatoire';
    } else if (formData.code.length < 3) {
      newErrors.code = 'Le code promo doit contenir au moins 3 caractères';
    }

    if (!formData.remisePourcentage) {
      newErrors.remisePourcentage = 'Le pourcentage de remise est obligatoire';
    } else {
      const pourcentage = parseFloat(formData.remisePourcentage);
      if (isNaN(pourcentage) || pourcentage <= 0 || pourcentage > 100) {
        newErrors.remisePourcentage = 'Le pourcentage doit être entre 1 et 100';
      }
    }

    if (!formData.dateExpiration) {
      newErrors.dateExpiration = 'La date d\'expiration est obligatoire';
    } else {
      const today = new Date();
      const expirationDate = new Date(formData.dateExpiration);
      if (expirationDate <= today) {
        newErrors.dateExpiration = 'La date d\'expiration doit être dans le futur';
      }
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
      const dataToSend = {
        ...formData,
        remisePourcentage: parseFloat(formData.remisePourcentage)
      };

      await promoCodeService.addPromoCode(dataToSend);

      setSuccessMessage('Code promo ajouté avec succès !');
      setFormData({ code: '', remisePourcentage: '', dateExpiration: '' });

      // Appeler onSuccess après un délai pour laisser voir le message de succès
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du code promo:', error);
      const errorData = error?.response?.data;
      if (errorData?.message) {
        setErrors({ general: errorData.message });
      }
      else if (errorData?.errors) {
        setErrors(errorData.message || 'Erreur de validation');
      }
      else {
        setErrors({ general: 'Une erreur est survenue lors de l\'ajout du code promo.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Générer un code promo aléatoire
  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code: result }));
  };

  // Obtenir la date minimum (demain)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="card">
      <div className="px-6 py-8">
        <div className="text-center mb-6">
          <h4 className="mb-2.5 text-xl font-semibold text-primary">
            Ajouter un nouveau code promo
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
            <label htmlFor="code" className="block font-medium text-default-900 text-sm mb-2">
              Code promo <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className={`form-input flex-1 font-mono uppercase ${errors.code ? 'border-red-500' : ''}`}
                placeholder="Ex: PROMO2024"
                disabled={isLoading}
                style={{ textTransform: 'uppercase' }}
              />
              <button
                type="button"
                onClick={generateRandomCode}
                className="btn bg-secondary text-white px-4 whitespace-nowrap"
                disabled={isLoading}
                title="Générer un code aléatoire"
              >
                <IconifyIcon icon="mdi:dice-5" className="mr-1" />
                Générer
              </button>
            </div>
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code}</p>
            )}
            <p className="text-sm text-default-500 mt-1">
              <IconifyIcon icon="mdi:information" className="inline mr-1" />
              Le code sera automatiquement en majuscules
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="remisePourcentage" className="block font-medium text-default-900 text-sm mb-2">
              Pourcentage de remise <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="remisePourcentage"
                name="remisePourcentage"
                value={formData.remisePourcentage}
                onChange={handleInputChange}
                className={`form-input pr-12 ${errors.remisePourcentage ? 'border-red-500' : ''}`}
                placeholder="Ex: 20"
                min="1"
                max="100"
                step="0.01"
                disabled={isLoading}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                %
              </span>
            </div>
            {errors.remisePourcentage && (
              <p className="text-red-500 text-sm mt-1">{errors.remisePourcentage}</p>
            )}
            <p className="text-sm text-default-500 mt-1">
              Valeur entre 1% et 100%
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="dateExpiration" className="block font-medium text-default-900 text-sm mb-2">
              Date d'expiration <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dateExpiration"
              name="dateExpiration"
              value={formData.dateExpiration}
              onChange={handleInputChange}
              className={`form-input ${errors.dateExpiration ? 'border-red-500' : ''}`}
              min={getMinDate()}
              disabled={isLoading}
            />
            {errors.dateExpiration && (
              <p className="text-red-500 text-sm mt-1">{errors.dateExpiration}</p>
            )}
            <p className="text-sm text-default-500 mt-1">
              <IconifyIcon icon="mdi:calendar" className="inline mr-1" />
              La date doit être dans le futur
            </p>
          </div>

          {/* Aperçu du code promo */}
          {formData.code && formData.remisePourcentage && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Aperçu du code promo :</h5>
              <div className="flex items-center justify-center gap-3">
                <div className="bg-white border-2 border-dashed border-blue-300 px-4 py-2 rounded-lg">
                  <span className="font-mono font-bold text-lg text-blue-600">{formData.code}</span>
                </div>
                <div className="text-green-600 font-semibold text-lg">
                  {formData.remisePourcentage}% de remise
                </div>
              </div>
              {formData.dateExpiration && (
                <p className="text-center text-sm text-gray-600 mt-2">
                  Valide jusqu'au {new Date(formData.dateExpiration).toLocaleDateString('fr-FR')}
                </p>
              )}
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
                  Ajouter le code promo
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
